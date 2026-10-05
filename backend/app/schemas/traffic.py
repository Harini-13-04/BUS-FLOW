from pydantic import BaseModel, ConfigDict, Field


class TrafficResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    condition: str = Field(..., description="Current traffic condition: NORMAL, MODERATE, HEAVY")
    speed_multiplier: float = Field(..., description="Multiplier applied to standard operating speeds")
    delay_multiplier: float = Field(..., description="Multiplier applied to travel delays")
    description: str = Field(..., description="Human-readable description of current traffic state")


class TrafficUpdateRequest(BaseModel):
    condition: str = Field(..., description="New traffic condition: NORMAL, MODERATE, HEAVY")
