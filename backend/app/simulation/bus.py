from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Any, Union


class BusStatus:
    NORMAL = "NORMAL"
    AT_RISK = "AT_RISK"
    SEVERE_DELAY = "SEVERE_DELAY"


@dataclass
class Bus:
    bus_id: str
    route_id: str
    current_stop: str
    position: float
    direction: Union[int, str]
    speed: float
    delay_seconds: float
    passengers: int
    capacity: int
    status: str = BusStatus.NORMAL
    headway_ahead: Optional[float] = 0.0
    headway_behind: Optional[float] = 0.0
    desired_headway: Optional[float] = 345.6
    dwell_time_remaining: float = 0.0
    last_stop_served: Optional[str] = None
    is_holding: bool = False
    hold_remaining_seconds: float = 0.0
    active_control_action_id: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def create_demo_fleet() -> Dict[str, Bus]:
    """
    Creates deterministic initial fleet of 5 demo buses operating on route 21G,
    distributed along the route.
    """
    fleet = [
        Bus(
            bus_id="B14",
            route_id="21G",
            current_stop="S08",
            position=7000.0,
            direction=1,
            speed=25.0,
            delay_seconds=0.0,
            passengers=47,
            capacity=70,
            status=BusStatus.NORMAL,
            headway_ahead=144.0,
            headway_behind=1152.0,
            desired_headway=345.6,
            dwell_time_remaining=0.0,
            last_stop_served="S08",
        ),
        Bus(
            bus_id="B15",
            route_id="21G",
            current_stop="S09",
            position=8000.0,
            direction=1,
            speed=24.0,
            delay_seconds=0.0,
            passengers=32,
            capacity=70,
            status=BusStatus.NORMAL,
            headway_ahead=144.0,
            headway_behind=144.0,
            desired_headway=345.6,
            dwell_time_remaining=0.0,
            last_stop_served="S09",
        ),
        Bus(
            bus_id="B16",
            route_id="21G",
            current_stop="S10",
            position=9000.0,
            direction=1,
            speed=22.0,
            delay_seconds=0.0,
            passengers=41,
            capacity=70,
            status=BusStatus.NORMAL,
            headway_ahead=144.0,
            headway_behind=144.0,
            desired_headway=345.6,
            dwell_time_remaining=0.0,
            last_stop_served="S10",
        ),
        Bus(
            bus_id="B17",
            route_id="21G",
            current_stop="S11",
            position=10000.0,
            direction=1,
            speed=26.0,
            delay_seconds=0.0,
            passengers=28,
            capacity=70,
            status=BusStatus.NORMAL,
            headway_ahead=144.0,
            headway_behind=144.0,
            desired_headway=345.6,
            dwell_time_remaining=0.0,
            last_stop_served="S11",
        ),
        Bus(
            bus_id="B18",
            route_id="21G",
            current_stop="S12",
            position=11000.0,
            direction=1,
            speed=25.0,
            delay_seconds=0.0,
            passengers=35,
            capacity=70,
            status=BusStatus.NORMAL,
            headway_ahead=1152.0,
            headway_behind=144.0,
            desired_headway=345.6,
            dwell_time_remaining=0.0,
            last_stop_served="S12",
        ),
    ]
    return {bus.bus_id: bus for bus in fleet}


# In-memory store initialized at import/startup
BUS_STORE: Dict[str, Bus] = create_demo_fleet()


def get_all_buses() -> List[Bus]:
    """Return all current buses in deterministic order."""
    return list(BUS_STORE.values())


def get_bus_by_id(bus_id: str) -> Optional[Bus]:
    """Return a single bus by ID or None if not found."""
    return BUS_STORE.get(bus_id)


def reset_bus_fleet() -> None:
    """Reset bus fleet in-place back to initial deterministic positions and loads."""
    BUS_STORE.clear()
    BUS_STORE.update(create_demo_fleet())
