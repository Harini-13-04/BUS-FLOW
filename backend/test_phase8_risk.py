"""
BUSFLOW — Phase 8 Validation Test Suite
Tests explainable risk scoring, deterministic component normalization,
safety scenarios, B14 stall scenario, edge cases, and API integrity.
"""

import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.simulation.bus import (
    Bus,
    BusStatus,
    get_all_buses,
    get_bus_by_id,
    reset_bus_fleet,
)
from app.simulation.traffic import (
    TrafficCondition,
    set_traffic_condition,
    get_current_traffic,
)
from app.simulation.passenger import (
    reset_passenger_demand,
    get_all_passenger_states,
)
from app.simulation.incident import (
    reset_incident_store,
    create_incident,
    IncidentType,
    IncidentSeverity,
)
from app.simulation.engine import SIMULATION_ENGINE, SimulationConfig
from app.control.headway import calculate_fleet_headways
from app.control.bunching import evaluate_fleet_bunching, evaluate_bus_bunching
from app.control.risk import (
    RiskLevel,
    RiskComponents,
    RiskResult,
    WEIGHT_HEADWAY_COMPRESSION,
    WEIGHT_REAR_GAP,
    WEIGHT_DELAY,
    WEIGHT_PASSENGER_LOAD,
    WEIGHT_TRAFFIC,
    WEIGHT_DEMAND_PRESSURE,
    MAX_DELAY_CAP_SECONDS,
    MAX_DEMAND_CAP_PAX,
    PREDICTION_HORIZON_SECONDS,
    normalize_headway_compression,
    normalize_rear_gap_imbalance,
    normalize_delay,
    normalize_passenger_load,
    normalize_traffic_condition,
    calculate_predicted_demand_pressure,
    normalize_predicted_demand,
    determine_risk_level,
    generate_risk_explanation,
    calculate_bus_risk,
    calculate_fleet_risk,
)

client = TestClient(app)


def test_weights_sum_to_one():
    print("\n--- TEST: Weight Sum Validation ---")
    total_weights = (
        WEIGHT_HEADWAY_COMPRESSION
        + WEIGHT_REAR_GAP
        + WEIGHT_DELAY
        + WEIGHT_PASSENGER_LOAD
        + WEIGHT_TRAFFIC
        + WEIGHT_DEMAND_PRESSURE
    )
    print(f"Weights: Headway={WEIGHT_HEADWAY_COMPRESSION}, RearGap={WEIGHT_REAR_GAP}, Delay={WEIGHT_DELAY}, Load={WEIGHT_PASSENGER_LOAD}, Traffic={WEIGHT_TRAFFIC}, Demand={WEIGHT_DEMAND_PRESSURE}")
    print(f"Sum = {total_weights:.6f}")
    assert abs(total_weights - 1.0) < 1e-6, "Weights must sum exactly to 1.0"
    print("PASS: Weight sum is exactly 1.0")


def test_component_normalization():
    print("\n--- TEST: Component Normalization ---")
    
    # 1. Headway compression
    assert normalize_headway_compression(345.6, 345.6) == 0.0
    assert normalize_headway_compression(400.0, 345.6) == 0.0
    assert normalize_headway_compression(0.0, 345.6) == 1.0
    assert abs(normalize_headway_compression(172.8, 345.6) - 0.5) < 1e-4
    assert normalize_headway_compression(100.0, -10.0) == 0.0  # edge case <= 0
    print("PASS: Headway compression normalization verified")

    # 2. Rear gap imbalance
    assert normalize_rear_gap_imbalance(345.6, 345.6) == 0.0
    assert normalize_rear_gap_imbalance(200.0, 345.6) == 0.0
    assert abs(normalize_rear_gap_imbalance(691.2, 345.6) - 1.0) < 1e-4  # 2x desired
    assert normalize_rear_gap_imbalance(1000.0, 345.6) == 1.0  # capped at 1.0
    assert normalize_rear_gap_imbalance(500.0, 0.0) == 0.0  # edge case <= 0
    print("PASS: Rear gap imbalance normalization verified")

    # 3. Delay
    assert normalize_delay(0.0) == 0.0
    assert normalize_delay(150.0) == 0.5
    assert normalize_delay(300.0) == 1.0
    assert normalize_delay(600.0) == 1.0  # capped at 1.0
    assert normalize_delay(-10.0) == 0.0  # clamped at 0.0
    print("PASS: Delay normalization verified")

    # 4. Passenger load
    assert normalize_passenger_load(0, 70) == 0.0
    assert abs(normalize_passenger_load(35, 70) - 0.5) < 1e-4
    assert normalize_passenger_load(70, 70) == 1.0
    assert normalize_passenger_load(80, 70) == 1.0  # capped at 1.0
    assert normalize_passenger_load(10, 0) == 0.0   # edge case capacity <= 0
    print("PASS: Passenger load normalization verified")

    # 5. Traffic
    assert normalize_traffic_condition("NORMAL") == 0.0
    assert normalize_traffic_condition("MODERATE") == 0.5
    assert normalize_traffic_condition("HEAVY") == 1.0
    assert normalize_traffic_condition("UNKNOWN") == 0.0
    print("PASS: Traffic normalization verified")

    # 6. Demand pressure
    assert calculate_predicted_demand_pressure(10, 0.20, 60.0) == 22.0
    assert normalize_predicted_demand(0.0) == 0.0
    assert normalize_predicted_demand(15.0, 30.0) == 0.5
    assert normalize_predicted_demand(30.0, 30.0) == 1.0
    assert normalize_predicted_demand(50.0, 30.0) == 1.0  # capped
    print("PASS: Demand pressure calculation and normalization verified")


def test_controlled_scenarios():
    print("\n--- TEST: 6 Controlled Risk Scenarios ---")

    # TEST 1 — Low Risk
    bus_low = Bus(
        bus_id="B_LOW",
        route_id="21G",
        current_stop="S01",
        position=0.0,
        direction=1,
        speed=30.0,
        delay_seconds=0.0,
        passengers=20,
        capacity=70,
        status=BusStatus.NORMAL,
        headway_ahead=345.6,
        headway_behind=345.6,
        desired_headway=345.6,
    )
    res_low = calculate_bus_risk(
        bus=bus_low,
        traffic_condition="NORMAL",
        stop_waiting_passengers=5,
        stop_arrival_rate=0.05,
    )
    print(f"Test 1 (Low Risk): Score={res_low.risk_score:.4f}, Level={res_low.risk_level}")
    assert res_low.risk_level == RiskLevel.LOW
    assert res_low.risk_score < 0.25

    # TEST 2 — Moderate Risk
    bus_mod = Bus(
        bus_id="B_MOD",
        route_id="21G",
        current_stop="S02",
        position=0.0,
        direction=1,
        speed=25.0,
        delay_seconds=60.0,
        passengers=35,
        capacity=70,
        status=BusStatus.NORMAL,
        headway_ahead=220.0,  # moderately compressed (~63.6% desired)
        headway_behind=400.0,
        desired_headway=345.6,
    )
    res_mod = calculate_bus_risk(
        bus=bus_mod,
        traffic_condition="MODERATE",
        stop_waiting_passengers=12,
        stop_arrival_rate=0.20,
    )
    print(f"Test 2 (Moderate Risk): Score={res_mod.risk_score:.4f}, Level={res_mod.risk_level}")
    assert res_mod.risk_level in [RiskLevel.MEDIUM, RiskLevel.HIGH]
    assert res_mod.risk_score >= 0.25

    # TEST 3 — Severe Bunching
    bus_sev = Bus(
        bus_id="B_SEV",
        route_id="21G",
        current_stop="S03",
        position=0.0,
        direction=1,
        speed=20.0,
        delay_seconds=200.0,
        passengers=55,
        capacity=70,
        status=BusStatus.NORMAL,
        headway_ahead=120.0,  # severely compressed (~34.7% desired)
        headway_behind=650.0, # large rear gap
        desired_headway=345.6,
    )
    res_sev = calculate_bus_risk(
        bus=bus_sev,
        traffic_condition="MODERATE",
        stop_waiting_passengers=20,
        stop_arrival_rate=0.30,
    )
    print(f"Test 3 (Severe Bunching): Score={res_sev.risk_score:.4f}, Level={res_sev.risk_level}")
    assert res_sev.is_bunching is True
    assert res_sev.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]
    assert res_sev.risk_score >= 0.50

    # TEST 4 — High Load Safety
    bus_load_low = Bus(
        bus_id="B_LOAD_L",
        route_id="21G",
        current_stop="S01",
        position=0.0,
        direction=1,
        speed=25.0,
        delay_seconds=30.0,
        passengers=10,
        capacity=70,
        status=BusStatus.NORMAL,
        headway_ahead=300.0,
        headway_behind=345.6,
        desired_headway=345.6,
    )
    bus_load_high = Bus(
        bus_id="B_LOAD_H",
        route_id="21G",
        current_stop="S01",
        position=0.0,
        direction=1,
        speed=25.0,
        delay_seconds=30.0,
        passengers=65,
        capacity=70,
        status=BusStatus.NORMAL,
        headway_ahead=300.0,
        headway_behind=345.6,
        desired_headway=345.6,
    )
    res_ll = calculate_bus_risk(bus_load_low, traffic_condition="NORMAL", stop_waiting_passengers=10, stop_arrival_rate=0.2)
    res_lh = calculate_bus_risk(bus_load_high, traffic_condition="NORMAL", stop_waiting_passengers=10, stop_arrival_rate=0.2)
    print(f"Test 4 (Load Impact): LowLoad Score={res_ll.risk_score:.4f} vs HighLoad Score={res_lh.risk_score:.4f}")
    assert res_lh.risk_score > res_ll.risk_score
    assert res_lh.components.load_risk > res_ll.components.load_risk

    # TEST 5 — Heavy Traffic
    res_t_norm = calculate_bus_risk(bus_mod, traffic_condition="NORMAL", stop_waiting_passengers=12, stop_arrival_rate=0.2)
    res_t_hvy = calculate_bus_risk(bus_mod, traffic_condition="HEAVY", stop_waiting_passengers=12, stop_arrival_rate=0.2)
    print(f"Test 5 (Traffic Impact): NormalTraffic Score={res_t_norm.risk_score:.4f} vs HeavyTraffic Score={res_t_hvy.risk_score:.4f}")
    assert res_t_hvy.risk_score > res_t_norm.risk_score
    assert abs((res_t_hvy.risk_score - res_t_norm.risk_score) - (WEIGHT_TRAFFIC * 1.0)) < 1e-4

    # TEST 6 — Delayed but Well Spaced
    bus_delayed_spaced = Bus(
        bus_id="B_DLY_SPC",
        route_id="21G",
        current_stop="S01",
        position=0.0,
        direction=1,
        speed=25.0,
        delay_seconds=240.0,  # high delay
        passengers=20,
        capacity=70,
        status=BusStatus.NORMAL,
        headway_ahead=360.0,  # well spaced >= desired
        headway_behind=350.0, # well spaced
        desired_headway=345.6,
    )
    res_ds = calculate_bus_risk(bus_delayed_spaced, traffic_condition="NORMAL", stop_waiting_passengers=5, stop_arrival_rate=0.05)
    print(f"Test 6 (Delayed but Well Spaced): Score={res_ds.risk_score:.4f}, Level={res_ds.risk_level}, is_bunching={res_ds.is_bunching}")
    assert res_ds.is_bunching is False
    assert res_ds.components.headway_compression_risk == 0.0
    assert res_ds.components.delay_risk == (240.0 / 300.0)
    assert res_ds.risk_score > res_low.risk_score
    assert "Headway ahead is nominal" in res_ds.explanation
    assert "delay" in res_ds.explanation.lower()
    print("PASS: All 6 controlled risk scenarios verified")


def test_b14_stall_scenario():
    print("\n--- TEST: B14 Stall Scenario Risk Dynamics ---")
    # Reset simulation
    SIMULATION_ENGINE.reset()

    # Verify initial fleet risk
    resp_init = client.get("/api/control/risk")
    assert resp_init.status_code == 200
    init_fleet_risk = resp_init.json()
    print("Initial Fleet Risk Scores:")
    for item in init_fleet_risk:
        print(f"  {item['bus_id']}: score={item['risk_score']}, level={item['risk_level']}, hw_ahead={item['headway_ahead']}s, hw_behind={item['headway_behind']}s, delay={item['delay_seconds']}s")

    b14_init = next(b for b in init_fleet_risk if b["bus_id"] == "B14")
    b18_init = next(b for b in init_fleet_risk if b["bus_id"] == "B18")

    # Inject 5-minute B14 Stall incident
    inc_resp = client.post(
        "/api/incidents",
        json={
            "type": IncidentType.BUS_STALL,
            "severity": IncidentSeverity.HIGH,
            "duration": 300.0,
            "delay_seconds": 300.0,
            "affected_bus": "B14",
            "auto_activate": True,
        },
    )
    assert inc_resp.status_code == 201
    print("Injected B14 stall incident for 300s.")

    # Advance simulation by 60 steps (300 seconds at 5s per step)
    run_resp = client.post("/api/simulation/run", json={"duration_seconds": 300.0})
    assert run_resp.status_code == 200
    state = run_resp.json()
    print(f"Advanced simulation by 300s. Current time = {state['simulation_time']}s")

    # Inspect updated risk scores
    resp_stalled = client.get("/api/control/risk")
    assert resp_stalled.status_code == 200
    stalled_fleet_risk = resp_stalled.json()

    print("\nPost-Stall Fleet Risk Breakdown:")
    for bus_risk in stalled_fleet_risk:
        print(f"Bus {bus_risk['bus_id']}:")
        print(f"  Risk Score: {bus_risk['risk_score']} ({bus_risk['risk_level']})")
        print(f"  Headway Ahead: {bus_risk['headway_ahead']}s, Headway Behind: {bus_risk['headway_behind']}s")
        print(f"  Delay: {bus_risk['delay_seconds']}s, Load: {bus_risk['passengers']}/{bus_risk['capacity']}")
        print(f"  Bunching Status: {bus_risk['bunching_status']}, is_bunching: {bus_risk['is_bunching']}")
        print(f"  Explanation: {bus_risk['explanation']}")

    # Verify B14 has accumulated severe delay (approx 300s) and high delay risk
    b14_risk = next(b for b in stalled_fleet_risk if b["bus_id"] == "B14")
    assert b14_risk["delay_seconds"] >= 290.0
    assert b14_risk["components"]["delay_risk"] >= 0.95

    # Verify trailing buses approaching B14 have compressed forward gaps
    b15_risk = next(b for b in stalled_fleet_risk if b["bus_id"] == "B15")
    print(f"\nB15 Post-Stall Details: hw_ahead={b15_risk['headway_ahead']}s vs desired={b15_risk['desired_headway']}s, risk={b15_risk['risk_score']}")
    assert b15_risk["is_bunching"] is True
    assert b15_risk["risk_score"] >= 0.50
    assert len(b15_risk["explanation"]) > 20
    print("PASS: B14 stall scenario risk dynamics verified")


def test_determinism():
    print("\n--- TEST: Deterministic Reproducibility ---")
    
    def run_scenario():
        SIMULATION_ENGINE.reset()
        client.post(
            "/api/incidents",
            json={
                "type": IncidentType.BUS_STALL,
                "severity": IncidentSeverity.HIGH,
                "duration": 180.0,
                "delay_seconds": 180.0,
                "affected_bus": "B14",
                "auto_activate": True,
            },
        )
        client.post("/api/simulation/run", json={"duration_seconds": 120.0})
        resp = client.get("/api/control/risk")
        return resp.json()

    run1 = run_scenario()
    run2 = run_scenario()

    assert len(run1) == len(run2)
    for b1, b2 in zip(run1, run2):
        assert b1["bus_id"] == b2["bus_id"]
        assert b1["risk_score"] == b2["risk_score"]
        assert b1["risk_level"] == b2["risk_level"]
        assert b1["headway_ahead"] == b2["headway_ahead"]
        assert b1["headway_behind"] == b2["headway_behind"]
        assert b1["delay_seconds"] == b2["delay_seconds"]
        assert b1["explanation"] == b2["explanation"]
    print("PASS: Determinism test passed: repeated runs produce 100% identical risk metrics and explanations.")


def test_api_endpoints_and_error_handling():
    print("\n--- TEST: API Endpoints & Error Handling ---")
    
    # 1. GET /api/control/risk
    resp = client.get("/api/control/risk")
    assert resp.status_code == 200
    assert len(resp.json()) == 5

    # 2. GET /api/control/risk/B14
    resp_b14 = client.get("/api/control/risk/B14")
    assert resp_b14.status_code == 200
    data = resp_b14.json()
    assert data["bus_id"] == "B14"
    assert "risk_score" in data
    assert "explanation" in data
    assert data["risk_level"] in [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL]

    # 3. GET /api/control/risk/UNKNOWN_BUS -> 404
    resp_404 = client.get("/api/control/risk/UNKNOWN_99")
    assert resp_404.status_code == 404
    assert "not found" in resp_404.json()["detail"].lower()

    # 4. Existing Phase 1-7 endpoints remain operational
    assert client.get("/").status_code == 200
    assert client.get("/health").status_code == 200
    assert client.get("/api/buses").status_code == 200
    assert client.get("/api/passengers").status_code == 200
    assert client.get("/api/traffic").status_code == 200
    assert client.get("/api/incidents").status_code == 200
    assert client.get("/api/simulation/state").status_code == 200
    assert client.get("/api/control/bunching").status_code == 200
    assert client.get("/docs").status_code == 200
    assert client.get("/openapi.json").status_code == 200

    print("PASS: All endpoints and error handlers verified successfully")


def test_edge_cases():
    print("\n--- TEST: Edge Cases Validation ---")
    
    # 1. Non-positive desired headway
    bus_zero_hw = Bus(
        bus_id="B_EDGE_1",
        route_id="21G",
        current_stop="S01",
        position=0.0,
        direction=1,
        speed=25.0,
        delay_seconds=0.0,
        passengers=0,
        capacity=70,
        desired_headway=0.0,
    )
    res_zero_hw = calculate_bus_risk(bus_zero_hw, traffic_condition="NORMAL", stop_waiting_passengers=0, stop_arrival_rate=0.0)
    assert 0.0 <= res_zero_hw.risk_score <= 1.0
    assert res_zero_hw.components.headway_compression_risk == 0.0
    assert res_zero_hw.components.rear_gap_risk == 0.0

    # 2. Non-positive capacity
    bus_zero_cap = Bus(
        bus_id="B_EDGE_2",
        route_id="21G",
        current_stop="S01",
        position=0.0,
        direction=1,
        speed=0.0,
        delay_seconds=0.0,
        passengers=0,
        capacity=0,
    )
    res_zero_cap = calculate_bus_risk(bus_zero_cap, traffic_condition="NORMAL")
    assert 0.0 <= res_zero_cap.risk_score <= 1.0
    assert res_zero_cap.components.load_risk == 0.0

    # 3. Single bus fleet evaluation
    single_bus_fleet = [bus_zero_hw]
    fleet_res = calculate_fleet_risk(single_bus_fleet)
    assert len(fleet_res) == 1
    assert "B_EDGE_1" in fleet_res

    print("PASS: All edge cases (zero headway, zero capacity, zero speed, zero passengers, single bus) handled gracefully without errors")


if __name__ == "__main__":
    test_weights_sum_to_one()
    test_component_normalization()
    test_controlled_scenarios()
    test_b14_stall_scenario()
    test_determinism()
    test_edge_cases()
    test_api_endpoints_and_error_handling()
    print("\n==============================================")
    print("ALL PHASE 8 RISK SCORE TESTS PASSED SUCCESSFULLY!")
    print("==============================================")

