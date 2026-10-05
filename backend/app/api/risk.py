from typing import List
from fastapi import APIRouter, HTTPException, status

from app.schemas.risk import RiskResponse
from app.simulation.bus import get_all_buses, get_bus_by_id
from app.simulation.traffic import get_current_traffic
from app.simulation.passenger import get_all_passenger_states, get_passenger_state
from app.control.risk import calculate_fleet_risk, calculate_bus_risk

router = APIRouter(prefix="/api/control/risk", tags=["Bunching Risk Score"])


@router.get("", response_model=List[RiskResponse])
def get_fleet_risk():
    """
    Retrieve explainable bunching and operational risk scores for the entire fleet.
    """
    buses = get_all_buses()
    traffic = get_current_traffic().condition
    passenger_states = {ps.stop_id: ps for ps in get_all_passenger_states()}
    results = calculate_fleet_risk(
        buses=buses,
        traffic_condition=traffic,
        stop_passenger_states=passenger_states,
    )
    return list(results.values())


@router.get("/{bus_id}", response_model=RiskResponse)
def get_bus_risk(bus_id: str):
    """
    Retrieve explainable bunching and operational risk score and contributing factors for a specific bus.
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

    return calculate_bus_risk(
        bus=bus,
        traffic_condition=traffic,
        stop_waiting_passengers=stop_waiting,
        stop_arrival_rate=stop_arr_rate,
    )
