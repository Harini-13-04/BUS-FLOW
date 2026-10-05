"""
BUSFLOW — Phase 12: Metrics Pydantic Schemas
Response models for fleet, passenger, service, control, recovery metrics snapshots and scenario comparisons.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class FleetMetricsResponse(BaseModel):
    total_buses: int = Field(..., description="Total buses registered on the route")
    buses_running: int = Field(..., description="Active non-holding buses in motion")
    buses_at_risk: int = Field(..., description="Buses in AT_RISK spacing condition")
    buses_severe_delay: int = Field(..., description="Buses in SEVERE_DELAY bunching condition")
    buses_bunching: int = Field(..., description="Buses currently classified as bunched")
    bunching_risk_count: int = Field(..., description="Sum of at-risk and severe delay buses")
    severe_bunching_count: int = Field(..., description="Count of severe delay bunching buses")
    average_risk_score: float = Field(..., description="Fleet-wide mean explainable risk score (0.00 to 1.00)")
    high_risk_bus_count: int = Field(..., description="Buses in HIGH risk tier")
    critical_risk_bus_count: int = Field(..., description="Buses in CRITICAL risk tier")


class PassengerMetricsResponse(BaseModel):
    total_passenger_arrivals: int = Field(..., description="Cumulative passenger arrivals across all stops")
    total_passengers_boarded: int = Field(..., description="Cumulative passengers boarded onto fleet buses")
    total_passenger_waiting_time_seconds: float = Field(..., description="Cumulative passenger-seconds waiting across all stops")
    average_passenger_waiting_time_seconds: Optional[float] = Field(
        None, description="Average waiting time per passenger across the network (seconds)"
    )


class ServiceMetricsResponse(BaseModel):
    headway_values: List[float] = Field(default_factory=list, description="Forward headway values for all buses (seconds)")
    average_headway_seconds: Optional[float] = Field(None, description="Fleet-wide mean headway (seconds)")
    headway_standard_deviation: Optional[float] = Field(None, description="Population standard deviation of headways (seconds)")
    headway_cov: Optional[float] = Field(
        None, description="Headway Coefficient of Variation (CoV) = std_dev / mean; lower means more regular"
    )
    total_delay_seconds: float = Field(..., description="Sum of accumulated schedule delays across all buses (seconds)")
    average_delay_seconds: Optional[float] = Field(None, description="Mean delay per bus (seconds)")
    on_time_buses: int = Field(..., description="Count of buses operating with delay <= 60 seconds")
    on_time_performance_percent: Optional[float] = Field(
        None, description="Percentage of fleet buses on schedule (delay <= 60s)"
    )


class ControlMetricsResponse(BaseModel):
    total_control_actions: int = Field(..., description="Total control actions recorded in history")
    approved_control_actions: int = Field(..., description="Count of operator-approved control actions")
    rejected_control_actions: int = Field(..., description="Count of operator-rejected recommendations")
    completed_control_actions: int = Field(..., description="Count of successfully executed and completed holds")
    active_control_actions: int = Field(..., description="Count of actions currently approved or holding")
    total_holding_time_seconds: float = Field(..., description="Total hold duration applied and executed (seconds)")
    average_hold_duration_seconds: Optional[float] = Field(
        None, description="Mean hold duration across executed interventions (seconds)"
    )


class RecoveryMetricsResponse(BaseModel):
    total_recovery_measurements: int = 0
    recovered_control_actions: int = 0
    timed_out_control_actions: int = 0
    average_recovery_time_seconds: Optional[float] = None
    fastest_recovery_time_seconds: Optional[float] = None
    slowest_recovery_time_seconds: Optional[float] = None


class MetricsSnapshotResponse(BaseModel):
    timestamp_simulation: float = Field(..., description="Simulation clock timestamp for this snapshot (seconds)")
    scenario_id: Optional[str] = Field(None, description="Associated scenario identifier if applicable")
    fleet: FleetMetricsResponse
    passenger: PassengerMetricsResponse
    service: ServiceMetricsResponse
    control: ControlMetricsResponse
    recovery: RecoveryMetricsResponse


class MetricComparisonItemResponse(BaseModel):
    metric_name: str = Field(..., description="Human-readable name of the operational metric")
    metric_key: str = Field(..., description="Identifier key for programmatic access")
    without_control: Optional[float] = Field(None, description="Value observed in baseline without control")
    with_busflow: Optional[float] = Field(None, description="Value observed with BUSFLOW control applied")
    change: Optional[float] = Field(None, description="Absolute change (with_busflow - without_control)")
    improvement_percentage: Optional[float] = Field(
        None, description="Percentage improvement achieved by BUSFLOW (%)"
    )
    lower_is_better: bool = Field(..., description="True if lower numeric value represents superior performance")
    interpretation: str = Field(..., description="Operational explanation of the metric and result")


class ScenarioComparisonResponse(BaseModel):
    scenario_name: str = Field(..., description="Descriptive title of the benchmark scenario")
    without_control: MetricsSnapshotResponse = Field(..., description="Snapshot results without control interventions")
    with_busflow: MetricsSnapshotResponse = Field(..., description="Snapshot results with BUSFLOW approved holds")
    comparison_metrics: List[MetricComparisonItemResponse] = Field(
        ..., description="Item-by-item comparative analysis across all key operational metrics"
    )
    summary: str = Field(..., description="Executive interpretation of the comparison")
