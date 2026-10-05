from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Tuple, Any, TYPE_CHECKING

if TYPE_CHECKING:
    from app.simulation.bus import Bus


@dataclass
class HeadwayResult:
    bus_id: str
    route_id: str
    bus_ahead_id: Optional[str]
    bus_behind_id: Optional[str]
    distance_ahead: Optional[float]
    distance_behind: Optional[float]
    headway_ahead: Optional[float]  # in seconds
    headway_behind: Optional[float]  # in seconds
    desired_headway: float  # in seconds

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def circular_forward_distance(from_pos: float, to_pos: float, route_length: float = 12000.0) -> float:
    """
    Computes forward circular distance along the loop from from_pos to to_pos.
    Handles wrapping across 12,000m -> 0m boundary.
    """
    if from_pos == to_pos:
        return 0.0
    return (to_pos - from_pos) % route_length


def circular_backward_distance(from_pos: float, to_pos: float, route_length: float = 12000.0) -> float:
    """
    Computes backward circular distance along the loop from from_pos to to_pos.
    """
    if from_pos == to_pos:
        return 0.0
    return (from_pos - to_pos) % route_length


def calculate_desired_headway(
    route_length: float = 12000.0,
    number_of_buses: int = 5,
    nominal_speed_kmh: float = 25.0,
) -> float:
    """
    Computes deterministic desired headway in seconds for equal vehicle spacing:
    desired_headway = route_cycle_time / number_of_buses
    """
    if number_of_buses <= 0:
        return 0.0
    nominal_speed_mps = (nominal_speed_kmh * 1000.0) / 3600.0
    if nominal_speed_mps <= 0:
        return 0.0
    cycle_time_seconds = route_length / nominal_speed_mps
    return round(cycle_time_seconds / number_of_buses, 2)


def calculate_fleet_headways(
    buses: List[Any],
    route_length: float = 12000.0,
    nominal_speed_kmh: float = 25.0,
    traffic_multiplier: float = 1.0,
) -> Dict[str, HeadwayResult]:
    """
    Calculates two-sided headways (gap_ahead, gap_behind, desired_headway)
    for all buses operating on the route.

    Conversion from distance to time headway uses the active operating speed
    with safe positive bounds to prevent division by zero.
    """
    results: Dict[str, HeadwayResult] = {}
    if not buses:
        return results

    # Group buses by route
    routes_map: Dict[str, List[Any]] = {}
    for bus in buses:
        routes_map.setdefault(bus.route_id, []).append(bus)

    for route_id, route_buses in routes_map.items():
        n_buses = len(route_buses)
        desired_hw = calculate_desired_headway(
            route_length=route_length,
            number_of_buses=n_buses,
            nominal_speed_kmh=nominal_speed_kmh,
        )

        # Reference speed in m/s with non-zero fallback
        effective_speed_kmh = max(5.0, nominal_speed_kmh * max(0.1, traffic_multiplier))
        ref_speed_mps = (effective_speed_kmh * 1000.0) / 3600.0

        if n_buses == 1:
            # Single bus on route: no distinct ahead/behind bus
            single_bus = route_buses[0]
            single_bus.headway_ahead = desired_hw
            single_bus.headway_behind = desired_hw
            single_bus.desired_headway = desired_hw
            results[single_bus.bus_id] = HeadwayResult(
                bus_id=single_bus.bus_id,
                route_id=route_id,
                bus_ahead_id=None,
                bus_behind_id=None,
                distance_ahead=None,
                distance_behind=None,
                headway_ahead=desired_hw,
                headway_behind=desired_hw,
                desired_headway=desired_hw,
            )
            continue

        # Two or more buses on route
        for current_bus in route_buses:
            other_buses = [b for b in route_buses if b.bus_id != current_bus.bus_id]

            # Find closest bus ahead along circular loop
            best_ahead_bus: Optional[Any] = None
            min_dist_ahead: float = float("inf")

            for candidate in other_buses:
                d_ahead = circular_forward_distance(
                    from_pos=current_bus.position,
                    to_pos=candidate.position,
                    route_length=route_length,
                )
                if d_ahead < min_dist_ahead:
                    min_dist_ahead = d_ahead
                    best_ahead_bus = candidate

            # Find closest bus behind along circular loop
            best_behind_bus: Optional[Any] = None
            min_dist_behind: float = float("inf")

            for candidate in other_buses:
                d_behind = circular_backward_distance(
                    from_pos=current_bus.position,
                    to_pos=candidate.position,
                    route_length=route_length,
                )
                if d_behind < min_dist_behind:
                    min_dist_behind = d_behind
                    best_behind_bus = candidate

            # Convert distance gap to time headway (seconds)
            hw_ahead_sec = round(min_dist_ahead / ref_speed_mps, 2) if min_dist_ahead != float("inf") else 0.0
            hw_behind_sec = round(min_dist_behind / ref_speed_mps, 2) if min_dist_behind != float("inf") else 0.0

            # Update bus model fields
            current_bus.headway_ahead = hw_ahead_sec
            current_bus.headway_behind = hw_behind_sec
            current_bus.desired_headway = desired_hw

            results[current_bus.bus_id] = HeadwayResult(
                bus_id=current_bus.bus_id,
                route_id=route_id,
                bus_ahead_id=best_ahead_bus.bus_id if best_ahead_bus else None,
                bus_behind_id=best_behind_bus.bus_id if best_behind_bus else None,
                distance_ahead=round(min_dist_ahead, 2) if min_dist_ahead != float("inf") else None,
                distance_behind=round(min_dist_behind, 2) if min_dist_behind != float("inf") else None,
                headway_ahead=hw_ahead_sec,
                headway_behind=hw_behind_sec,
                desired_headway=desired_hw,
            )

    return results
