from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Any
import time


class IncidentType:
    TRAFFIC_CONGESTION = "TRAFFIC_CONGESTION"
    BUS_BREAKDOWN = "BUS_BREAKDOWN"
    ROAD_BLOCKAGE = "ROAD_BLOCKAGE"
    PASSENGER_SURGE = "PASSENGER_SURGE"
    SIGNAL_DELAY = "SIGNAL_DELAY"
    BUS_STALL = "BUS_STALL"
    CUSTOM_DELAY = "CUSTOM_DELAY"

    @classmethod
    def all_types(cls) -> List[str]:
        return [
            cls.TRAFFIC_CONGESTION,
            cls.BUS_BREAKDOWN,
            cls.ROAD_BLOCKAGE,
            cls.PASSENGER_SURGE,
            cls.SIGNAL_DELAY,
            cls.BUS_STALL,
            cls.CUSTOM_DELAY,
        ]


class IncidentSeverity:
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

    @classmethod
    def all_severities(cls) -> List[str]:
        return [cls.LOW, cls.MEDIUM, cls.HIGH, cls.CRITICAL]


class IncidentStatus:
    CREATED = "CREATED"
    ACTIVE = "ACTIVE"
    RESOLVED = "RESOLVED"


@dataclass
class Incident:
    incident_id: str
    type: str
    severity: str
    duration: float
    delay_seconds: float
    affected_bus: Optional[str] = None
    affected_route: Optional[str] = None
    start_time: Optional[float] = None
    status: str = IncidentStatus.CREATED

    def activate(self, current_time: Optional[float] = None) -> "Incident":
        self.status = IncidentStatus.ACTIVE
        self.start_time = current_time if current_time is not None else 0.0
        return self

    def resolve(self) -> "Incident":
        self.status = IncidentStatus.RESOLVED
        return self

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class IncidentStore:
    def __init__(self):
        self._incidents: Dict[str, Incident] = {}
        self._counter: int = 0

    def generate_id(self) -> str:
        self._counter += 1
        return f"INC-{self._counter:03d}"

    def create(
        self,
        incident_type: str,
        severity: str,
        duration: float,
        delay_seconds: float,
        affected_bus: Optional[str] = None,
        affected_route: Optional[str] = None,
        incident_id: Optional[str] = None,
        auto_activate: bool = False,
        start_time: Optional[float] = None,
    ) -> Incident:
        if duration < 0:
            raise ValueError("Duration cannot be negative")
        if delay_seconds < 0:
            raise ValueError("Delay seconds cannot be negative")
        if incident_type not in IncidentType.all_types():
            raise ValueError(f"Invalid incident type '{incident_type}'. Allowed: {IncidentType.all_types()}")
        if severity not in IncidentSeverity.all_severities():
            raise ValueError(f"Invalid severity '{severity}'. Allowed: {IncidentSeverity.all_severities()}")

        inc_id = incident_id if incident_id else self.generate_id()
        if inc_id in self._incidents:
            raise ValueError(f"Incident with ID '{inc_id}' already exists")

        incident = Incident(
            incident_id=inc_id,
            type=incident_type,
            severity=severity,
            duration=duration,
            delay_seconds=delay_seconds,
            affected_bus=affected_bus,
            affected_route=affected_route,
            start_time=start_time if auto_activate else None,
            status=IncidentStatus.ACTIVE if auto_activate else IncidentStatus.CREATED,
        )
        self._incidents[inc_id] = incident
        return incident

    def get_all(self) -> List[Incident]:
        return list(self._incidents.values())

    def get_by_id(self, incident_id: str) -> Optional[Incident]:
        return self._incidents.get(incident_id)

    def activate(self, incident_id: str, current_time: Optional[float] = None) -> Incident:
        incident = self._incidents.get(incident_id)
        if not incident:
            raise KeyError(f"Incident '{incident_id}' not found")
        return incident.activate(current_time)

    def resolve(self, incident_id: str) -> Incident:
        incident = self._incidents.get(incident_id)
        if not incident:
            raise KeyError(f"Incident '{incident_id}' not found")
        return incident.resolve()

    def reset(self) -> None:
        self._incidents.clear()
        self._counter = 0


# Global in-memory incident store
INCIDENT_STORE = IncidentStore()


def get_all_incidents() -> List[Incident]:
    return INCIDENT_STORE.get_all()


def get_incident_by_id(incident_id: str) -> Optional[Incident]:
    return INCIDENT_STORE.get_by_id(incident_id)


def create_incident(
    incident_type: str,
    severity: str,
    duration: float,
    delay_seconds: float,
    affected_bus: Optional[str] = None,
    affected_route: Optional[str] = None,
    incident_id: Optional[str] = None,
    auto_activate: bool = False,
    start_time: Optional[float] = None,
) -> Incident:
    return INCIDENT_STORE.create(
        incident_type=incident_type,
        severity=severity,
        duration=duration,
        delay_seconds=delay_seconds,
        affected_bus=affected_bus,
        affected_route=affected_route,
        incident_id=incident_id,
        auto_activate=auto_activate,
        start_time=start_time,
    )


def activate_incident(incident_id: str, current_time: Optional[float] = None) -> Incident:
    return INCIDENT_STORE.activate(incident_id, current_time)


def resolve_incident(incident_id: str) -> Incident:
    return INCIDENT_STORE.resolve(incident_id)


def reset_incident_store() -> None:
    INCIDENT_STORE.reset()
