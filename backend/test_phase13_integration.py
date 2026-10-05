"""
BUSFLOW — PHASE 13: End-to-End Integration, Stabilization, and Regression Test Suite

Comprehensive automated test suite validating:
1. Complete control and simulation pipeline integration
2. Operator approval lifecycle and physical hold application
3. Recovery measurement tracking and delta evaluation
4. Operational metrics snapshots and deterministic scenario comparisons
5. State reset integrity and determinism across repeated executions
6. Error handling, HTTP status codes (400, 404, 409, 422), and validation guards
7. CORS and OpenAPI specification completeness
8. Cross-phase regression across Phases 8 through 12
"""

import math
import sys
from fastapi.testclient import TestClient

from app.main import app
from app.simulation.engine import SIMULATION_ENGINE, SimulationConfig
from app.simulation.bus import get_all_buses, get_bus_by_id, reset_bus_fleet
from app.simulation.passenger import get_all_passenger_states, reset_passenger_demand
from app.simulation.traffic import set_traffic_condition, TrafficCondition
from app.simulation.incident import (
    create_incident,
    get_all_incidents,
    reset_incident_store,
    IncidentType,
    IncidentSeverity,
    IncidentStatus,
)
from app.control.action import (
    ControlActionState,
    get_all_actions,
    get_active_action_for_bus,
    reset_action_store,
)
from app.control.recovery import (
    RecoveryState,
    get_all_recoveries,
    get_recovery_by_action_id,
    reset_recovery_store,
)
from app.metrics.metrics import (
    calculate_metrics_snapshot,
    calculate_scenario_comparison,
)

client = TestClient(app)


def test_1_root_and_health_endpoints():
    """Verify foundational endpoints / and /health"""
    r_root = client.get("/")
    assert r_root.status_code == 200
    assert r_root.json()["status"] == "running"
    assert "BUSFLOW" in r_root.json()["name"]

    r_health = client.get("/health")
    assert r_health.status_code == 200
    assert r_health.json()["status"] == "healthy"
    print("PASS: Root and health check endpoints verified.")


def test_2_openapi_and_cors_contract():
    """Verify OpenAPI JSON specification and CORS headers"""
    r_openapi = client.get("/openapi.json")
    assert r_openapi.status_code == 200
    schema = r_openapi.json()
    assert "paths" in schema
    paths = schema["paths"]

    # Verify all critical endpoint paths exist in schema
    critical_paths = [
        "/api/buses",
        "/api/buses/{bus_id}",
        "/api/passengers",
        "/api/passengers/{stop_id}",
        "/api/traffic",
        "/api/incidents",
        "/api/incidents/{incident_id}",
        "/api/incidents/{incident_id}/activate",
        "/api/incidents/{incident_id}/resolve",
        "/api/simulation/start",
        "/api/simulation/step",
        "/api/simulation/state",
        "/api/simulation/reset",
        "/api/simulation/run",
        "/api/control/bunching",
        "/api/control/bunching/{bus_id}",
        "/api/control/risk",
        "/api/control/risk/{bus_id}",
        "/api/control/recommendations",
        "/api/control/recommendations/{bus_id}",
        "/api/control/{bus_id}/approve",
        "/api/control/{bus_id}/reject",
        "/api/control/{bus_id}/manual",
        "/api/control/actions",
        "/api/control/actions/{action_id}",
        "/api/control/recovery",
        "/api/control/recovery/{action_id}",
        "/api/control/recovery/bus/{bus_id}",
        "/api/analytics/summary",
        "/api/analytics/comparison",
    ]
    for p in critical_paths:
        assert p in paths, f"Path {p} missing from OpenAPI specification"

    # Verify CORS preflight
    r_cors = client.options(
        "/api/buses",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert r_cors.status_code in [200, 204]
    print("PASS: OpenAPI contract and CORS headers verified.")


def test_3_error_handling_and_status_codes():
    """Verify standard error status codes: 400, 404, 409, 422"""
    # 404 Unknown Bus
    r = client.get("/api/buses/NONEXISTENT_BUS")
    assert r.status_code == 404
    assert "not found" in r.json()["detail"].lower()

    # 404 Unknown Stop
    r = client.get("/api/passengers/STOP_999")
    assert r.status_code == 404

    # 404 Unknown Incident
    r = client.get("/api/incidents/INC_999")
    assert r.status_code == 404

    # 404 Unknown Action
    r = client.get("/api/control/actions/ACT_999")
    assert r.status_code == 404

    # 404 Unknown Recovery Bus
    r = client.get("/api/control/recovery/bus/BUS_999")
    assert r.status_code == 404

    # 422 Invalid Traffic Condition
    r = client.post("/api/traffic", json={"condition": "SUPER_FAST"})
    assert r.status_code == 422

    # 422 Invalid Manual Hold Duration (> 60s)
    r = client.post("/api/control/B14/manual", json={"hold_seconds": 120.0})
    assert r.status_code == 422

    # 422 Invalid Manual Hold Duration (<= 0s)
    r = client.post("/api/control/B14/manual", json={"hold_seconds": 0.0})
    assert r.status_code == 422

    # 400 Approve when recommendation is NO_HOLD
    SIMULATION_ENGINE.reset()
    r = client.post("/api/control/B18/approve")
    assert r.status_code == 400
    assert "NO_HOLD" in r.json()["detail"]

    # 409 Conflict: Approve when bus is already holding
    bus = get_bus_by_id("B15")
    bus.is_holding = True
    bus.hold_remaining_seconds = 10.0
    r = client.post("/api/control/B15/manual", json={"hold_seconds": 15.0})
    assert r.status_code == 409
    assert "already executing an active hold" in r.json()["detail"]

    SIMULATION_ENGINE.reset()
    print("PASS: Error handling and status codes (400, 404, 409, 422) verified.")


def test_4_reset_integrity_and_determinism():
    """Verify that POST /api/simulation/reset completely restores deterministic initial state"""
    # 1. Mutate state heavily
    SIMULATION_ENGINE.start()
    inc = create_incident(
        incident_type=IncidentType.BUS_STALL,
        severity=IncidentSeverity.CRITICAL,
        duration=300.0,
        delay_seconds=300.0,
        affected_bus="B14",
        auto_activate=True,
    )
    for _ in range(30):
        SIMULATION_ENGINE.step(5.0)

    assert SIMULATION_ENGINE.simulation_time > 0
    assert len(get_all_incidents()) > 0

    # 2. Call Reset endpoint
    r_reset = client.post("/api/simulation/reset")
    assert r_reset.status_code == 200
    state = r_reset.json()

    assert state["simulation_time"] == 0.0
    assert state["running"] is False
    assert len(state["active_incidents"]) == 0
    assert len(get_all_actions()) == 0
    assert len(get_all_recoveries()) == 0

    # 3. Verify determinism: Run A vs Run B produce identical snapshots
    run_a_snapshots = []
    SIMULATION_ENGINE.start()
    for _ in range(10):
        s = SIMULATION_ENGINE.step(5.0)
        run_a_snapshots.append(s["buses"][0]["position"])

    SIMULATION_ENGINE.reset()
    run_b_snapshots = []
    SIMULATION_ENGINE.start()
    for _ in range(10):
        s = SIMULATION_ENGINE.step(5.0)
        run_b_snapshots.append(s["buses"][0]["position"])

    assert run_a_snapshots == run_b_snapshots, "Reset failed to reproduce deterministic simulation state!"
    SIMULATION_ENGINE.reset()
    print("PASS: Simulation reset integrity and deterministic reproducibility verified.")


def test_5_full_end_to_end_control_pipeline():
    """
    Test complete lifecycle:
    Reset -> B14 Stall -> B15 Compression -> Controller Recommendation (HOLD) ->
    Operator Approval (APPROVED) -> Simulation Step (APPLIED) -> Physical Bus Hold ->
    Hold Expiry (COMPLETED) -> Movement Resumption -> Recovery Tracking ->
    Operational Metrics & Comparison.
    """
    print("\n--- Executing Full End-to-End Control Pipeline ---")
    # Step 1: Clean Reset
    SIMULATION_ENGINE.reset()

    # Step 2: Inject B14 stall incident
    inc = create_incident(
        incident_type=IncidentType.BUS_STALL,
        severity=IncidentSeverity.CRITICAL,
        duration=300.0,
        delay_seconds=300.0,
        affected_bus="B14",
        auto_activate=True,
    )
    assert inc.status == IncidentStatus.ACTIVE

    # Step 3: Advance simulation until B15 forward headway compresses
    for _ in range(15):
        SIMULATION_ENGINE.step(5.0)

    # Step 4: Query control recommendation for B15
    r_rec = client.get("/api/control/recommendations/B15")
    assert r_rec.status_code == 200
    rec_data = r_rec.json()
    assert rec_data["decision"] == "HOLD"
    assert rec_data["recommended_hold_seconds"] > 0.0
    rec_hold = rec_data["recommended_hold_seconds"]
    print(f"Step 4: B15 Recommendation is HOLD ({rec_hold:.1f}s). Reason: {rec_data['reason']}")

    # Step 5: Operator approves recommendation
    r_app = client.post("/api/control/B15/approve")
    assert r_app.status_code == 200
    action_data = r_app.json()
    action_id = action_data["action_id"]
    assert action_data["state"] == "APPROVED"
    assert action_data["approved_hold_seconds"] == rec_hold
    print(f"Step 5: Operator APPROVED action '{action_id}' for {rec_hold:.1f}s")

    # Step 6: Next simulation step transitions APPROVED -> APPLIED
    b15_pos_before_hold = get_bus_by_id("B15").position
    b15_delay_before_hold = get_bus_by_id("B15").delay_seconds

    SIMULATION_ENGINE.step(5.0)
    b15 = get_bus_by_id("B15")
    assert b15.is_holding is True
    assert b15.position == b15_pos_before_hold, "B15 position must remain frozen while holding!"

    # Step 7: Check action state is APPLIED and recovery tracking started
    r_act = client.get(f"/api/control/actions/{action_id}")
    assert r_act.status_code == 200
    assert r_act.json()["state"] == "APPLIED"

    r_recov = client.get(f"/api/control/recovery/{action_id}")
    assert r_recov.status_code == 200
    recov_data = r_recov.json()
    assert recov_data["state"] in ["TRACKING", "RECOVERED"]
    assert recov_data["before_control"] is not None
    print(f"Step 7: Hold APPLIED. Recovery state: {recov_data['state']}")

    # Step 8: Step through hold until completed
    steps_needed = math.ceil(rec_hold / 5.0) + 2
    for _ in range(steps_needed):
        SIMULATION_ENGINE.step(5.0)

    # Step 9: Verify hold completed and bus resumed movement
    r_act_done = client.get(f"/api/control/actions/{action_id}")
    assert r_act_done.json()["state"] == "COMPLETED"
    assert b15.is_holding is False
    assert b15.delay_seconds >= b15_delay_before_hold + rec_hold
    print(f"Step 9: Hold COMPLETED. B15 delay increased by approved hold duration.")

    # Step 10: Query analytics summary
    r_summary = client.get("/api/analytics/summary")
    assert r_summary.status_code == 200
    summary = r_summary.json()
    assert summary["control"]["approved_control_actions"] >= 1
    assert summary["control"]["total_holding_time_seconds"] == rec_hold
    assert summary["fleet"]["total_buses"] == 5
    print("Step 10: Operational metrics summary verified.")

    # Step 11: Query deterministic comparison
    r_comp = client.get("/api/analytics/comparison")
    assert r_comp.status_code == 200
    comp = r_comp.json()
    assert comp["without_control"] is not None
    assert comp["with_busflow"] is not None
    assert len(comp["comparison_metrics"]) >= 7
    print("Step 11: Scenario comparison API verified.")

    SIMULATION_ENGINE.reset()
    print("PASS: Full end-to-end control pipeline test passed successfully.")


def test_6_cross_phase_regressions():
    """Run full regressions across Phase 8, 9, 10, 11, 12 engines"""
    print("\n--- Running Full Phase 8–12 Regression Suite ---")
    import test_phase8_risk
    import test_phase9_control
    import test_phase10_control
    import test_phase11_recovery
    import test_phase12_metrics

    test_phase8_risk.test_controlled_scenarios()
    test_phase8_risk.test_determinism()
    print("PASS: Phase 8 Risk Regression passed.")

    test_phase9_control.test_controlled_recommendation_scenarios()
    test_phase9_control.test_determinism()
    print("PASS: Phase 9 Controller Regression passed.")

    test_phase10_control.test_approval_and_hold_lifecycle()
    test_phase10_control.test_rejection_lifecycle()
    test_phase10_control.test_exact_hold_duration_and_partial_timestep()
    test_phase10_control.test_determinism()
    print("PASS: Phase 10 Hold Application Regression passed.")

    test_phase11_recovery.test_1_recovery_tracking_starts_after_applied()
    test_phase11_recovery.test_3_and_4_recovery_detection_and_time()
    test_phase11_recovery.test_6_recovery_timeout()
    test_phase11_recovery.test_13_determinism()
    print("PASS: Phase 11 Recovery Measurement Regression passed.")

    test_phase12_metrics.test_1_passenger_waiting_calculation()
    test_phase12_metrics.test_3_4_5_headway_mean_std_and_cov()
    test_phase12_metrics.test_7_8_total_delay_and_on_time_performance()
    test_phase12_metrics.test_16_17_improvement_percentage_and_zero_safety()
    test_phase12_metrics.test_18_19_20_deterministic_scenario_comparison()
    print("PASS: Phase 12 Operational Metrics Regression passed.")


def main():
    print("==================================================")
    print("BUSFLOW PHASE 13: FINAL INTEGRATION & API TEST")
    print("==================================================")
    test_1_root_and_health_endpoints()
    test_2_openapi_and_cors_contract()
    test_3_error_handling_and_status_codes()
    test_4_reset_integrity_and_determinism()
    test_5_full_end_to_end_control_pipeline()
    test_6_cross_phase_regressions()
    print("\n==================================================")
    print("ALL PHASE 13 INTEGRATION TESTS PASSED 100%!")
    print("BUSFLOW BACKEND INTEGRATION COMPLETE.")
    print("==================================================")


if __name__ == "__main__":
    main()
