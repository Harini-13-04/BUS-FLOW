from typing import List, Optional
from fastapi import APIRouter, HTTPException, status

from app.schemas.control import (
    ControlRecommendationResponse,
    ControlActionResponse,
    ManualControlRequest,
)
from app.schemas.recovery import (
    RecoveryMeasurementResponse,
)
from app.simulation.bus import get_all_buses, get_bus_by_id
from app.simulation.traffic import get_current_traffic
from app.simulation.passenger import get_all_passenger_states, get_passenger_state
from app.control.controller import evaluate_fleet_control, evaluate_bus_control, ControlDecision
from app.control.action import (
    ControlActionState,
    OperatorActionType,
    create_control_action,
    get_all_actions,
    get_action_by_id,
    get_active_action_for_bus,
)
from app.control.recovery import (
    RecoveryState,
    RecoveryMeasurement,
    get_all_recoveries,
    get_recovery_by_action_id,
    get_recoveries_for_bus,
)

router = APIRouter(prefix="/api/control", tags=["Control Decisions & Recovery"])


# ==========================================
# Control Recommendations (Phase 9)
# ==========================================


@router.get("/recommendations", response_model=List[ControlRecommendationResponse])
def get_fleet_control_recommendations():
    """
    Retrieve explainable control recommendations (HOLD / NO_HOLD) and hold durations for all buses.
    Side-effect free.
    """
    buses = get_all_buses()
    traffic = get_current_traffic().condition
    passenger_states = {ps.stop_id: ps for ps in get_all_passenger_states()}
    results = evaluate_fleet_control(
        buses=buses,
        traffic_condition=traffic,
        stop_passenger_states=passenger_states,
    )
    return list(results.values())


@router.get("/recommendations/{bus_id}", response_model=ControlRecommendationResponse)
def get_bus_control_recommendation(bus_id: str):
    """
    Retrieve explainable control recommendation (HOLD / NO_HOLD) and justification for a specific bus.
    Side-effect free.
    """
    bus = get_bus_by_id(bus_id)
    if not bus:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bus '{bus_id}' not found",
        )

    traffic = get_current_traffic().condition
    stop_waiting = 10
    stop_arr_rate = 0.20
    if bus.current_stop:
        pstate = get_passenger_state(bus.current_stop)
        if pstate:
            stop_waiting = pstate.waiting_passengers
            stop_arr_rate = pstate.arrival_rate

    return evaluate_bus_control(
        bus=bus,
        traffic_condition=traffic,
        stop_waiting_passengers=stop_waiting,
        stop_arrival_rate=stop_arr_rate,
    )


# ==========================================
# Operator Approval & Rejection (Phase 10)
# ==========================================


@router.post("/{bus_id}/approve", response_model=ControlActionResponse, status_code=status.HTTP_200_OK)
def approve_bus_control_recommendation(bus_id: str):
    """
    Operator approval of a HOLD recommendation for a bus.
    Transitions recommendation from RECOMMENDED to APPROVED state.
    """
    from app.simulation.engine import SIMULATION_ENGINE

    bus = get_bus_by_id(bus_id)
    if not bus:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bus '{bus_id}' not found",
        )

    # Prevent overlapping holds
    if bus.is_holding or bus.hold_remaining_seconds > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Bus '{bus_id}' is already executing an active hold ({bus.hold_remaining_seconds:.1f}s remaining).",
        )

    existing_active = get_active_action_for_bus(bus_id)
    if existing_active:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Bus '{bus_id}' already has a pending/active control action '{existing_active.action_id}'.",
        )

    # Evaluate live recommendation for validity
    traffic = get_current_traffic().condition
    stop_waiting = 10
    stop_arr_rate = 0.20
    if bus.current_stop:
        pstate = get_passenger_state(bus.current_stop)
        if pstate:
            stop_waiting = pstate.waiting_passengers
            stop_arr_rate = pstate.arrival_rate

    rec = evaluate_bus_control(
        bus=bus,
        traffic_condition=traffic,
        stop_waiting_passengers=stop_waiting,
        stop_arrival_rate=stop_arr_rate,
    )

    if rec.decision != ControlDecision.HOLD:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot approve HOLD for bus '{bus_id}': Current recommendation is NO_HOLD ({rec.reason}).",
        )

    sim_time = SIMULATION_ENGINE.simulation_time
    action = create_control_action(
        bus_id=bus.bus_id,
        route_id=bus.route_id,
        decision=ControlDecision.HOLD,
        requested_hold_seconds=rec.recommended_hold_seconds,
        approved_hold_seconds=rec.recommended_hold_seconds,
        state=ControlActionState.APPROVED,
        simulation_time=sim_time,
        reason=f"Operator approved recommendation: {rec.reason}",
        operator_action=OperatorActionType.RECOMMENDATION_APPROVAL,
    )

    return action


@router.post("/{bus_id}/reject", response_model=ControlActionResponse, status_code=status.HTTP_200_OK)
def reject_bus_control_recommendation(bus_id: str):
    """
    Operator rejection of a control recommendation.
    Records REJECTED action with zero simulation effect.
    """
    from app.simulation.engine import SIMULATION_ENGINE

    bus = get_bus_by_id(bus_id)
    if not bus:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bus '{bus_id}' not found",
        )

    traffic = get_current_traffic().condition
    stop_waiting = 10
    stop_arr_rate = 0.20
    if bus.current_stop:
        pstate = get_passenger_state(bus.current_stop)
        if pstate:
            stop_waiting = pstate.waiting_passengers
            stop_arr_rate = pstate.arrival_rate

    rec = evaluate_bus_control(
        bus=bus,
        traffic_condition=traffic,
        stop_waiting_passengers=stop_waiting,
        stop_arrival_rate=stop_arr_rate,
    )

    sim_time = SIMULATION_ENGINE.simulation_time
    action = create_control_action(
        bus_id=bus.bus_id,
        route_id=bus.route_id,
        decision=ControlDecision.NO_HOLD,
        requested_hold_seconds=rec.recommended_hold_seconds,
        approved_hold_seconds=0.0,
        state=ControlActionState.REJECTED,
        simulation_time=sim_time,
        reason=f"Operator rejected recommendation ({rec.decision}): {rec.reason}",
        operator_action=OperatorActionType.RECOMMENDATION_REJECTION,
    )

    return action


@router.post("/{bus_id}/manual", response_model=ControlActionResponse, status_code=status.HTTP_200_OK)
def manual_bus_hold(bus_id: str, payload: ManualControlRequest):
    """
    Explicit operator manual intervention to apply a direct hold duration (1 to 60 seconds).
    """
    from app.simulation.engine import SIMULATION_ENGINE

    bus = get_bus_by_id(bus_id)
    if not bus:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bus '{bus_id}' not found",
        )

    if payload.hold_seconds <= 0.0 or payload.hold_seconds > 60.0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Manual hold duration must be > 0 and <= 60 seconds (got {payload.hold_seconds}s)",
        )

    if bus.is_holding or bus.hold_remaining_seconds > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Bus '{bus_id}' is already executing an active hold ({bus.hold_remaining_seconds:.1f}s remaining).",
        )

    existing_active = get_active_action_for_bus(bus_id)
    if existing_active:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Bus '{bus_id}' already has a pending/active control action '{existing_active.action_id}'.",
        )

    sim_time = SIMULATION_ENGINE.simulation_time
    reason = payload.reason or f"Operator manual hold intervention of {payload.hold_seconds:.1f}s"
    action = create_control_action(
        bus_id=bus.bus_id,
        route_id=bus.route_id,
        decision=ControlDecision.HOLD,
        requested_hold_seconds=payload.hold_seconds,
        approved_hold_seconds=payload.hold_seconds,
        state=ControlActionState.APPROVED,
        simulation_time=sim_time,
        reason=reason,
        operator_action=OperatorActionType.MANUAL,
    )

    return action


# ==========================================
# Control Action History (Phase 10)
# ==========================================


@router.get("/actions", response_model=List[ControlActionResponse])
def get_control_actions_history():
    """
    Retrieve full historical log of control actions, approvals, rejections, and execution states.
    """
    return get_all_actions()


@router.get("/actions/{action_id}", response_model=ControlActionResponse)
def get_single_control_action(action_id: str):
    """
    Retrieve details and timestamps of a specific control action by its ID.
    """
    action = get_action_by_id(action_id)
    if not action:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Control action '{action_id}' not found",
        )
    return action


# ==========================================
# Recovery Measurements (Phase 11)
# ==========================================


@router.get("/recovery", response_model=List[RecoveryMeasurementResponse])
def get_recovery_measurements():
    """
    Retrieve all service regularity recovery measurements across all control actions.
    """
    measurements = get_all_recoveries()
    return [m.to_dict() for m in measurements]


@router.get("/recovery/{action_id}", response_model=RecoveryMeasurementResponse)
def get_single_recovery_measurement(action_id: str):
    """
    Retrieve the service regularity recovery measurement for a specific control action.
    """
    measurement = get_recovery_by_action_id(action_id)
    if measurement:
        return measurement.to_dict()

    action = get_action_by_id(action_id)
    if not action:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Control action / recovery '{action_id}' not found",
        )

    # Action exists but tracking has not started yet (e.g. APPROVED or REJECTED)
    not_started = RecoveryMeasurement(
        recovery_id=f"REC_{action.action_id}",
        action_id=action.action_id,
        bus_id=action.bus_id,
        state=RecoveryState.NOT_STARTED,
        started_at_simulation_time=action.created_at_simulation_time,
        hold_duration_seconds=action.approved_hold_seconds,
        summary=f"Control action '{action_id}' is in state '{action.state}'. Recovery tracking has not started.",
    )
    return not_started.to_dict()


@router.get("/recovery/bus/{bus_id}", response_model=List[RecoveryMeasurementResponse])
def get_bus_recovery_measurements(bus_id: str):
    """
    Retrieve all service regularity recovery records associated with a specific bus.
    """
    bus = get_bus_by_id(bus_id)
    if not bus:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bus '{bus_id}' not found",
        )
    records = get_recoveries_for_bus(bus_id)
    return [r.to_dict() for r in records]
