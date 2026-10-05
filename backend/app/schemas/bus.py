from typing import Optional, Union
from pydantic import BaseModel, ConfigDict, Field


class BusResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    bus_id: str = Field(..., description="Unique bus identifier")
    route_id: str = Field(..., description="Identifier of the route")
    status: str = Field(..., description="Bus operational status: NORMAL, AT_RISK, SEVERE_DELAY")
    current_stop: str = Field(..., description="Current or nearest stop ID")
    position: float = Field(..., description="Position along the route in meters")
    direction: Union[int, str] = Field(..., description="Travel direction along the route")
    speed: float = Field(..., description="Current speed in km/h")
    delay_seconds: float = Field(..., description="Current delay in seconds")
    passengers: int = Field(..., description="Current passenger load")
    capacity: int = Field(..., description="Maximum passenger capacity")
    headway_ahead: Optional[float] = Field(default=0.0, description="Headway to preceding bus in seconds")
    headway_behind: Optional[float] = Field(default=0.0, description="Headway to following bus in seconds")
    desired_headway: Optional[float] = Field(default=345.6, description="Target nominal headway in seconds")
    is_holding: bool = Field(default=False, description="True if bus is currently executing a control hold")
    hold_remaining_seconds: float = Field(default=0.0, description="Remaining hold duration in seconds")
    active_control_action_id: Optional[str] = Field(default=None, description="Active control action ID if holding")

