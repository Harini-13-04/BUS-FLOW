from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.bus import BusResponse
from app.schemas.incident import IncidentResponse


class SimulationStartRequest(BaseModel):
    route_id: Optional[str] = Field(default="21G", description="Route ID to operate on")
    number_of_buses: Optional[int] = Field(default=5, ge=1, le=20, description="Fleet size")
    timestep_seconds: Optional[float] = Field(default=5.0, gt=0, description="Timestep interval in seconds")
    traffic_condition: Optional[str] = Field(default="NORMAL", description="Traffic condition: NORMAL, MODERATE, HEAVY")
    simulation_duration: Optional[float] = Field(default=600.0, gt=0, description="Total simulation duration in seconds")


class SimulationRunRequest(BaseModel):
    steps: Optional[int] = Field(default=None, ge=1, description="Number of discrete steps to execute")
    duration_seconds: Optional[float] = Field(default=None, gt=0, description="Simulated duration in seconds")


class PassengerSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    total_waiting: int = Field(..., description="Total passengers currently queued across all stops")
    total_boarded: int = Field(..., description="Total cumulative passengers boarded onto buses")
    total_waiting_time: float = Field(..., description="Total cumulative waiting time in passenger-seconds")


class SimulationStateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    running: bool = Field(..., description="Whether simulation is actively running")
    simulation_time: float = Field(..., description="Current elapsed simulation time in seconds")
    timestep_seconds: float = Field(..., description="Configured step increment in seconds")
    route_id: str = Field(..., description="Active route identifier")
    traffic_condition: str = Field(..., description="Active traffic condition")
    active_incidents: List[IncidentResponse] = Field(default_factory=list, description="Currently active incidents")
    buses: List[BusResponse] = Field(default_factory=list, description="All buses and their current kinematic state")
    passenger_summary: PassengerSummary = Field(..., description="Aggregated passenger metrics across the network")
