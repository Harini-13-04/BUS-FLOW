"""
BUSFLOW — Phase 11: Recovery Pydantic Schemas
Response models for recovery measurements, before/after snapshots, and impact metrics.
"""

from typing import Optional
from pydantic import BaseModel, Field


class RecoverySnapshotResponse(BaseModel):
    action_id: str = Field(..., description="Associated control action ID")
    bus_id: str = Field(..., description="Unique bus identifier")
    simulation_time: float = Field(..., description="Simulation clock timestamp when snapshot was captured (seconds)")
    position: float = Field(..., description="Bus distance along route (meters)")
    headway_ahead: float = Field(..., description="Forward headway to leading bus (seconds)")
    headway_behind: float = Field(..., description="Rear headway from trailing bus (seconds)")
    desired_headway: float = Field(..., description="Nominal scheduled headway baseline (seconds)")
    bunching_status: str = Field(..., description="Bunching categorization (NORMAL, AT_RISK, SEVERE_DELAY)")
    is_bunching: bool = Field(..., description="True if bus is bunched/severely delayed")
    risk_score: float = Field(..., description="Explainable bunching risk score (0.00 to 1.00)")
    risk_level: str = Field(..., description="Categorical risk tier (LOW, MEDIUM, HIGH, CRITICAL)")
    delay_seconds: float = Field(..., description="Accumulated schedule delay (seconds)")
    passenger_load: int = Field(..., description="Current on-board passenger count")
    passenger_capacity: int = Field(..., description="Maximum bus passenger capacity")
    passenger_waiting_at_relevant_stop: Optional[int] = Field(
        None, description="Waiting passengers at current stop if applicable"
    )


class RecoveryMeasurementResponse(BaseModel):
    recovery_id: str = Field(..., description="Unique recovery measurement identifier")
    action_id: str = Field(..., description="Associated control action ID")
    bus_id: str = Field(..., description="Bus under recovery monitoring")
    state: str = Field(..., description="Recovery lifecycle state (NOT_STARTED, TRACKING, RECOVERED, TIMEOUT)")
    started_at_simulation_time: float = Field(..., description="Simulation time when hold was applied and tracking started")
    observation_window_seconds: float = Field(900.0, description="Maximum observation window duration (seconds)")
    recovered_at_simulation_time: Optional[float] = Field(None, description="Simulation time when recovery criteria were satisfied")
    recovery_time_seconds: Optional[float] = Field(None, description="Actual elapsed simulation recovery duration (seconds)")
    hold_duration_seconds: float = Field(..., description="Hold duration applied by control action (seconds)")

    # Snapshots
    before_control: Optional[RecoverySnapshotResponse] = Field(None, description="Baseline state captured at hold application")
    after_control: Optional[RecoverySnapshotResponse] = Field(None, description="State captured upon recovery or timeout")

    # Impact Deltas & Metrics
    headway_change_seconds: Optional[float] = Field(None, description="Headway change (after - before) in seconds")
    risk_change: Optional[float] = Field(None, description="Risk score change (after - before)")
    delay_change_seconds: Optional[float] = Field(None, description="Delay change (after - before) in seconds")
    control_delay_added: float = Field(0.0, description="Direct delay added by the hold intervention (seconds)")
    risk_reduction_percentage: Optional[float] = Field(None, description="Percentage reduction in risk score (%)")
    passenger_waiting_before: Optional[int] = Field(None, description="Passenger queue count before control")
    passenger_waiting_after: Optional[int] = Field(None, description="Passenger queue count after control")
    passenger_waiting_change: Optional[int] = Field(None, description="Change in waiting passengers at stop")
    summary: str = Field(..., description="Deterministic explanation of the recovery result")

    # Flattened Before Metrics
    before_headway_ahead: Optional[float] = Field(None, description="Forward headway before control")
    before_headway_behind: Optional[float] = Field(None, description="Rear headway before control")
    before_desired_headway: Optional[float] = Field(None, description="Desired headway before control")
    before_risk_score: Optional[float] = Field(None, description="Risk score before control")
    before_risk_level: Optional[str] = Field(None, description="Risk level before control")
    before_bunching_status: Optional[str] = Field(None, description="Bunching status before control")
    before_delay_seconds: Optional[float] = Field(None, description="Delay before control")
    before_passenger_load: Optional[int] = Field(None, description="Passenger load before control")

    # Flattened After Metrics
    after_headway_ahead: Optional[float] = Field(None, description="Forward headway after recovery/timeout")
    after_headway_behind: Optional[float] = Field(None, description="Rear headway after recovery/timeout")
    after_risk_score: Optional[float] = Field(None, description="Risk score after recovery/timeout")
    after_risk_level: Optional[str] = Field(None, description="Risk level after recovery/timeout")
    after_bunching_status: Optional[str] = Field(None, description="Bunching status after recovery/timeout")
    after_delay_seconds: Optional[float] = Field(None, description="Delay after recovery/timeout")
    after_passenger_load: Optional[int] = Field(None, description="Passenger load after recovery/timeout")
