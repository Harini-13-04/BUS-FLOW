"""
BUSFLOW — Phase 11 Recovery Measurement Engine Test Suite
Validates before/after snapshots, deterministic recovery detection, recovery time calculations,
timeout behavior, independent action tracking, API endpoints, determinism, and full regression.
"""

import sys
import copy
from fastapi.testclient import TestClient

from app.main import app
from app.simulation.engine import SIMULATION_ENGINE, SimulationConfig
from app.simulation.bus import (
    get_bus_by_id,
    get_all_buses,
    reset_bus_fleet,
    BUS_STORE,
    BusStatus,
)
from app.simulation.traffic import get_current_traffic, set_traffic_condition, TrafficCondition
from app.simulation.incident import (
    create_incident,
    IncidentType,
    IncidentSeverity,
    reset_incident_store,
)
from app.simulation.passenger import get_all_passenger_states
from app.control.headway import calculate_fleet_headways
from app.control.bunching import evaluate_bus_bunching, evaluate_fleet_bunching
from app.control.risk import calculate_bus_risk, calculate_fleet_risk, RiskLevel
from app.control.controller import evaluate_bus_control, evaluate_fleet_control, ControlDecision
from app.control.action import (
    ControlActionState,
    OperatorActionType,
    create_control_action,
    get_all_actions,
    get_action_by_id,
    reset_action_store,
)
from app.control.recovery import (
    RecoveryState,
    HEADWAY_RECOVERY_RATIO,
    BUNCHING_RECOVERY_STATUS,
    MAX_RECOVERY_RISK_SCORE,
    MAX_RECOVERY_TIME_SECONDS,
    RecoverySnapshot,
    RecoveryMeasurement,
    RECOVERY_STORE,
    start_recovery_tracking,
    evaluate_active_recovery_measurements,
    get_all_recoveries,
    get_recovery_by_action_id,
    get_recoveries_for_bus,
    reset_recovery_store,
)


def test_1_recovery_tracking_starts_after_applied():
    """TEST 1: Verify recovery tracking starts (state=TRACKING) when control action transitions to APPLIED."""
    print("\n--- TEST 1: Recovery Tracking Starts After APPLIED ---")
    SIMULATION_ENGINE.reset()
    SIMULATION_ENGINE.start(SimulationConfig(timestep_seconds=5.0))

    action = create_control_action(
        bus_id="B15",
        route_id="21G",
        decision="HOLD",
        requested_hold_seconds=15.0,
        approved_hold_seconds=15.0,
        state=ControlActionState.APPROVED,
        simulation_time=SIMULATION_ENGINE.simulation_time,
        reason="Test action application",
    )

    # Before step: action is APPROVED, not yet in recovery store
    assert action.state == ControlActionState.APPROVED
    assert get_recovery_by_action_id(action.action_id) is None

    # Step simulation: action transitions to APPLIED and recovery tracking starts
    SIMULATION_ENGINE.step()

    assert action.state == ControlActionState.APPLIED
    rec = get_recovery_by_action_id(action.action_id)
    assert rec is not None, "Recovery measurement must be registered on action application"
    assert rec.state == RecoveryState.TRACKING
    assert rec.started_at_simulation_time == 5.0
    assert rec.hold_duration_seconds == 15.0
    print(f"PASS: Action '{action.action_id}' APPLIED -> Recovery state '{rec.state}' at sim_time={rec.started_at_simulation_time}s")


def test_2_before_snapshot_capture():
    """TEST 2: Verify live operational metrics are accurately captured in before_control snapshot."""
    print("\n--- TEST 2: Before Snapshot Capture ---")
    SIMULATION_ENGINE.reset()
    SIMULATION_ENGINE.start(SimulationConfig(timestep_seconds=5.0))

    target_bus = get_bus_by_id("B15")
    expected_pos = target_bus.position
    expected_load = target_bus.passengers
    expected_delay = target_bus.delay_seconds

    action = create_control_action(
        bus_id="B15",
        route_id="21G",
        decision="HOLD",
        requested_hold_seconds=20.0,
        approved_hold_seconds=20.0,
        state=ControlActionState.APPROVED,
        simulation_time=SIMULATION_ENGINE.simulation_time,
        reason="Test before snapshot",
    )

    SIMULATION_ENGINE.step()
    rec = get_recovery_by_action_id(action.action_id)
    assert rec.before_control is not None

    snap = rec.before_control
    assert snap.action_id == action.action_id
    assert snap.bus_id == "B15"
    assert snap.position == expected_pos
    assert snap.passenger_load == expected_load
    assert snap.delay_seconds == expected_delay
    assert snap.desired_headway == 345.6
    assert snap.risk_score >= 0.0 and snap.risk_score <= 1.0
    assert snap.risk_level in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    assert snap.bunching_status in ["NORMAL", "AT_RISK", "SEVERE_DELAY"]

    # Test flattened convenience properties
    assert rec.before_headway_ahead == snap.headway_ahead
    assert rec.before_risk_score == snap.risk_score
    assert rec.before_bunching_status == snap.bunching_status
    print(f"PASS: Before snapshot verified: pos={snap.position}m, hw={snap.headway_ahead}s, risk={snap.risk_score} ({snap.risk_level}), status={snap.bunching_status}")


def test_3_and_4_recovery_detection_and_time():
    """TEST 3 & 4: Verify recovery criteria detection (TRACKING -> RECOVERED) and exact simulation recovery time."""
    print("\n--- TEST 3 & 4: Recovery Detection & Simulation Time Calculation ---")
    SIMULATION_ENGINE.reset()
    SIMULATION_ENGINE.start(SimulationConfig(timestep_seconds=5.0))

    # Place fleet with B15 having a slight headway deficit that recovers after a short hold
    BUS_STORE["B14"].position = 10900.0
    BUS_STORE["B15"].position = 9150.0  # Gap ahead to B14 = 1750m (252s < 259.2s threshold)
    BUS_STORE["B16"].position = 6000.0
    BUS_STORE["B17"].position = 4000.0
    BUS_STORE["B18"].position = 2000.0

    calculate_fleet_headways(get_all_buses(), route_length=12000.0, traffic_multiplier=1.0)
    evaluate_fleet_bunching(get_all_buses())

    action = create_control_action(
        bus_id="B15",
        route_id="21G",
        decision="HOLD",
        requested_hold_seconds=15.0,
        approved_hold_seconds=15.0,
        state=ControlActionState.APPROVED,
        simulation_time=SIMULATION_ENGINE.simulation_time,
        reason="Restore spacing to nominal",
    )

    # Step 1: Action APPLIED, tracking started (t=5.0s)
    SIMULATION_ENGINE.step()
    rec = get_recovery_by_action_id(action.action_id)
    assert rec.state == RecoveryState.TRACKING
    assert rec.started_at_simulation_time == 5.0

    # Step 2: B14 moves forward while B15 holds -> headway expands to >= 259.2s, bunching becomes NORMAL, risk < 0.50
    SIMULATION_ENGINE.step()
    assert rec.state == RecoveryState.RECOVERED
    assert rec.recovered_at_simulation_time == 10.0
    assert rec.recovery_time_seconds == 5.0, "Recovery time must equal exact simulation elapsed time (10.0 - 5.0 = 5.0s)"
    assert rec.after_control is not None
    assert rec.after_control.bunching_status == "NORMAL"
    assert rec.after_control.headway_ahead >= 259.2
    assert rec.after_control.risk_score < 0.50
    print(f"PASS: Recovery achieved at sim_time={rec.recovered_at_simulation_time}s. Recovery duration = {rec.recovery_time_seconds}s (Hold was {rec.hold_duration_seconds}s)")


def test_5_no_false_recovery():
    """TEST 5: Verify that tracking remains in TRACKING if any of the 3 criteria are unmet."""
    print("\n--- TEST 5: No False Recovery When Criteria Unmet ---")
    SIMULATION_ENGINE.reset()
    SIMULATION_ENGINE.start(SimulationConfig(timestep_seconds=5.0))

    # Severely compress B15 behind B14 (gap ahead = 500m = 72s << 259.2s)
    BUS_STORE["B14"].position = 5500.0
    BUS_STORE["B15"].position = 5000.0
    BUS_STORE["B16"].position = 2000.0
    BUS_STORE["B17"].position = 10000.0
    BUS_STORE["B18"].position = 8000.0

    calculate_fleet_headways(get_all_buses(), route_length=12000.0, traffic_multiplier=1.0)
    evaluate_fleet_bunching(get_all_buses())

    action = create_control_action(
        bus_id="B15",
        route_id="21G",
        decision="HOLD",
        requested_hold_seconds=5.0,
        approved_hold_seconds=5.0,
        state=ControlActionState.APPROVED,
        simulation_time=SIMULATION_ENGINE.simulation_time,
        reason="Small hold for severe compression",
    )

    SIMULATION_ENGINE.step() # t=5.0s (APPLIED, hold finishes)
    rec = get_recovery_by_action_id(action.action_id)
    assert rec.state == RecoveryState.TRACKING

    SIMULATION_ENGINE.step() # t=10.0s (B15 resumes, but gap is still far below 259.2s)
    b15 = get_bus_by_id("B15")
    assert b15.headway_ahead < 259.2
    assert rec.state == RecoveryState.TRACKING, "Must NOT mark RECOVERED when headway is below 75% desired threshold"
    assert rec.recovery_time_seconds is None
    print(f"PASS: No false recovery: B15 hw_ahead={b15.headway_ahead:.1f}s (< 259.2s threshold) -> state remains {rec.state}")


def test_6_recovery_timeout():
    """TEST 6: Verify observation window timeout (900s) when criteria are not satisfied."""
    print("\n--- TEST 6: Recovery Timeout Behavior ---")
    SIMULATION_ENGINE.reset()
    SIMULATION_ENGINE.start(SimulationConfig(timestep_seconds=10.0))

    # Stall scenario
    stall = create_incident(
        incident_type=IncidentType.BUS_STALL,
        severity=IncidentSeverity.CRITICAL,
        affected_bus="B14",
        duration=300.0,
        delay_seconds=300.0,
        start_time=0.0,
        auto_activate=True,
    )
    SIMULATION_ENGINE.run(steps=30) # 300s

    action = create_control_action(
        bus_id="B15",
        route_id="21G",
        decision="HOLD",
        requested_hold_seconds=10.0,
        approved_hold_seconds=10.0,
        state=ControlActionState.APPROVED,
        simulation_time=SIMULATION_ENGINE.simulation_time,
        reason="Hold under severe network disruption",
    )

    SIMULATION_ENGINE.step(10.0) # Start tracking at 310s
    rec = get_recovery_by_action_id(action.action_id)
    assert rec.state == RecoveryState.TRACKING
    start_t = rec.started_at_simulation_time

    # Run for 900 seconds (90 steps of 10s)
    SIMULATION_ENGINE.run(steps=90, duration_seconds=900.0)

    assert rec.state == RecoveryState.TIMEOUT, f"Expected TIMEOUT after 900s, got {rec.state}"
    assert rec.recovered_at_simulation_time is None
    assert rec.recovery_time_seconds is None
    assert rec.after_control is not None
    assert "not achieved within the 900s observation window" in rec.summary
    print(f"PASS: Observation window timeout verified: State={rec.state}, summary='{rec.summary}'")


def test_7_8_9_improvement_calculations():
    """TEST 7, 8, 9: Verify improvement calculations from actual headway, bunching, and risk engines."""
    print("\n--- TEST 7, 8, 9: Actual Headway, Bunching & Risk Improvement Calculations ---")
    SIMULATION_ENGINE.reset()
    SIMULATION_ENGINE.start(SimulationConfig(timestep_seconds=5.0))

    BUS_STORE["B14"].position = 10900.0
    BUS_STORE["B15"].position = 9150.0
    BUS_STORE["B16"].position = 6000.0
    BUS_STORE["B17"].position = 4000.0
    BUS_STORE["B18"].position = 2000.0

    calculate_fleet_headways(get_all_buses(), route_length=12000.0, traffic_multiplier=1.0)
    evaluate_fleet_bunching(get_all_buses())

    action = create_control_action(
        bus_id="B15",
        route_id="21G",
        decision="HOLD",
        requested_hold_seconds=15.0,
        approved_hold_seconds=15.0,
        state=ControlActionState.APPROVED,
        simulation_time=SIMULATION_ENGINE.simulation_time,
        reason="Spacing improvement",
    )

    SIMULATION_ENGINE.step() # Step 1: t=5.0s
    SIMULATION_ENGINE.step() # Step 2: t=10.0s (RECOVERED)

    rec = get_recovery_by_action_id(action.action_id)
    assert rec.state == RecoveryState.RECOVERED

    # Headway improvement
    assert rec.headway_change_seconds == round(rec.after_control.headway_ahead - rec.before_control.headway_ahead, 2)
    assert rec.headway_change_seconds > 0, "Forward headway must have expanded"

    # Risk change
    assert rec.risk_change == round(rec.after_control.risk_score - rec.before_control.risk_score, 4)

    # Bunching improvement
    assert rec.before_control.bunching_status in ["AT_RISK", "SEVERE_DELAY"]
    assert rec.after_control.bunching_status == "NORMAL"

    # Risk reduction percentage
    if rec.before_control.risk_score > 0:
        expected_pct = round(((rec.before_control.risk_score - rec.after_control.risk_score) / rec.before_control.risk_score) * 100.0, 2)
        assert rec.risk_reduction_percentage == expected_pct

    print(f"PASS: Headway change = +{rec.headway_change_seconds}s, Risk change = {rec.risk_change}, Risk reduction % = {rec.risk_reduction_percentage}%")


def test_10_delay_impact():
    """TEST 10: Verify delay tracking and that control_delay_added equals hold duration."""
    print("\n--- TEST 10: Delay Impact & Control Delay Added ---")
    SIMULATION_ENGINE.reset()
    SIMULATION_ENGINE.start(SimulationConfig(timestep_seconds=5.0))

    action = create_control_action(
        bus_id="B15",
        route_id="21G",
        decision="HOLD",
        requested_hold_seconds=22.5,
        approved_hold_seconds=22.5,
        state=ControlActionState.APPROVED,
        simulation_time=SIMULATION_ENGINE.simulation_time,
        reason="Delay test",
    )

    SIMULATION_ENGINE.step()
    rec = get_recovery_by_action_id(action.action_id)
    assert rec.control_delay_added == 22.5
    assert rec.hold_duration_seconds == 22.5
    print(f"PASS: Delay impact verified: control_delay_added = {rec.control_delay_added}s (Hold = {rec.hold_duration_seconds}s)")


def test_11_and_12_multiple_actions_and_history():
    """TEST 11 & 12: Verify multiple control actions have isolated, non-overwriting recovery records."""
    print("\n--- TEST 11 & 12: Multiple Actions Isolation & History Retention ---")
    SIMULATION_ENGINE.reset()
    SIMULATION_ENGINE.start(SimulationConfig(timestep_seconds=5.0))

    # Action 1 on B15
    act1 = create_control_action(
        bus_id="B15",
        route_id="21G",
        decision="HOLD",
        requested_hold_seconds=10.0,
        approved_hold_seconds=10.0,
        state=ControlActionState.APPROVED,
        simulation_time=SIMULATION_ENGINE.simulation_time,
        reason="Action 1",
    )
    SIMULATION_ENGINE.step()

    rec1 = get_recovery_by_action_id(act1.action_id)
    assert rec1 is not None

    # Complete action 1 hold
    SIMULATION_ENGINE.step()
    SIMULATION_ENGINE.step()

    # Action 2 on B16
    act2 = create_control_action(
        bus_id="B16",
        route_id="21G",
        decision="HOLD",
        requested_hold_seconds=15.0,
        approved_hold_seconds=15.0,
        state=ControlActionState.APPROVED,
        simulation_time=SIMULATION_ENGINE.simulation_time,
        reason="Action 2",
    )
    SIMULATION_ENGINE.step()

    rec2 = get_recovery_by_action_id(act2.action_id)
    assert rec2 is not None
    assert rec1.action_id != rec2.action_id
    assert rec1.recovery_id != rec2.recovery_id
    assert rec1.bus_id == "B15"
    assert rec2.bus_id == "B16"

    # Verify both exist in store
    all_recs = get_all_recoveries()
    assert len(all_recs) == 2
    assert get_recovery_by_action_id(act1.action_id) is rec1
    assert get_recovery_by_action_id(act2.action_id) is rec2

    b15_recs = get_recoveries_for_bus("B15")
    b16_recs = get_recoveries_for_bus("B16")
    assert len(b15_recs) == 1 and b15_recs[0].action_id == act1.action_id
    assert len(b16_recs) == 1 and b16_recs[0].action_id == act2.action_id
    print(f"PASS: Two separate actions '{act1.action_id}' and '{act2.action_id}' tracked independently without collision")


def test_13_determinism():
    """TEST 13: Verify that repeated runs produce 100% identical recovery metrics."""
    print("\n--- TEST 13: Deterministic Reproducibility ---")

    def run_sim():
        SIMULATION_ENGINE.reset()
        SIMULATION_ENGINE.start(SimulationConfig(timestep_seconds=5.0))
        BUS_STORE["B14"].position = 10900.0
        BUS_STORE["B15"].position = 9150.0
        BUS_STORE["B16"].position = 6000.0
        BUS_STORE["B17"].position = 4000.0
        BUS_STORE["B18"].position = 2000.0

        calculate_fleet_headways(get_all_buses(), route_length=12000.0, traffic_multiplier=1.0)
        evaluate_fleet_bunching(get_all_buses())

        action = create_control_action(
            bus_id="B15",
            route_id="21G",
            decision="HOLD",
            requested_hold_seconds=15.0,
            approved_hold_seconds=15.0,
            state=ControlActionState.APPROVED,
            simulation_time=SIMULATION_ENGINE.simulation_time,
            action_id="ACT_DET_1",
            reason="Determinism check",
        )
        SIMULATION_ENGINE.step()
        SIMULATION_ENGINE.step()
        rec = get_recovery_by_action_id("ACT_DET_1")
        return rec.to_dict()

    res1 = run_sim()
    res2 = run_sim()

    assert res1 == res2, "Simulation recovery results must be 100% deterministic"
    print("PASS: Determinism verified: Run 1 and Run 2 produced identical recovery measurements")


def test_14_api_endpoints():
    """TEST 14: Verify recovery HTTP API endpoints (/api/control/recovery, /{action_id}, /bus/{bus_id})."""
    print("\n--- TEST 14: Recovery HTTP API Endpoints ---")
    client = TestClient(app)

    SIMULATION_ENGINE.reset()
    SIMULATION_ENGINE.start(SimulationConfig(timestep_seconds=5.0))
    BUS_STORE["B14"].position = 10900.0
    BUS_STORE["B15"].position = 9150.0
    BUS_STORE["B16"].position = 6000.0
    BUS_STORE["B17"].position = 4000.0
    BUS_STORE["B18"].position = 2000.0
    calculate_fleet_headways(get_all_buses(), route_length=12000.0, traffic_multiplier=1.0)
    evaluate_fleet_bunching(get_all_buses())

    # 1. Initially empty list
    resp = client.get("/api/control/recovery")
    assert resp.status_code == 200
    assert resp.json() == []

    # 2. Approve hold via API
    resp_approve = client.post("/api/control/B15/manual", json={"hold_seconds": 15.0, "reason": "API Hold"})
    assert resp_approve.status_code == 200
    action_data = resp_approve.json()
    action_id = action_data["action_id"]

    # 3. Query recovery before application -> NOT_STARTED
    resp_rec_unstarted = client.get(f"/api/control/recovery/{action_id}")
    assert resp_rec_unstarted.status_code == 200
    assert resp_rec_unstarted.json()["state"] == "NOT_STARTED"

    # 4. Advance simulation to apply and recover
    client.post("/api/simulation/step")
    client.post("/api/simulation/step")

    # 5. Query recovery list
    resp_list = client.get("/api/control/recovery")
    assert resp_list.status_code == 200
    data_list = resp_list.json()
    assert len(data_list) == 1
    assert data_list[0]["action_id"] == action_id
    assert data_list[0]["state"] == "RECOVERED"
    assert data_list[0]["recovery_time_seconds"] == 5.0

    # 6. Query single recovery by action ID
    resp_single = client.get(f"/api/control/recovery/{action_id}")
    assert resp_single.status_code == 200
    assert resp_single.json()["action_id"] == action_id
    assert resp_single.json()["state"] == "RECOVERED"

    # 7. Query recovery by bus ID
    resp_bus = client.get("/api/control/recovery/bus/B15")
    assert resp_bus.status_code == 200
    assert len(resp_bus.json()) == 1

    # 8. 404 on unknown action ID
    resp_404 = client.get("/api/control/recovery/ACT_UNKNOWN_999")
    assert resp_404.status_code == 404

    # 9. 404 on unknown bus ID
    resp_bus_404 = client.get("/api/control/recovery/bus/B999")
    assert resp_bus_404.status_code == 404

    print("PASS: All Recovery API endpoints (/recovery, /{action_id}, /bus/{bus_id}, 404s) verified successfully")


def test_15_b15_critical_demo_flow():
    """TEST 15: Critical Controlled Demo Flow (B14 stall -> B15 hold -> Recovery observation)."""
    print("\n--- TEST 15: Critical B15 Stall & Hold Recovery Demo Flow ---")
    SIMULATION_ENGINE.reset()
    SIMULATION_ENGINE.start(SimulationConfig(timestep_seconds=5.0))

    # 1. Trigger B14 stall for 300s
    stall = create_incident(
        incident_type=IncidentType.BUS_STALL,
        severity=IncidentSeverity.CRITICAL,
        affected_bus="B14",
        duration=300.0,
        delay_seconds=300.0,
        start_time=0.0,
        auto_activate=True,
    )
    SIMULATION_ENGINE.run(steps=60) # 300s

    b15 = get_bus_by_id("B15")
    print(f"B15 Baseline Post-Stall: hw_ahead={b15.headway_ahead:.1f}s, desired={b15.desired_headway:.1f}s, bunching={b15.status}, delay={b15.delay_seconds:.1f}s")

    # 2. Operator approves a 15.1s hold
    action = create_control_action(
        bus_id="B15",
        route_id="21G",
        decision="HOLD",
        requested_hold_seconds=15.1,
        approved_hold_seconds=15.1,
        state=ControlActionState.APPROVED,
        simulation_time=SIMULATION_ENGINE.simulation_time,
        reason="Restore service spacing following B14 incident clearing",
    )

    # 3. Apply hold and observe recovery
    SIMULATION_ENGINE.step() # APPLIED, tracking started
    rec = get_recovery_by_action_id(action.action_id)
    assert rec.state == RecoveryState.TRACKING
    print(f"Recovery Started: Action={rec.action_id}, Hold={rec.hold_duration_seconds}s, StartedAt={rec.started_at_simulation_time}s")

    # Step simulation across observation window
    for _ in range(180): # up to 900s
        SIMULATION_ENGINE.step()
        if rec.state in [RecoveryState.RECOVERED, RecoveryState.TIMEOUT]:
            break

    print(f"Recovery Observation Complete: Final State={rec.state}, Recovery Time={rec.recovery_time_seconds}s")
    print(f"Summary: {rec.summary}")
    print(f"PASS: Critical B15 demo flow completed successfully with state={rec.state}")


if __name__ == "__main__":
    print("==============================================")
    print("RUNNING PHASE 11 RECOVERY ENGINE TEST SUITE")
    print("==============================================")

    test_1_recovery_tracking_starts_after_applied()
    test_2_before_snapshot_capture()
    test_3_and_4_recovery_detection_and_time()
    test_5_no_false_recovery()
    test_6_recovery_timeout()
    test_7_8_9_improvement_calculations()
    test_10_delay_impact()
    test_11_and_12_multiple_actions_and_history()
    test_13_determinism()
    test_14_api_endpoints()
    test_15_b15_critical_demo_flow()

    print("\n==============================================")
    print("ALL PHASE 11 RECOVERY TESTS PASSED SUCCESSFULLY!")
    print("==============================================")
