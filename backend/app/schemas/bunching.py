from pydantic import BaseModel, ConfigDict, Field


class BunchingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    bus_id: str = Field(..., description="Unique bus identifier")
    route_id: str = Field(..., description="Route identifier")
    status: str = Field(..., description="Operational status: NORMAL, AT_RISK, SEVERE_DELAY")
    headway_ahead: float = Field(..., description="Headway to preceding bus in seconds")
    headway_behind: float = Field(..., description="Headway to following bus in seconds")
    desired_headway: float = Field(..., description="Configured target headway in seconds")
    delay_seconds: float = Field(..., description="Cumulative delay in seconds")
    is_bunching: bool = Field(..., description="True if forward headway is critically compressed (<50% desired)")
    explanation: str = Field(..., description="Human-readable explanation of headway & bunching classification")
