from typing import List
from fastapi import APIRouter, HTTPException, status

from app.schemas.bunching import BunchingResponse
from app.simulation.bus import get_all_buses, get_bus_by_id
from app.control.bunching import evaluate_fleet_bunching, evaluate_bus_bunching

router = APIRouter(prefix="/api/control/bunching", tags=["Bunching Detection"])


@router.get("", response_model=List[BunchingResponse])
def get_fleet_bunching():
    """Retrieve headway bunching classification and explanations for the entire fleet."""
    buses = get_all_buses()
    results = evaluate_fleet_bunching(buses)
    return list(results.values())


@router.get("/{bus_id}", response_model=BunchingResponse)
def get_bus_bunching(bus_id: str):
    """Retrieve headway bunching classification and explanation for a specific bus."""
    bus = get_bus_by_id(bus_id)
    if not bus:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bus '{bus_id}' not found",
        )
    return evaluate_bus_bunching(bus)
