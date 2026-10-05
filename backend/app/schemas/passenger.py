from pydantic import BaseModel, ConfigDict, Field


class StopPassengerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    stop_id: str = Field(..., description="Unique stop identifier")
    waiting_passengers: int = Field(..., description="Current count of passengers waiting at the stop")
    arrival_rate: float = Field(..., description="Deterministic arrival rate in passengers per second")
    total_arrivals: int = Field(..., description="Cumulative passenger arrivals at this stop")
    total_boarded: int = Field(..., description="Cumulative passengers boarded at this stop")
    total_waiting_time: float = Field(..., description="Cumulative passenger waiting time in seconds")
