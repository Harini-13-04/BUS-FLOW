from dataclasses import dataclass, field, asdict
from typing import Dict, List, Optional, Tuple, Any
from app.simulation.bus import BUS_STORE, Bus

# Boarding time model parameters
BASE_BOARDING_TIME_SECONDS: float = 5.0
TIME_PER_PASSENGER_SECONDS: float = 1.5


@dataclass
class StopPassengerState:
    stop_id: str
    waiting_passengers: int = 0
    arrival_rate: float = 0.20  # passengers per second
    total_arrivals: int = 0
    total_boarded: int = 0
    total_waiting_time: float = 0.0  # passenger-seconds accumulated
    arrival_accumulator: float = field(default=0.0, repr=False)

    def step(self, elapsed_seconds: float) -> int:
        """
        Advance passenger arrivals and accumulate waiting time over an elapsed time step.
        Uses a fractional accumulator to preserve deterministic fractional arrival counts.
        """
        if elapsed_seconds <= 0:
            return 0

        # Deterministic accumulation of arrivals
        raw_arrivals = (self.arrival_rate * elapsed_seconds) + self.arrival_accumulator
        new_arrivals = int(raw_arrivals)
        self.arrival_accumulator = raw_arrivals - new_arrivals

        self.waiting_passengers += new_arrivals
        self.total_arrivals += new_arrivals

        # Accumulate waiting time for all passengers waiting during this interval
        self.total_waiting_time += float(self.waiting_passengers * elapsed_seconds)

        return new_arrivals

    def board(self, available_capacity: int) -> Tuple[int, float]:
        """
        Board passengers onto a bus based on available capacity.
        Returns:
            Tuple[int, float]: (boarded_count, boarding_time_seconds)
        """
        if available_capacity <= 0 or self.waiting_passengers <= 0:
            return 0, 0.0

        boarded_count = min(self.waiting_passengers, available_capacity)
        self.waiting_passengers -= boarded_count
        self.total_boarded += boarded_count

        # Boarding time formula: base overhead + per passenger boarding time
        boarding_time = BASE_BOARDING_TIME_SECONDS + (boarded_count * TIME_PER_PASSENGER_SECONDS)
        return boarded_count, boarding_time

    def to_dict(self) -> Dict[str, Any]:
        return {
            "stop_id": self.stop_id,
            "waiting_passengers": self.waiting_passengers,
            "arrival_rate": self.arrival_rate,
            "total_arrivals": self.total_arrivals,
            "total_boarded": self.total_boarded,
            "total_waiting_time": round(self.total_waiting_time, 2),
        }


# Deterministic baseline passenger demand config for 12 stops (S01 to S12)
DEFAULT_STOP_DEMAND_CONFIG = [
    # (stop_id, initial_waiting, arrival_rate in pax/sec)
    ("S01", 15, 0.35),  # Central Station (High demand)
    ("S02", 8,  0.25),  # Market Square
    ("S03", 10, 0.20),  # University Ave
    ("S04", 6,  0.20),  # Tech Park
    ("S05", 5,  0.15),  # City Hospital
    ("S06", 3,  0.10),  # Greenfield Park
    ("S07", 4,  0.10),  # Riverfront
    ("S08", 12, 0.30),  # Commercial Street
    ("S09", 14, 0.25),  # North Hub
    ("S10", 9,  0.20),  # Civic Center
    ("S11", 6,  0.15),  # Harbor Point
    ("S12", 11, 0.30),  # South Terminal
]


def create_initial_passenger_states() -> Dict[str, StopPassengerState]:
    """Create deterministic initial passenger demand states for all 12 stops."""
    states: Dict[str, StopPassengerState] = {}
    for stop_id, initial_waiting, arrival_rate in DEFAULT_STOP_DEMAND_CONFIG:
        states[stop_id] = StopPassengerState(
            stop_id=stop_id,
            waiting_passengers=initial_waiting,
            arrival_rate=arrival_rate,
            total_arrivals=initial_waiting,
            total_boarded=0,
            total_waiting_time=0.0,
            arrival_accumulator=0.0,
        )
    return states


# In-memory store for passenger demand state per stop
PASSENGER_STORE: Dict[str, StopPassengerState] = create_initial_passenger_states()


def get_all_passenger_states() -> List[StopPassengerState]:
    """Retrieve all stop passenger states in deterministic order."""
    return list(PASSENGER_STORE.values())


def get_passenger_state(stop_id: str) -> Optional[StopPassengerState]:
    """Retrieve passenger state for a specific stop ID."""
    return PASSENGER_STORE.get(stop_id)


def advance_passenger_demand(elapsed_seconds: float = 1.0) -> Dict[str, int]:
    """
    Step passenger demand across all stops by elapsed_seconds.
    Returns mapping of stop_id to newly arrived passenger counts.
    """
    new_arrivals_per_stop: Dict[str, int] = {}
    for stop_id, state in PASSENGER_STORE.items():
        new_arrivals = state.step(elapsed_seconds)
        new_arrivals_per_stop[stop_id] = new_arrivals
    return new_arrivals_per_stop


def board_bus_at_stop(bus_id: str, stop_id: str) -> Dict[str, Any]:
    """
    Executes boarding for a specific bus arriving at a stop.
    Updates stop waiting counts, total boarded, bus passenger load,
    and returns detailed boarding metrics.
    """
    bus = BUS_STORE.get(bus_id)
    if not bus:
        raise ValueError(f"Bus '{bus_id}' not found")

    passenger_state = PASSENGER_STORE.get(stop_id)
    if not passenger_state:
        raise ValueError(f"Stop '{stop_id}' not found")

    available_capacity = max(0, bus.capacity - bus.passengers)
    boarded_count, boarding_time = passenger_state.board(available_capacity)

    # Update bus passenger load
    bus.passengers += boarded_count
    bus.current_stop = stop_id

    return {
        "bus_id": bus_id,
        "stop_id": stop_id,
        "boarded_passengers": boarded_count,
        "remaining_waiting": passenger_state.waiting_passengers,
        "bus_passenger_load": bus.passengers,
        "bus_capacity": bus.capacity,
        "boarding_time_seconds": round(boarding_time, 2),
    }


def reset_passenger_demand() -> None:
    """Reset passenger store back to clean deterministic initial state in-place."""
    PASSENGER_STORE.clear()
    PASSENGER_STORE.update(create_initial_passenger_states())
