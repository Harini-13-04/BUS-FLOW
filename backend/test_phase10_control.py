"""
BUSFLOW — Phase 10 Validation Test Suite
Tests human-in-the-loop operator approval/rejection lifecycle,
actual simulation hold application, hold timers, partial timestep kinematics,
delay accumulation, natural headway recalculation, manual holds, and API contracts.
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
    BUS_STORE,
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
)
from app.simulation.engine import SIMULATION_ENGINE
from app.control.action import (
    ControlActionState,
    OperatorActionType,
    get_all_actions,
    get_action_by_id,
    reset_action_store,
)
from app.control.controller import (
    ControlDecision,
    ControlRecommendation,
    MAX_HOLD_SECONDS,
    MIN_HOLD_SECONDS,
    evaluate_bus_control,
)

client = TestClient(app)


def test_approval_and_hold_lifecycle():
    print("\n--- TEST 1: Approve Valid HOLD Full Lifecycle ---")
    SIMULATION_ENGINE.reset()

    # Create a clean state where B15 is a valid HOLD candidate:
    # B14 is at 7000m, B15 at 7900m (compressed forward headway = 129.6s vs 345.6s desired),
    # B16 is at 10000m (large rear gap = 3024m / 435.5s), low delay, moderate load (30/70).
    b15 = get_bus_by_id("B15")
    b15.position = 7900.0
    b15.delay_seconds = 0.0
    b15.passengers = 30
    b15.capacity = 70
    b15.headway_ahead = 135.6
    b15.headway_behind = 650.0
    b15.desired_headway = 345.6
    b15.is_holding = False
    b15.hold_remaining_seconds = 0.0

    # 1. Verify Phase 9 recommendation is HOLD
    resp_rec = client.get("/api/control/recommendations/B15")
    assert resp_rec.status_code == 200
    rec = resp_rec.json()
    print(f"B15 Recommendation: {rec['decision']}, Hold: {rec['recommended_hold_seconds']}s")
    assert rec["decision"] == ControlDecision.HOLD
    assert rec["recommended_hold_seconds"] > 0.0
    rec_hold = rec["recommended_hold_seconds"]

    # 2. Operator Approves HOLD
    resp_app = client.post("/api/control/B15/approve")
    assert resp_app.status_code == 200
    action = resp_app.json()
    action_id = action["action_id"]
    print(f"Action Created: ID={action_id}, State={action['state']}, ApprovedHold={action['approved_hold_seconds']}s")
    assert action["state"] == ControlActionState.APPROVED
    assert action["approved_hold_seconds"] == rec_hold
    assert action["operator_action"] == OperatorActionType.RECOMMENDATION_APPROVAL

    # 3. Verify action is recorded in history
    resp_act = client.get(f"/api/control/actions/{action_id}")
    assert resp_act.status_code == 200
    assert resp_act.json()["state"] == ControlActionState.APPROVED

    # 4. Advance simulation by 1 step (5.0s) -> Action transitions to APPLIED and bus is held
    pos_before = b15.position
    resp_step = client.post("/api/simulation/step", json={"dt": 5.0})
    assert resp_step.status_code == 200

    # Verify B15 did NOT move and is holding
    assert b15.position == pos_before
    assert b15.is_holding is True
    assert abs(b15.hold_remaining_seconds - (rec_hold - 5.0)) < 1e-3
    assert b15.delay_seconds >= 5.0

    # Verify action state in store is APPLIED
    act_applied = get_action_by_id(action_id)
    assert act_applied.state == ControlActionState.APPLIED
    assert act_applied.applied_at_simulation_time is not None

    # 5. Advance simulation until hold fully completes
    steps_needed = int(rec_hold / 5.0) + 2
    for _ in range(steps_needed):
        client.post("/api/simulation/step", json={"dt": 5.0})

    # Verify hold is completed, bus is no longer holding, action is COMPLETED
    assert b15.is_holding is False
    assert b15.hold_remaining_seconds == 0.0
    act_completed = get_action_by_id(action_id)
    assert act_completed.state == ControlActionState.COMPLETED
    assert act_completed.completed_at_simulation_time is not None

    print("PASS: Full lifecycle RECOMMENDED -> APPROVED -> APPLIED -> COMPLETED verified")


def test_rejection_lifecycle():
    print("\n--- TEST 2: Reject Control Recommendation ---")
    SIMULATION_ENGINE.reset()

    b15 = get_bus_by_id("B15")
    b15.position = 7900.0
    b15.delay_seconds = 0.0
    b15.passengers = 30
    b15.headway_ahead = 135.6
    b15.headway_behind = 650.0

    # Operator Rejects recommendation
    resp_rej = client.post("/api/control/B15/reject")
    assert resp_rej.status_code == 200
    action = resp_rej.json()
    print(f"Rejected Action: ID={action['action_id']}, State={action['state']}, ApprovedHold={action['approved_hold_seconds']}s")
    assert action["state"] == ControlActionState.REJECTED
    assert action["approved_hold_seconds"] == 0.0
    assert action["operator_action"] == OperatorActionType.RECOMMENDATION_REJECTION

    # Verify bus does NOT hold on step
    pos_before = b15.position
    client.post("/api/simulation/step", json={"dt": 5.0})
    assert b15.is_holding is False
    assert b15.hold_remaining_seconds == 0.0
    assert b15.position > pos_before  # Bus moves normally!

    print("PASS: Rejection recorded with ZERO simulation holding impact verified")


def test_cannot_approve_no_hold():
    print("\n--- TEST 3: Cannot Approve NO_HOLD Recommendation ---")
    SIMULATION_ENGINE.reset()

    # B14 is at 7000m with nominal forward headway in standard fleet -> NO_HOLD
    # Or set a bus to nominal conditions
    b18 = get_bus_by_id("B18")
    b18.headway_ahead = 345.6
    b18.headway_behind = 345.6

    resp_rec = client.get("/api/control/recommendations/B18")
    assert resp_rec.status_code == 200
    assert resp_rec.json()["decision"] == ControlDecision.NO_HOLD

    # Attempt to approve NO_HOLD
    resp_bad = client.post("/api/control/B18/approve")
    print(f"Approval response on NO_HOLD: status={resp_bad.status_code}, detail={resp_bad.json()['detail']}")
    assert resp_bad.status_code == 400
    assert "cannot approve hold" in resp_bad.json()["detail"].lower()

    # Verify no hold action was applied to B18
    assert b18.is_holding is False
    assert b18.hold_remaining_seconds == 0.0
    print("PASS: Approving NO_HOLD safely rejected with HTTP 400")


def test_exact_hold_duration_and_partial_timestep():
    print("\n--- TEST 4 & 5: Exact Hold Duration & Partial Timestep Kinematics ---")
    SIMULATION_ENGINE.reset()

    # Use Manual control to approve an exact 18.0 second hold with 5.0 second timestep
    b16 = get_bus_by_id("B16")
    b16.speed = 36.0  # 36 km/h = 10.0 m/s
    b16.position = 5500.0  # Between S06 (5000m) and S07 (6000m)
    b16.delay_seconds = 0.0
    b16.dwell_time_remaining = 0.0

    resp_man = client.post(
        "/api/control/B16/manual",
        json={"hold_seconds": 18.0, "reason": "Test 18.0s hold with 5.0s timestep"},
    )
    assert resp_man.status_code == 200
    action = resp_man.json()
    assert action["approved_hold_seconds"] == 18.0
    assert action["state"] == ControlActionState.APPROVED

    initial_pos = b16.position
    speed_mps = 10.0

    # Step 1: dt = 5.0s -> 5.0s hold consumed, remaining = 13.0s, movement = 0m
    client.post("/api/simulation/step", json={"dt": 5.0})
    assert b16.is_holding is True
    assert abs(b16.hold_remaining_seconds - 13.0) < 1e-3
    assert b16.position == initial_pos
    assert abs(b16.delay_seconds - 5.0) < 1e-3
    print("Step 1 (5s elapsed): Position unchanged (5000.0m), hold remaining = 13.0s, delay = 5.0s")

    # Step 2: dt = 5.0s -> 5.0s hold consumed, remaining = 8.0s, movement = 0m
    client.post("/api/simulation/step", json={"dt": 5.0})
    assert b16.is_holding is True
    assert abs(b16.hold_remaining_seconds - 8.0) < 1e-3
    assert b16.position == initial_pos
    assert abs(b16.delay_seconds - 10.0) < 1e-3
    print("Step 2 (10s elapsed): Position unchanged (5000.0m), hold remaining = 8.0s, delay = 10.0s")

    # Step 3: dt = 5.0s -> 5.0s hold consumed, remaining = 3.0s, movement = 0m
    client.post("/api/simulation/step", json={"dt": 5.0})
    assert b16.is_holding is True
    assert abs(b16.hold_remaining_seconds - 3.0) < 1e-3
    assert b16.position == initial_pos
    assert abs(b16.delay_seconds - 15.0) < 1e-3
    print("Step 3 (15s elapsed): Position unchanged (5000.0m), hold remaining = 3.0s, delay = 15.0s")

    # Step 4: dt = 5.0s -> 3.0s hold consumed (hold expires), remaining = 0.0s, delay += 3.0s (total delay 18.0s)
    # Remaining effective_dt = 2.0s -> Bus moves forward by 10.0 m/s * 2.0s = 20.0m!
    client.post("/api/simulation/step", json={"dt": 5.0})
    assert b16.is_holding is False
    assert b16.hold_remaining_seconds == 0.0
    assert abs(b16.delay_seconds - 18.0) < 1e-3
    assert abs(b16.position - (initial_pos + 20.0)) < 1.0  # Exact partial timestep movement!
    print(f"Step 4 (20s elapsed): Hold completed! Delay = 18.0s, position moved by exactly 20.0m (to {b16.position:.1f}m)")

    print("PASS: Exact hold duration (18.0s) and partial timestep handling (3s hold + 2s movement) verified")


def test_headway_and_pipeline_recalculation():
    print("\n--- TEST 7 & 8: Natural Headway & Control Pipeline Recalculation ---")
    SIMULATION_ENGINE.reset()

    b15 = get_bus_by_id("B15")
    b16 = get_bus_by_id("B16")
    b15.position = 8000.0
    b16.position = 9000.0

    # Initial headways before hold
    hw_ahead_b15_before = b15.headway_ahead
    hw_behind_b16_before = b16.headway_behind

    # Hold B15 for 30s while B16 continues to move forward
    client.post("/api/control/B15/manual", json={"hold_seconds": 30.0})

    # Advance simulation by 30 seconds (6 steps of 5s)
    for _ in range(6):
        client.post("/api/simulation/step", json={"dt": 5.0})

    # While B15 was held at 8000m, B16 moved forward from 9000m towards 10500m
    # This naturally increases the distance between B15 and B16
    print(f"B15 Headway Ahead: before={hw_ahead_b15_before:.1f}s -> after hold={b15.headway_ahead:.1f}s")
    print(f"B16 Headway Behind: before={hw_behind_b16_before:.1f}s -> after hold={b16.headway_behind:.1f}s")
    assert b15.headway_ahead > hw_ahead_b15_before
    assert b16.headway_behind > hw_behind_b16_before
    print("PASS: Real physical headway expansion verified through natural simulation pipeline")


def test_no_double_hold():
    print("\n--- TEST 9: No Double / Overlapping Hold Safety ---")
    SIMULATION_ENGINE.reset()

    # Apply manual hold to B14
    resp1 = client.post("/api/control/B14/manual", json={"hold_seconds": 25.0})
    assert resp1.status_code == 200

    # Attempt second manual hold while first is pending/active
    resp2 = client.post("/api/control/B14/manual", json={"hold_seconds": 15.0})
    print(f"Second hold attempt status: {resp2.status_code}, detail: {resp2.json()['detail']}")
    assert resp2.status_code == 409

    # Advance 1 step so action becomes APPLIED
    client.post("/api/simulation/step", json={"dt": 5.0})
    assert get_bus_by_id("B14").is_holding is True

    # Attempt approve/manual while actively holding
    resp3 = client.post("/api/control/B14/approve")
    assert resp3.status_code == 409
    print("PASS: Double hold prevented safely with HTTP 409 Conflict")


def test_manual_control_validation():
    print("\n--- TEST 10: Manual Hold Duration Validation ---")
    SIMULATION_ENGINE.reset()

    # 1. Valid manual hold
    resp_ok = client.post("/api/control/B14/manual", json={"hold_seconds": 30.0})
    assert resp_ok.status_code == 200

    SIMULATION_ENGINE.reset()

    # 2. Invalid hold duration <= 0
    resp_zero = client.post("/api/control/B14/manual", json={"hold_seconds": 0.0})
    assert resp_zero.status_code == 422

    # 3. Invalid hold duration > 60
    resp_too_large = client.post("/api/control/B14/manual", json={"hold_seconds": 75.0})
    assert resp_too_large.status_code == 422

    # 4. Unknown bus
    resp_unknown = client.post("/api/control/UNKNOWN_99/manual", json={"hold_seconds": 20.0})
    assert resp_unknown.status_code == 404

    print("PASS: Manual control boundaries (>0 and <=60s) validated")


def test_determinism():
    print("\n--- TEST 12: Determinism of Control Application ---")

    def run_trial():
        SIMULATION_ENGINE.reset()
        client.post("/api/control/B15/manual", json={"hold_seconds": 15.0})
        for _ in range(8):
            client.post("/api/simulation/step", json={"dt": 5.0})
        buses = client.get("/api/buses").json()
        actions = client.get("/api/control/actions").json()
        return buses, actions

    trial1_buses, trial1_actions = run_trial()
    trial2_buses, trial2_actions = run_trial()

    assert len(trial1_buses) == len(trial2_buses)
    for b1, b2 in zip(trial1_buses, trial2_buses):
        assert b1["bus_id"] == b2["bus_id"]
        assert b1["position"] == b2["position"]
        assert b1["delay_seconds"] == b2["delay_seconds"]
        assert b1["is_holding"] == b2["is_holding"]

    assert len(trial1_actions) == len(trial2_actions)
    for a1, a2 in zip(trial1_actions, trial2_actions):
        assert a1["action_id"] == a2["action_id"]
        assert a1["state"] == a2["state"]
        assert a1["approved_hold_seconds"] == a2["approved_hold_seconds"]
        assert a1["applied_at_simulation_time"] == a2["applied_at_simulation_time"]
        assert a1["completed_at_simulation_time"] == a2["completed_at_simulation_time"]

    print("PASS: Deterministic repeated execution verified")


def test_api_integrity_and_regression():
    print("\n--- TEST 13 & 14: Phase 1-9 Endpoints Regression ---")
    assert client.get("/").status_code == 200
    assert client.get("/health").status_code == 200
    assert client.get("/api/buses").status_code == 200
    assert client.get("/api/buses/B14").status_code == 200
    assert client.get("/api/passengers").status_code == 200
    assert client.get("/api/traffic").status_code == 200
    assert client.get("/api/incidents").status_code == 200
    assert client.get("/api/simulation/state").status_code == 200
    assert client.get("/api/control/bunching").status_code == 200
    assert client.get("/api/control/risk").status_code == 200
    assert client.get("/api/control/recommendations").status_code == 200
    assert client.get("/api/control/actions").status_code == 200
    assert client.get("/docs").status_code == 200
    assert client.get("/openapi.json").status_code == 200
    print("PASS: All APIs intact and backward compatible")


if __name__ == "__main__":
    test_approval_and_hold_lifecycle()
    test_rejection_lifecycle()
    test_cannot_approve_no_hold()
    test_exact_hold_duration_and_partial_timestep()
    test_headway_and_pipeline_recalculation()
    test_no_double_hold()
    test_manual_control_validation()
    test_determinism()
    test_api_integrity_and_regression()
    print("\n==============================================")
    print("ALL PHASE 10 CONTROL APPROVAL & APPLICATION TESTS PASSED!")
    print("==============================================")
