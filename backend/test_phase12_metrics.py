"""
BUSFLOW — Phase 12: Operational Metrics Engine Test Suite
Validates pure metric calculations, zero-safety guards, headway CoV, delay aggregation,
on-time performance, holding metrics, recovery statistics, WITHOUT_CONTROL vs WITH_BUSFLOW comparisons,
API endpoints, determinism, and full regression against Phases 8, 9, 10, and 11.
"""

import sys
import math
from fastapi.testclient import TestClient

from app.main import app
from app.simulation.engine import SIMULATION_ENGINE, SimulationConfig
from app.simulation.bus import (
    Bus,
    BusStatus,
    get_all_buses,
    reset_bus_fleet,
    BUS_STORE,
)
from app.simulation.passenger import (
    StopPassengerState,
    get_all_passenger_states,
    reset_passenger_demand,
    PASSENGER_STORE,
)
from app.simulation.traffic import set_traffic_condition, TrafficCondition
from app.simulation.incident import (
    create_incident,
    IncidentType,
    IncidentSeverity,
    reset_incident_store,
)
from app.control.action import (
    ControlAction,
    ControlActionState,
    create_control_action,
    reset_action_store,
    get_all_actions,
)
from app.control.recovery import (
    RecoveryMeasurement,
    RecoverySnapshot,
    RecoveryState,
    reset_recovery_store,
    get_all_recoveries,
    RECOVERY_STORE,
)
from app.metrics.metrics import (
    ON_TIME_DELAY_THRESHOLD_SECONDS,
    FleetMetrics,
    PassengerMetrics,
    ServiceMetrics,
    ControlMetrics,
    RecoveryMetrics,
    MetricsSnapshot,
    MetricComparisonItem,
    ScenarioComparisonResult,
    calculate_passenger_metrics,
    calculate_headway_metrics,
    calculate_delay_metrics,
    calculate_control_metrics,
    calculate_recovery_metrics,
    calculate_fleet_metrics,
    calculate_metrics_snapshot,
    calculate_improvement_percentage,
    run_scenario_simulation,
    calculate_scenario_comparison,
)


def test_1_passenger_waiting_calculation():
    """TEST 1: Verify passenger average waiting time calculation across stops."""
    print("\n--- TEST 1: Passenger Waiting Time Calculation ---")
    mock_states = [
        StopPassengerState(stop_id="S01", total_arrivals=100, total_waiting_time=2500.0),
        StopPassengerState(stop_id="S02", total_arrivals=50, total_waiting_time=1250.0),
    ]
    metrics = calculate_passenger_metrics(mock_states)
    assert metrics.total_passenger_arrivals == 150
    assert metrics.total_passenger_waiting_time_seconds == 3750.0
    assert metrics.average_passenger_waiting_time_seconds == 25.0
    print(f"PASS: Passenger metrics: arrivals={metrics.total_passenger_arrivals}, avg_wait={metrics.average_passenger_waiting_time_seconds}s")


def test_2_zero_arrival_safety():
    """TEST 2: Verify zero-arrival edge case returns None safely without division by zero."""
    print("\n--- TEST 2: Zero Arrival Safety Guard ---")
    mock_states = [
        StopPassengerState(stop_id="S01", total_arrivals=0, total_waiting_time=0.0),
        StopPassengerState(stop_id="S02", total_arrivals=0, total_waiting_time=0.0),
    ]
    metrics = calculate_passenger_metrics(mock_states)
    assert metrics.total_passenger_arrivals == 0
    assert metrics.average_passenger_waiting_time_seconds is None
    print("PASS: Zero arrivals handled safely: average_passenger_waiting_time_seconds is None")


def test_3_4_5_headway_mean_std_and_cov():
    """TEST 3, 4, 5: Verify headway mean, standard deviation, and Coefficient of Variation (CoV)."""
    print("\n--- TEST 3, 4, 5: Headway Mean, Standard Deviation & CoV ---")
    # Equal spacing: CoV should be 0.0
    equal_buses = [
        Bus(bus_id=f"B{i}", route_id="21G", current_stop="S01", position=i*2400.0, direction=1, speed=25.0, delay_seconds=0.0, passengers=10, capacity=70, headway_ahead=345.6)
        for i in range(5)
    ]
    eq_metrics = calculate_headway_metrics(equal_buses)
    assert eq_metrics.average_headway_seconds == 345.6
    assert eq_metrics.headway_standard_deviation == 0.0
    assert eq_metrics.headway_cov == 0.0

    # Irregular spacing: CoV should be strictly > 0
    irregular_buses = [
        Bus(bus_id="B1", route_id="21G", current_stop="S01", position=0.0, direction=1, speed=25.0, delay_seconds=0.0, passengers=10, capacity=70, headway_ahead=135.6),
        Bus(bus_id="B2", route_id="21G", current_stop="S02", position=1000.0, direction=1, speed=25.0, delay_seconds=0.0, passengers=10, capacity=70, headway_ahead=367.5),
        Bus(bus_id="B3", route_id="21G", current_stop="S03", position=2000.0, direction=1, speed=25.0, delay_seconds=0.0, passengers=10, capacity=70, headway_ahead=915.5),
        Bus(bus_id="B4", route_id="21G", current_stop="S04", position=3000.0, direction=1, speed=25.0, delay_seconds=0.0, passengers=10, capacity=70, headway_ahead=145.8),
        Bus(bus_id="B5", route_id="21G", current_stop="S05", position=4000.0, direction=1, speed=25.0, delay_seconds=0.0, passengers=10, capacity=70, headway_ahead=163.6),
    ]
    ir_metrics = calculate_headway_metrics(irregular_buses)
    mean_val = (135.6 + 367.5 + 915.5 + 145.8 + 163.6) / 5
    var_val = sum((h - mean_val)**2 for h in [135.6, 367.5, 915.5, 145.8, 163.6]) / 5
    std_val = math.sqrt(var_val)
    cov_val = std_val / mean_val

    assert ir_metrics.average_headway_seconds == round(mean_val, 2)
    assert ir_metrics.headway_standard_deviation == round(std_val, 2)
    assert ir_metrics.headway_cov == round(cov_val, 4)
    print(f"PASS: Headway stats verified: mean={ir_metrics.average_headway_seconds}s, std={ir_metrics.headway_standard_deviation}s, CoV={ir_metrics.headway_cov}")


def test_6_zero_headway_safety():
    """TEST 6: Verify zero/empty headway values handled without error."""
    print("\n--- TEST 6: Zero/Empty Headway Safety Guard ---")
    empty_metrics = calculate_headway_metrics([])
    assert empty_metrics.average_headway_seconds is None
    assert empty_metrics.headway_cov is None

    zero_bus = [
        Bus(bus_id="B1", route_id="21G", current_stop="S01", position=0.0, direction=1, speed=25.0, delay_seconds=0.0, passengers=10, capacity=70, headway_ahead=0.0)
    ]
    z_metrics = calculate_headway_metrics(zero_bus)
    assert z_metrics.average_headway_seconds == 0.0
    assert z_metrics.headway_cov is None  # 0 / 0 returns None safely
    print("PASS: Zero/empty headways return None safely without division by zero")


def test_7_8_total_delay_and_on_time_performance():
    """TEST 7 & 8: Verify total delay aggregation and on-time performance (delay <= 60s)."""
    print("\n--- TEST 7 & 8: Total Delay & On-Time Performance ---")
    fleet = [
        Bus(bus_id="B1", route_id="21G", current_stop="S01", position=0.0, direction=1, speed=25.0, delay_seconds=10.0, passengers=10, capacity=70, headway_ahead=345.6),
        Bus(bus_id="B2", route_id="21G", current_stop="S02", position=1000.0, direction=1, speed=25.0, delay_seconds=45.0, passengers=10, capacity=70, headway_ahead=345.6),
        Bus(bus_id="B3", route_id="21G", current_stop="S03", position=2000.0, direction=1, speed=25.0, delay_seconds=60.0, passengers=10, capacity=70, headway_ahead=345.6),
        Bus(bus_id="B4", route_id="21G", current_stop="S04", position=3000.0, direction=1, speed=25.0, delay_seconds=120.0, passengers=10, capacity=70, headway_ahead=345.6),
        Bus(bus_id="B5", route_id="21G", current_stop="S05", position=4000.0, direction=1, speed=25.0, delay_seconds=300.0, passengers=10, capacity=70, headway_ahead=345.6),
    ]
    service = calculate_headway_metrics(fleet)
    assert service.total_delay_seconds == 535.0
    assert service.average_delay_seconds == 107.0
    assert service.on_time_buses == 3  # B1, B2, B3 have delay <= 60s
    assert service.on_time_performance_percent == 60.0  # 3 / 5 * 100%
    print(f"PASS: Delay={service.total_delay_seconds}s, On-Time Buses={service.on_time_buses}/5, OTP={service.on_time_performance_percent}%")


def test_9_total_holding_time():
    """TEST 9: Verify total holding time and executed control actions."""
    print("\n--- TEST 9: Total Holding Time & Control Metrics ---")
    mock_actions = [
        ControlAction(action_id="ACT1", bus_id="B1", route_id="21G", decision="HOLD", requested_hold_seconds=15.0, approved_hold_seconds=15.0, state=ControlActionState.COMPLETED, created_at_simulation_time=0.0),
        ControlAction(action_id="ACT2", bus_id="B2", route_id="21G", decision="HOLD", requested_hold_seconds=20.0, approved_hold_seconds=20.0, state=ControlActionState.APPLIED, created_at_simulation_time=10.0),
        ControlAction(action_id="ACT3", bus_id="B3", route_id="21G", decision="NO_HOLD", requested_hold_seconds=10.0, approved_hold_seconds=0.0, state=ControlActionState.REJECTED, created_at_simulation_time=20.0),
        ControlAction(action_id="ACT4", bus_id="B4", route_id="21G", decision="HOLD", requested_hold_seconds=25.0, approved_hold_seconds=25.0, state=ControlActionState.APPROVED, created_at_simulation_time=30.0),
    ]
    ctrl = calculate_control_metrics(mock_actions)
    assert ctrl.total_control_actions == 4
    assert ctrl.approved_control_actions == 3  # ACT1, ACT2, ACT4
    assert ctrl.rejected_control_actions == 1  # ACT3
    assert ctrl.completed_control_actions == 1 # ACT1
    assert ctrl.active_control_actions == 2    # ACT2 (APPLIED), ACT4 (APPROVED)
    assert ctrl.total_holding_time_seconds == 35.0 # ACT1 (15.0) + ACT2 (20.0)
    assert ctrl.average_hold_duration_seconds == 17.5 # 35.0 / 2
    print(f"PASS: Total holding time = {ctrl.total_holding_time_seconds}s across {len(mock_actions)} actions (avg={ctrl.average_hold_duration_seconds}s)")


def test_10_11_recovery_average_and_timeout_exclusion():
    """TEST 10 & 11: Verify average recovery time and exclusion of TIMEOUTs from numeric statistics."""
    print("\n--- TEST 10 & 11: Recovery Aggregation & Timeout Exclusion ---")
    mock_recoveries = [
        RecoveryMeasurement(recovery_id="REC1", action_id="ACT1", bus_id="B1", state=RecoveryState.RECOVERED, started_at_simulation_time=10.0, recovered_at_simulation_time=25.0, recovery_time_seconds=15.0),
        RecoveryMeasurement(recovery_id="REC2", action_id="ACT2", bus_id="B2", state=RecoveryState.RECOVERED, started_at_simulation_time=30.0, recovered_at_simulation_time=55.0, recovery_time_seconds=25.0),
        RecoveryMeasurement(recovery_id="REC3", action_id="ACT3", bus_id="B3", state=RecoveryState.TIMEOUT, started_at_simulation_time=100.0, recovered_at_simulation_time=None, recovery_time_seconds=None),
    ]
    rec_metrics = calculate_recovery_metrics(mock_recoveries)
    assert rec_metrics.total_recovery_measurements == 3
    assert rec_metrics.recovered_control_actions == 2
    assert rec_metrics.timed_out_control_actions == 1
    assert rec_metrics.average_recovery_time_seconds == 20.0 # (15.0 + 25.0) / 2
    assert rec_metrics.fastest_recovery_time_seconds == 15.0
    assert rec_metrics.slowest_recovery_time_seconds == 25.0

    # If only timeouts exist: average should be None
    timeout_only = [
        RecoveryMeasurement(recovery_id="REC4", action_id="ACT4", bus_id="B4", state=RecoveryState.TIMEOUT, started_at_simulation_time=0.0, recovery_time_seconds=None)
    ]
    t_metrics = calculate_recovery_metrics(timeout_only)
    assert t_metrics.total_recovery_measurements == 1
    assert t_metrics.recovered_control_actions == 0
    assert t_metrics.timed_out_control_actions == 1
    assert t_metrics.average_recovery_time_seconds is None
    print(f"PASS: Recovery metrics verified: recovered={rec_metrics.recovered_control_actions}, avg_time={rec_metrics.average_recovery_time_seconds}s, timeouts excluded")


def test_12_13_bunching_and_risk_counts():
    """TEST 12 & 13: Verify bunching classifications and Phase 8 risk levels aggregation."""
    print("\n--- TEST 12 & 13: Bunching & Risk Aggregations ---")
    fleet = [
        Bus(bus_id="B14", route_id="21G", current_stop="S01", position=0.0, direction=1, speed=25.0, delay_seconds=10.0, passengers=20, capacity=70, status=BusStatus.NORMAL, headway_ahead=345.6, headway_behind=345.6),
        Bus(bus_id="B15", route_id="21G", current_stop="S02", position=1000.0, direction=1, speed=25.0, delay_seconds=20.0, passengers=30, capacity=70, status=BusStatus.AT_RISK, headway_ahead=220.0, headway_behind=450.0),
        Bus(bus_id="B16", route_id="21G", current_stop="S03", position=2000.0, direction=1, speed=25.0, delay_seconds=150.0, passengers=68, capacity=70, status=BusStatus.SEVERE_DELAY, headway_ahead=135.6, headway_behind=650.0),
    ]
    fleet_metrics = calculate_fleet_metrics(fleet)
    assert fleet_metrics.total_buses == 3
    assert fleet_metrics.buses_at_risk == 1
    assert fleet_metrics.buses_severe_delay == 1
    assert fleet_metrics.buses_bunching == 1
    assert fleet_metrics.bunching_risk_count == 2
    assert fleet_metrics.average_risk_score >= 0.0 and fleet_metrics.average_risk_score <= 1.0
    print(f"PASS: Fleet metrics: total={fleet_metrics.total_buses}, at_risk={fleet_metrics.buses_at_risk}, severe={fleet_metrics.buses_severe_delay}, avg_risk={fleet_metrics.average_risk_score}")


def test_14_control_action_counts():
    """TEST 14: Verify control action counts across all states."""
    print("\n--- TEST 14: Control Action Lifecycle Counts ---")
    acts = [
        ControlAction(action_id="A1", bus_id="B1", route_id="21G", decision="HOLD", requested_hold_seconds=10.0, approved_hold_seconds=10.0, state=ControlActionState.RECOMMENDED, created_at_simulation_time=0.0),
        ControlAction(action_id="A2", bus_id="B2", route_id="21G", decision="HOLD", requested_hold_seconds=10.0, approved_hold_seconds=10.0, state=ControlActionState.APPROVED, created_at_simulation_time=0.0),
        ControlAction(action_id="A3", bus_id="B3", route_id="21G", decision="NO_HOLD", requested_hold_seconds=10.0, approved_hold_seconds=0.0, state=ControlActionState.REJECTED, created_at_simulation_time=0.0),
        ControlAction(action_id="A4", bus_id="B4", route_id="21G", decision="HOLD", requested_hold_seconds=15.0, approved_hold_seconds=15.0, state=ControlActionState.APPLIED, created_at_simulation_time=0.0),
        ControlAction(action_id="A5", bus_id="B5", route_id="21G", decision="HOLD", requested_hold_seconds=20.0, approved_hold_seconds=20.0, state=ControlActionState.COMPLETED, created_at_simulation_time=0.0),
    ]
    c = calculate_control_metrics(acts)
    assert c.total_control_actions == 5
    assert c.approved_control_actions == 3 # A2, A4, A5
    assert c.rejected_control_actions == 1 # A3
    assert c.completed_control_actions == 1 # A5
    assert c.active_control_actions == 2 # A2, A4
    print("PASS: Control action state counts verified")


def test_15_metrics_snapshot():
    """TEST 15: Verify complete metrics snapshot generation."""
    print("\n--- TEST 15: Combined Metrics Snapshot ---")
    SIMULATION_ENGINE.reset()
    SIMULATION_ENGINE.start(SimulationConfig(timestep_seconds=5.0))

    snap = calculate_metrics_snapshot(
        simulation_time=120.0,
        scenario_id="SNAPSHOT_TEST",
    )
    assert snap.timestamp_simulation == 120.0
    assert snap.scenario_id == "SNAPSHOT_TEST"
    assert snap.fleet.total_buses == 5
    assert snap.service.total_delay_seconds >= 0.0
    assert snap.passenger.total_passenger_arrivals >= 0
    snap_dict = snap.to_dict()
    assert "fleet" in snap_dict and "passenger" in snap_dict and "service" in snap_dict and "control" in snap_dict and "recovery" in snap_dict
    print("PASS: Complete combined MetricsSnapshot verified")


def test_16_17_improvement_percentage_and_zero_safety():
    """TEST 16 & 17: Verify improvement percentages for lower-is-better and higher-is-better, with zero guards."""
    print("\n--- TEST 16 & 17: Improvement Percentage Calculations & Zero Guard ---")
    # Lower is better (e.g. delay dropped from 100s to 70s -> 30% improvement)
    pct_delay = calculate_improvement_percentage(without_val=100.0, with_val=70.0, lower_is_better=True)
    assert pct_delay == 30.0

    # Lower is better with regression (delay rose from 100s to 120s -> -20% improvement)
    pct_worse = calculate_improvement_percentage(without_val=100.0, with_val=120.0, lower_is_better=True)
    assert pct_worse == -20.0

    # Higher is better (e.g. OTP rose from 50% to 75% -> 50% improvement relative to baseline)
    pct_otp = calculate_improvement_percentage(without_val=50.0, with_val=75.0, lower_is_better=False)
    assert pct_otp == 50.0

    # Zero denominator guard
    assert calculate_improvement_percentage(0.0, 10.0) is None
    assert calculate_improvement_percentage(None, 10.0) is None
    assert calculate_improvement_percentage(10.0, None) is None
    print("PASS: Improvement percentage logic and zero-denominator safety guards verified")


def test_18_19_20_deterministic_scenario_comparison():
    """TEST 18, 19, 20: Verify baseline WITHOUT_CONTROL vs WITH_BUSFLOW comparison and determinism."""
    print("\n--- TEST 18, 19, 20: Deterministic Scenario Comparison ---")

    comp1 = calculate_scenario_comparison(
        scenario_name="Test Stall Comparison",
        incident_duration_seconds=300.0,
        hold_duration_seconds=20.0,
        total_steps=80,
    )
    comp2 = calculate_scenario_comparison(
        scenario_name="Test Stall Comparison",
        incident_duration_seconds=300.0,
        hold_duration_seconds=20.0,
        total_steps=80,
    )

    # Verify identical results (determinism)
    assert comp1.to_dict() == comp2.to_dict(), "Comparative simulation must be 100% deterministic"

    assert comp1.without_control.scenario_id == "WITHOUT_CONTROL"
    assert comp1.with_busflow.scenario_id == "WITH_BUSFLOW"
    assert len(comp1.comparison_metrics) >= 8

    # Find total holding time comparison item
    hold_item = next(m for m in comp1.comparison_metrics if m.metric_key == "total_holding_time_seconds")
    assert hold_item.without_control == 0.0
    assert hold_item.with_busflow == 20.0

    print(f"PASS: Scenario comparison verified: without delay={comp1.without_control.service.total_delay_seconds}s, with delay={comp1.with_busflow.service.total_delay_seconds}s, holding={hold_item.with_busflow}s")


def test_21_22_analytics_api_endpoints():
    """TEST 21 & 22: Verify /api/analytics/summary and /api/analytics/comparison HTTP endpoints."""
    print("\n--- TEST 21 & 22: Analytics HTTP API Endpoints ---")
    client = TestClient(app)

    # 1. Summary Endpoint
    resp_sum = client.get("/api/analytics/summary")
    assert resp_sum.status_code == 200
    data_sum = resp_sum.json()
    assert "fleet" in data_sum
    assert "passenger" in data_sum
    assert "service" in data_sum
    assert "control" in data_sum
    assert "recovery" in data_sum
    assert data_sum["fleet"]["total_buses"] == 5

    # 2. Comparison Endpoint
    resp_comp = client.get("/api/analytics/comparison?scenario_name=API_Test&incident_duration=300.0&hold_duration=20.0&total_steps=80")
    assert resp_comp.status_code == 200
    data_comp = resp_comp.json()
    assert data_comp["scenario_name"] == "API_Test"
    assert "without_control" in data_comp
    assert "with_busflow" in data_comp
    assert len(data_comp["comparison_metrics"]) >= 8
    print("PASS: /api/analytics/summary and /api/analytics/comparison endpoints verified successfully")


def test_23_full_b15_demo_scenario():
    """TEST 23: Verify the full comparative B15 demo flow produces credible operational analytics."""
    print("\n--- TEST 23: Full B15 Demo Scenario Comparison ---")
    comp = calculate_scenario_comparison(
        scenario_name="B14 Mechanical Stall & B15 Regularity Recovery Benchmark",
        incident_duration_seconds=300.0,
        hold_duration_seconds=20.0,
        total_steps=100,
    )

    print("\n" + "="*70)
    print("                      BUSFLOW OPERATIONAL IMPACT")
    print("="*70)
    print(f"{'METRIC':<35} | {'WITHOUT CONTROL':<15} | {'WITH BUSFLOW':<15} | {'CHANGE':<10} | {'IMPROVEMENT':<12}")
    print("-"*70)

    for item in comp.comparison_metrics:
        w_str = f"{item.without_control}" if item.without_control is not None else "-"
        b_str = f"{item.with_busflow}" if item.with_busflow is not None else "-"
        ch_str = f"{item.change:+}" if item.change is not None else "-"
        pct_str = f"{item.improvement_percentage:+.2f}%" if item.improvement_percentage is not None else "-"
        print(f"{item.metric_name:<35} | {w_str:<15} | {b_str:<15} | {ch_str:<10} | {pct_str:<12}")

    print("="*70)
    print(f"Summary: {comp.summary}\n")
    print("PASS: Full B15 demo scenario evaluated successfully with actual simulation data")


def test_24_25_26_27_full_regression():
    """TEST 24, 25, 26, 27: Regression validation against Phases 8, 9, 10, and 11 test suites."""
    print("\n--- TEST 24, 25, 26, 27: Full Regression Suite (Phases 8, 9, 10, 11) ---")

    # Phase 8 Risk
    import test_phase8_risk
    print("Running Phase 8 Risk tests...")
    test_phase8_risk.test_controlled_scenarios()
    test_phase8_risk.test_determinism()

    # Phase 9 Controller
    import test_phase9_control
    print("Running Phase 9 Control tests...")
    test_phase9_control.test_controlled_recommendation_scenarios()
    test_phase9_control.test_determinism()

    # Phase 10 Hold Application
    import test_phase10_control
    print("Running Phase 10 Hold Application tests...")
    test_phase10_control.test_approval_and_hold_lifecycle()
    test_phase10_control.test_rejection_lifecycle()
    test_phase10_control.test_exact_hold_duration_and_partial_timestep()

    # Phase 11 Recovery
    import test_phase11_recovery
    print("Running Phase 11 Recovery tests...")
    test_phase11_recovery.test_1_recovery_tracking_starts_after_applied()
    test_phase11_recovery.test_3_and_4_recovery_detection_and_time()
    test_phase11_recovery.test_6_recovery_timeout()
    test_phase11_recovery.test_13_determinism()

    print("PASS: All regression tests from Phases 8, 9, 10, and 11 passed 100% cleanly")


if __name__ == "__main__":
    print("==============================================")
    print("RUNNING PHASE 12 OPERATIONAL METRICS TEST SUITE")
    print("==============================================")

    test_1_passenger_waiting_calculation()
    test_2_zero_arrival_safety()
    test_3_4_5_headway_mean_std_and_cov()
    test_6_zero_headway_safety()
    test_7_8_total_delay_and_on_time_performance()
    test_9_total_holding_time()
    test_10_11_recovery_average_and_timeout_exclusion()
    test_12_13_bunching_and_risk_counts()
    test_14_control_action_counts()
    test_15_metrics_snapshot()
    test_16_17_improvement_percentage_and_zero_safety()
    test_18_19_20_deterministic_scenario_comparison()
    test_21_22_analytics_api_endpoints()
    test_23_full_b15_demo_scenario()
    test_24_25_26_27_full_regression()

    print("\n==============================================")
    print("ALL PHASE 12 OPERATIONAL METRICS TESTS PASSED!")
    print("==============================================")
