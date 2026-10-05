from typing import List
from fastapi import APIRouter, HTTPException, status

from app.schemas.incident import IncidentCreateRequest, IncidentResponse
from app.simulation.incident import (
    create_incident,
    get_all_incidents,
    get_incident_by_id,
    activate_incident,
    resolve_incident,
)

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])


@router.post("", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
def post_create_incident(payload: IncidentCreateRequest):
    """Create a new deterministic incident."""
    try:
        incident = create_incident(
            incident_type=payload.type,
            severity=payload.severity,
            duration=payload.duration,
            delay_seconds=payload.delay_seconds,
            affected_bus=payload.affected_bus,
            affected_route=payload.affected_route,
            incident_id=payload.incident_id,
            auto_activate=payload.auto_activate,
        )
        return incident
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))


@router.get("", response_model=List[IncidentResponse])
def get_incidents():
    """List all incidents (both active, created, and resolved)."""
    return get_all_incidents()


@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(incident_id: str):
    """Retrieve details of a single incident by ID."""
    incident = get_incident_by_id(incident_id)
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident '{incident_id}' not found",
        )
    return incident


@router.post("/{incident_id}/activate", response_model=IncidentResponse)
def post_activate_incident(incident_id: str):
    """Activate an existing incident."""
    try:
        return activate_incident(incident_id)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident '{incident_id}' not found",
        )


@router.post("/{incident_id}/resolve", response_model=IncidentResponse)
def post_resolve_incident(incident_id: str):
    """Resolve an existing incident while preserving its record."""
    try:
        return resolve_incident(incident_id)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident '{incident_id}' not found",
        )
