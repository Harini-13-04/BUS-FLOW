from fastapi import APIRouter, HTTPException, status
from typing import Optional

from app.schemas.simulation import (
    SimulationStartRequest,
    SimulationRunRequest,
    SimulationStateResponse,
)
from app.simulation.engine import SIMULATION_ENGINE, SimulationConfig

router = APIRouter(prefix="/api/simulation", tags=["Simulation"])


@router.post("/start", response_model=SimulationStateResponse)
def post_start_simulation(payload: Optional[SimulationStartRequest] = None):
    """Start or reinitialize the simulation with configuration."""
    config = None
    if payload:
        config = SimulationConfig(
            route_id=payload.route_id or "21G",
            number_of_buses=payload.number_of_buses or 5,
            timestep_seconds=payload.timestep_seconds or 5.0,
            traffic_condition=payload.traffic_condition or "NORMAL",
            simulation_duration=payload.simulation_duration or 600.0,
        )
    return SIMULATION_ENGINE.start(config)


@router.post("/step", response_model=SimulationStateResponse)
def post_step_simulation():
    """Advance the simulation by exactly one timestep."""
    return SIMULATION_ENGINE.step()


@router.get("/state", response_model=SimulationStateResponse)
def get_simulation_state():
    """Retrieve the current complete simulation state snapshot."""
    return SIMULATION_ENGINE.get_state()


@router.post("/reset", response_model=SimulationStateResponse)
def post_reset_simulation():
    """Reset simulation back to clean deterministic initial state."""
    return SIMULATION_ENGINE.reset()


@router.post("/run", response_model=SimulationStateResponse)
def post_run_simulation(payload: Optional[SimulationRunRequest] = None):
    """Execute simulation repeatedly for a requested step count or duration."""
    steps = payload.steps if payload else None
    duration = payload.duration_seconds if payload else None
    return SIMULATION_ENGINE.run(steps=steps, duration_seconds=duration)
