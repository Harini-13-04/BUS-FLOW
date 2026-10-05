"""
BUSFLOW — Phase 9 Validation Test Suite
Tests explainable control recommendation engine (HOLD / NO_HOLD),
two-sided headway safety rules, bounded hold durations (0-60s),
B14 stall scenario, non-mutation safety, determinism, and API integrity.
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
from app.simulation.engine import SIMULATION_ENGINE
from app.control.headway import calculate_fleet_headways
from app.control.bunching import evaluate_fleet_bunching
from app.control.risk import calculate_fleet_risk, calculate_bus_risk, RiskLevel
from app.control.controller import (
    ControlDecision,
    ControlRecommendation,
    MAX_HOLD_SECONDS,
    MIN_HOLD_SECONDS,
    MAX_DELAY_FOR_HOLD_SECONDS,
    MAX_LOAD_RATIO_FOR_HOLD,
    MIN_REAR_GAP_RATIO,
    calculate_hold_factors,
    evaluate_bus_control,
    evaluate_fleet_control,
)

client = TestClient(app)


def test_controlled_recommendation_scenarios():
    print("\n--- TEST: 6 Controlled Recommendation Scenarios ---")

    # TEST 1 — Strong HOLD Candidate
    # Compressed forward gap (135.6s vs 345.6s desired), large rear gap (650s), low delay, acceptable load (41/70)
    bus_strong_hold = Bus(
        bus_id="B_HOLD_CAND",
        route_id="21G",
        current_stop="S03",
        position=3000.0,
        direction=1,
        speed=25.0,
        delay_seconds=0.0,
        passengers=41,
        capacity=70,
        status=BusStatus.NORMAL,
        headway_ahead=135.6,
        headway_behind=650.0,
        desired_headway=345.6,
    )
    rec1 = evaluate_bus_control(
        bus=bus_strong_hold,
        traffic_condition="NORMAL",
        stop_waiting_passengers=15,
        stop_arrival_rate=0.20,
    )
    print(f"Test 1 (Strong HOLD): Decision={rec1.decision}, Hold={rec1.recommended_hold_seconds}s, Reason={rec1.reason}")
    assert rec1.decision == ControlDecision.HOLD
    assert 5.0 <= rec1.recommended_hold_seconds <= 40.0
    assert rec1.recommended_hold_seconds <= MAX_HOLD_SECONDS
    assert "HOLD recommended" in rec1.reason

    # TEST 2 — Already Late Safety Rule (Rule 1)
    # Compressed forward gap, but bus is already 150s late (exceeds 120s max delay)
    bus_late = Bus(
        bus_id="B_LATE",
        route_id="21G",
        current_stop="S03",
        position=3000.0,
        direction=1,
        speed=25.0,
        delay_seconds=150.0,  # exceeds MAX_DELAY_FOR_HOLD_SECONDS (120s)
        passengers=41,
        capacity=70,
        status=BusStatus.NORMAL,
        headway_ahead=135.6,
        headway_behind=650.0,
        desired_headway=345.6,
    )
    rec2 = evaluate_bus_control(
        bus=bus_late,
        traffic_condition="NORMAL",
        stop_waiting_passengers=15,
        stop_arrival_rate=0.20,
    )
    print(f"Test 2 (Already Late): Decision={rec2.decision}, Hold={rec2.recommended_hold_seconds}s, Reason={rec2.reason}")
    assert rec2.decision == ControlDecision.NO_HOLD
    assert rec2.recommended_hold_seconds == 0.0
    assert "already" in rec2.reason.lower() and "late" in rec2.reason.lower()

    # TEST 3 — High Passenger Crowding Safety Rule (Rule 2)
    # Compressed forward gap, but bus is 68/70 full (97.1% exceeds 85% max load ratio)
    bus_crowded = Bus(
        bus_id="B_CROWDED",
        route_id="21G",
        current_stop="S03",
        position=3000.0,
        direction=1,
        speed=25.0,
        delay_seconds=0.0,
        passengers=68,  # 97.1% of capacity
        capacity=70,
        status=BusStatus.NORMAL,
        headway_ahead=135.6,
        headway_behind=650.0,
        desired_headway=345.6,
    )
    rec3 = evaluate_bus_control(
        bus=bus_crowded,
        traffic_condition="NORMAL",
        stop_waiting_passengers=15,
        stop_arrival_rate=0.20,
    )
    print(f"Test 3 (High Load): Decision={rec3.decision}, Hold={rec3.recommended_hold_seconds}s, Reason={rec3.reason}")
    assert rec3.decision == ControlDecision.NO_HOLD
    assert rec3.recommended_hold_seconds == 0.0
    assert "load is very high" in rec3.reason.lower() or "passenger" in rec3.reason.lower()

    # TEST 4 — Small Rear Gap Two-Sided Safety Rule (Rule 6)
    # Compressed forward gap, but bus behind is trailing at 160s (46.3% of desired, < 60% min rear gap)
    bus_small_rear = Bus(
        bus_id="B_SMALL_REAR",
        route_id="21G",
        current_stop="S03",
        position=3000.0,
        direction=1,
        speed=25.0,
        delay_seconds=0.0,
        passengers=30,
        capacity=70,
        status=BusStatus.NORMAL,
        headway_ahead=135.6,
        headway_behind=160.0,  # small trailing gap < 60% desired
        desired_headway=345.6,
    )
    rec4 = evaluate_bus_control(
        bus=bus_small_rear,
        traffic_condition="NORMAL",
        stop_waiting_passengers=10,
        stop_arrival_rate=0.20,
    )
    print(f"Test 4 (Small Rear Gap): Decision={rec4.decision}, Hold={rec4.recommended_hold_seconds}s, Reason={rec4.reason}")
    assert rec4.decision == ControlDecision.NO_HOLD
    assert rec4.recommended_hold_seconds == 0.0
    assert "close behind" in rec4.reason.lower()

    # TEST 5 — Normal Spacing (Nominal Headway)
    # Balanced forward spacing >= desired headway
    bus_nominal = Bus(
        bus_id="B_NOMINAL",
        route_id="21G",
        current_stop="S01",
        position=0.0,
        direction=1,
        speed=25.0,
        delay_seconds=0.0,
        passengers=25,
        capacity=70,
        status=BusStatus.NORMAL,
        headway_ahead=345.6,
        headway_behind=345.6,
        desired_headway=345.6,
    )
    rec5 = evaluate_bus_control(
        bus=bus_nominal,
        traffic_condition="NORMAL",
        stop_waiting_passengers=5,
        stop_arrival_rate=0.10,
    )
    print(f"Test 5 (Nominal Spacing): Decision={rec5.decision}, Hold={rec5.recommended_hold_seconds}s, Reason={rec5.reason}")
    assert rec5.decision == ControlDecision.NO_HOLD
    assert rec5.recommended_hold_seconds == 0.0
    assert "nominal" in rec5.reason.lower()

    # TEST 6 — Moderate Risk / Moderate Deficit
    # Moderate deficit (headway_ahead = 220s vs desired 345.6s), rear gap 450s, delay 20s, load 30/70
    bus_mod = Bus(
        bus_id="B_MOD_REC",
        route_id="21G",
        current_stop="S02",
        position=1000.0,
        direction=1,
        speed=25.0,
        delay_seconds=20.0,
        passengers=30,
        capacity=70,
        status=BusStatus.NORMAL,
        headway_ahead=220.0,
        headway_behind=450.0,
        desired_headway=345.6,
    )
    rec6 = evaluate_bus_control(
        bus=bus_mod,
        traffic_condition="NORMAL",
        stop_waiting_passengers=10,
        stop_arrival_rate=0.20,
    )
    print(f"Test 6 (Moderate Deficit): Decision={rec6.decision}, Hold={rec6.recommended_hold_seconds}s, Reason={rec6.reason}")
    assert rec6.decision in [ControlDecision.HOLD, ControlDecision.NO_HOLD]
    assert 0.0 <= rec6.recommended_hold_seconds <= MAX_HOLD_SECONDS
    print("PASS: All 6 controlled recommendation scenarios verified successfully")


def test_hold_bounds_and_safety_ceilings():
    print("\n--- TEST: Hold Bounds & Safety Ceilings ---")
    
    # Extreme hypothetical deficit (headway_ahead = 10s vs 345.6s desired, deficit = 335.6s)
    bus_extreme = Bus(
        bus_id="B_EXTREME",
        route_id="21G",
        current_stop="S01",
        position=0.0,
        direction=1,
        speed=25.0,
        delay_seconds=0.0,
        passengers=10,
        capacity=70,
        status=BusStatus.NORMAL,
        headway_ahead=10.0,
        headway_behind=1000.0,
        desired_headway=345.6,
    )
    rec_extreme = evaluate_bus_control(bus_extreme, traffic_condition="NORMAL")
    print(f"Extreme Deficit Hold: {rec_extreme.recommended_hold_seconds}s (Hard Ceiling: {MAX_HOLD_SECONDS}s)")
    assert 0.0 <= rec_extreme.recommended_hold_seconds <= MAX_HOLD_SECONDS
    assert rec_extreme.recommended_hold_seconds <= 60.0
    print("PASS: Maximum hold duration is strictly clamped to <= 60.0s and >= 0.0s")


def test_non_mutation_safety():
    print("\n--- TEST: Recommendation Non-Mutation Safety Principle ---")
    SIMULATION_ENGINE.reset()

    # Capture simulation state before running controller
    buses_before = [b.to_dict() for b in get_all_buses()]
    time_before = SIMULATION_ENGINE.simulation_time
    passengers_before = [p.to_dict() for p in get_all_passenger_states()]

    # Query control recommendations API
    resp = client.get("/api/control/recommendations")
    assert resp.status_code == 200

    # Capture simulation state after controller execution
    buses_after = [b.to_dict() for b in get_all_buses()]
    time_after = SIMULATION_ENGINE.simulation_time
    passengers_after = [p.to_dict() for p in get_all_passenger_states()]

    # Verify ZERO mutations occurred in simulation physics, bus positions, speeds, dwell timers, or delays
    assert time_before == time_after
    for bb, ba in zip(buses_before, buses_after):
        assert bb["position"] == ba["position"]
        assert bb["speed"] == ba["speed"]
        assert bb["delay_seconds"] == ba["delay_seconds"]
        assert bb["dwell_time_remaining"] == ba["dwell_time_remaining"]
        assert bb["passengers"] == ba["passengers"]

    for pb, pa in zip(passengers_before, passengers_after):
        assert pb["waiting_passengers"] == pa["waiting_passengers"]
        assert pb["total_boarded"] == pa["total_boarded"]

    print("PASS: Verified Controller is ANALYSIS / RECOMMENDATION ONLY and does NOT mutate simulation state.")


def test_b14_stall_scenario():
    print("\n--- TEST: B14 Stall Scenario Controller Recommendations ---")
    SIMULATION_ENGINE.reset()

    # Inject 5-minute B14 Stall
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

    # Advance simulation by 300 seconds
    run_resp = client.post("/api/simulation/run", json={"duration_seconds": 300.0})
    assert run_resp.status_code == 200

    # Inspect control recommendations across fleet
    rec_resp = client.get("/api/control/recommendations")
    assert rec_resp.status_code == 200
    fleet_recs = rec_resp.json()

    print("\nPost-Stall Fleet Control Recommendations:")
    for rec in fleet_recs:
        print(f"Bus {rec['bus_id']}:")
        print(f"  Decision: {rec['decision']}, Recommended Hold: {rec['recommended_hold_seconds']}s")
        print(f"  Headway Ahead: {rec['headway_ahead']}s, Headway Behind: {rec['headway_behind']}s")
        print(f"  Delay: {rec['delay_seconds']}s, Load: {rec['passenger_load']}/{rec['capacity']}")
        print(f"  Risk: {rec['risk_score']} ({rec['risk_level']}), Bunching: {rec['bunching_status']}")
        print(f"  Reason: {rec['reason']}")

    # Verify B14 receives NO_HOLD due to severe stall delay
    b14_rec = next(r for r in fleet_recs if r["bus_id"] == "B14")
    assert b14_rec["decision"] == ControlDecision.NO_HOLD
    assert b14_rec["recommended_hold_seconds"] == 0.0

    # Verify all recommendations are bounded and valid
    for rec in fleet_recs:
        assert rec["decision"] in [ControlDecision.HOLD, ControlDecision.NO_HOLD]
        assert 0.0 <= rec["recommended_hold_seconds"] <= MAX_HOLD_SECONDS
        assert len(rec["reason"]) > 15

    print("PASS: B14 stall scenario controller recommendations verified")


def test_determinism():
    print("\n--- TEST: Deterministic Reproducibility ---")

    def run_control_scenario():
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
        resp = client.get("/api/control/recommendations")
        return resp.json()

    run1 = run_control_scenario()
    run2 = run_control_scenario()

    assert len(run1) == len(run2)
    for r1, r2 in zip(run1, run2):
        assert r1["bus_id"] == r2["bus_id"]
        assert r1["decision"] == r2["decision"]
        assert r1["recommended_hold_seconds"] == r2["recommended_hold_seconds"]
        assert r1["reason"] == r2["reason"]

    print("PASS: Determinism test passed: repeated runs produce 100% identical control recommendations and hold durations.")


def test_api_endpoints_and_error_handling():
    print("\n--- TEST: API Endpoints & Error Handling ---")

    # 1. GET /api/control/recommendations
    resp = client.get("/api/control/recommendations")
    assert resp.status_code == 200
    assert len(resp.json()) == 5

    # 2. GET /api/control/recommendations/B14
    resp_b14 = client.get("/api/control/recommendations/B14")
    assert resp_b14.status_code == 200
    data = resp_b14.json()
    assert data["bus_id"] == "B14"
    assert data["decision"] in [ControlDecision.HOLD, ControlDecision.NO_HOLD]
    assert "recommended_hold_seconds" in data
    assert "reason" in data

    # 3. GET /api/control/recommendations/UNKNOWN_BUS -> 404
    resp_404 = client.get("/api/control/recommendations/UNKNOWN_BUS_99")
    assert resp_404.status_code == 404
    assert "not found" in resp_404.json()["detail"].lower()

    # 4. Existing Phase 1-8 endpoints remain operational
    assert client.get("/").status_code == 200
    assert client.get("/health").status_code == 200
    assert client.get("/api/buses").status_code == 200
    assert client.get("/api/passengers").status_code == 200
    assert client.get("/api/traffic").status_code == 200
    assert client.get("/api/incidents").status_code == 200
    assert client.get("/api/simulation/state").status_code == 200
    assert client.get("/api/control/bunching").status_code == 200
    assert client.get("/api/control/risk").status_code == 200
    assert client.get("/docs").status_code == 200
    assert client.get("/openapi.json").status_code == 200

    print("PASS: All endpoints and error handlers verified successfully")


if __name__ == "__main__":
    test_controlled_recommendation_scenarios()
    test_hold_bounds_and_safety_ceilings()
    test_non_mutation_safety()
    test_b14_stall_scenario()
    test_determinism()
    test_api_endpoints_and_error_handling()
    print("\n==============================================")
    print("ALL PHASE 9 CONTROL DECISION TESTS PASSED SUCCESSFULLY!")
    print("==============================================")
