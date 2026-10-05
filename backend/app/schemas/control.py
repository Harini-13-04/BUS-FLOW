from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ControlRecommendationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    bus_id: str = Field(..., description="Unique bus identifier")
    route_id: str = Field(..., description="Route identifier")
    decision: str = Field(..., description="Control recommendation: HOLD or NO_HOLD")
    recommended_hold_seconds: float = Field(..., description="Recommended hold duration in seconds (0.0 to 60.0)")
    headway_ahead: float = Field(..., description="Headway to preceding bus in seconds")
    headway_behind: float = Field(..., description="Headway to following bus in seconds")
    desired_headway: float = Field(..., description="Target desired headway baseline in seconds")
    passenger_load: int = Field(..., description="Current number of passengers on board")
    capacity: int = Field(..., description="Total passenger capacity")
    delay_seconds: float = Field(..., description="Cumulative delay in seconds")
    risk_score: float = Field(..., description="Explainable operational risk score (0.0 to 1.0)")
    risk_level: str = Field(..., description="Risk tier: LOW, MEDIUM, HIGH, CRITICAL")
    bunching_status: str = Field(..., description="Bunching status: NORMAL, AT_RISK, SEVERE_DELAY")
    predicted_demand: float = Field(..., description="Simulation-based predicted passenger demand pressure")
    traffic_condition: str = Field(..., description="Active traffic condition: NORMAL, MODERATE, HEAVY")
    reason: str = Field(..., description="Human-readable transparent justification for the recommendation")


class ManualControlRequest(BaseModel):
    hold_seconds: float = Field(
        ...,
        gt=0.0,
        le=60.0,
        description="Manual hold duration in seconds (must be > 0 and <= 60)",
    )
    reason: Optional[str] = Field(
        default=None,
        description="Optional operator justification for manual hold intervention",
    )


class ControlActionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    action_id: str = Field(..., description="Unique control action identifier")
    bus_id: str = Field(..., description="Identifier of the controlled bus")
    route_id: str = Field(..., description="Route identifier")
    decision: str = Field(..., description="Action decision: HOLD or NO_HOLD")
    requested_hold_seconds: float = Field(..., description="Requested hold duration in seconds")
    approved_hold_seconds: float = Field(..., description="Approved hold duration in seconds")
    state: str = Field(..., description="Action lifecycle state: RECOMMENDED, APPROVED, REJECTED, APPLIED, COMPLETED")
    created_at_simulation_time: float = Field(..., description="Simulation timestamp when action was created")
    approved_at_simulation_time: Optional[float] = Field(default=None, description="Simulation timestamp when approved")
    applied_at_simulation_time: Optional[float] = Field(default=None, description="Simulation timestamp when applied")
    completed_at_simulation_time: Optional[float] = Field(default=None, description="Simulation timestamp when completed")
    reason: str = Field(..., description="Justification and explanation for this control action")
    operator_action: Optional[str] = Field(default=None, description="Operator action origin: RECOMMENDATION_APPROVAL, RECOMMENDATION_REJECTION, MANUAL")
