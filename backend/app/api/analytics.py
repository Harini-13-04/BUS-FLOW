"""
BUSFLOW — Phase 12: Operational Analytics API Router
Provides endpoints for real-time metrics snapshots and scenario comparisons (WITHOUT_CONTROL vs WITH_BUSFLOW).
"""

from fastapi import APIRouter, HTTPException, status, Query
from typing import Optional

from app.schemas.metrics import (
    MetricsSnapshotResponse,
    ScenarioComparisonResponse,
)
from app.simulation.engine import SIMULATION_ENGINE
from app.simulation.bus import get_all_buses
from app.simulation.passenger import get_all_passenger_states
from app.simulation.traffic import get_current_traffic
from app.control.action import get_all_actions
from app.control.recovery import get_all_recoveries
from app.metrics.metrics import (
    calculate_metrics_snapshot,
    calculate_scenario_comparison,
)

router = APIRouter(prefix="/api/analytics", tags=["Operational Analytics & Comparisons"])


@router.get("/summary", response_model=MetricsSnapshotResponse)
def get_operational_metrics_summary():
    """
    Retrieve real-time operational metrics snapshot (Fleet, Passenger, Service regularity, Control, Recovery).
    Calculated purely from live simulation state without side effects.
    """
    sim_time = SIMULATION_ENGINE.simulation_time
    buses = get_all_buses()
    pstates = get_all_passenger_states()
    actions = get_all_actions()
    recoveries = get_all_recoveries()
    traffic = get_current_traffic().condition

    snapshot = calculate_metrics_snapshot(
        simulation_time=sim_time,
        scenario_id="LIVE_SIMULATION",
        buses=buses,
        passenger_states=pstates,
        actions=actions,
        recoveries=recoveries,
        traffic_condition=traffic,
    )
    return snapshot.to_dict()


@router.get("/comparison", response_model=ScenarioComparisonResponse)
def get_scenario_comparison(
    scenario_name: Optional[str] = Query("B14 Stall Benchmark", description="Scenario name for comparison"),
    incident_duration: Optional[float] = Query(300.0, description="Stall duration in seconds"),
    hold_duration: Optional[float] = Query(20.0, description="Approved hold duration in seconds"),
    total_steps: Optional[int] = Query(80, description="Total simulation steps to evaluate"),
):
    """
    Executes a deterministic comparative evaluation between WITHOUT_CONTROL and WITH_BUSFLOW runs.
    Calculates metric deltas, improvement percentages, and human-readable executive interpretations.
    """
    comparison = calculate_scenario_comparison(
        scenario_name=scenario_name or "B14 Stall Benchmark",
        incident_duration_seconds=max(30.0, min(600.0, incident_duration or 300.0)),
        hold_duration_seconds=max(5.0, min(60.0, hold_duration or 20.0)),
        total_steps=max(20, min(200, total_steps or 80)),
    )
    return comparison.to_dict()
