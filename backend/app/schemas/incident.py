from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class IncidentCreateRequest(BaseModel):
    type: str = Field(
        ...,
        description="Incident type: TRAFFIC_CONGESTION, BUS_BREAKDOWN, ROAD_BLOCKAGE, PASSENGER_SURGE, SIGNAL_DELAY, BUS_STALL, CUSTOM_DELAY",
    )
    severity: str = Field(
        default="MEDIUM",
        description="Severity level: LOW, MEDIUM, HIGH, CRITICAL",
    )
    duration: float = Field(
        ...,
        ge=0.0,
        description="Duration of the incident in seconds (must be >= 0)",
    )
    delay_seconds: float = Field(
        ...,
        ge=0.0,
        description="Delay added by the incident in seconds (must be >= 0)",
    )
    affected_bus: Optional[str] = Field(
        default=None,
        description="Identifier of the specific bus affected (optional for route-wide incidents)",
    )
    affected_route: Optional[str] = Field(
        default=None,
        description="Identifier of the specific route affected (optional for bus-specific incidents)",
    )
    incident_id: Optional[str] = Field(
        default=None,
        description="Optional custom identifier for the incident (auto-generated if omitted)",
    )
    auto_activate: bool = Field(
        default=False,
        description="Whether to activate the incident immediately upon creation",
    )


class IncidentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    incident_id: str = Field(..., description="Unique incident identifier")
    type: str = Field(..., description="Incident type")
    severity: str = Field(..., description="Severity level")
    duration: float = Field(..., description="Duration in seconds")
    delay_seconds: float = Field(..., description="Delay added in seconds")
    affected_bus: Optional[str] = Field(default=None, description="Affected bus ID if applicable")
    affected_route: Optional[str] = Field(default=None, description="Affected route ID if applicable")
    start_time: Optional[float] = Field(default=None, description="Simulation timestamp when activated")
    status: str = Field(..., description="Incident status: CREATED, ACTIVE, RESOLVED")
