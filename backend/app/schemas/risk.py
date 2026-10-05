from typing import Optional, Dict
from pydantic import BaseModel, ConfigDict, Field


class RiskComponentsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    headway_compression_risk: float = Field(..., description="Normalized forward headway compression risk (0.0 to 1.0)")
    rear_gap_risk: float = Field(..., description="Normalized rear-gap imbalance risk (0.0 to 1.0)")
    delay_risk: float = Field(..., description="Normalized schedule delay risk (0.0 to 1.0)")
    load_risk: float = Field(..., description="Normalized passenger crowding/load risk (0.0 to 1.0)")
    traffic_risk: float = Field(..., description="Normalized traffic disruption risk (0.0 to 1.0)")
    demand_risk: float = Field(..., description="Normalized predicted passenger demand risk (0.0 to 1.0)")


class RiskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    bus_id: str = Field(..., description="Unique bus identifier")
    route_id: str = Field(..., description="Route identifier")
    risk_score: float = Field(..., description="Overall explainable operational risk score (0.00 to 1.00)")
    risk_level: str = Field(..., description="Categorical risk tier: LOW, MEDIUM, HIGH, CRITICAL")
    headway_ahead: float = Field(..., description="Headway to preceding bus in seconds")
    headway_behind: float = Field(..., description="Headway to following bus in seconds")
    desired_headway: float = Field(..., description="Target desired headway baseline in seconds")
    delay_seconds: float = Field(..., description="Cumulative delay in seconds")
    passengers: int = Field(..., description="Current passenger load on the bus")
    capacity: int = Field(..., description="Total passenger capacity")
    traffic_condition: str = Field(..., description="Active traffic condition: NORMAL, MODERATE, HEAVY")
    predicted_demand: float = Field(..., description="Simulation-based predicted passenger demand pressure")
    bunching_status: str = Field(..., description="Bunching status: NORMAL, AT_RISK, SEVERE_DELAY")
    is_bunching: bool = Field(..., description="True if forward headway is critically compressed (<50% desired)")
    explanation: str = Field(..., description="Detailed transparent explanation of contributing risk factors")
    components: Optional[RiskComponentsResponse] = Field(None, description="Detailed breakdown of normalized sub-components")
