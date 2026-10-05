"""
BUSFLOW — Phase 9: Explainable Control Decision Engine
Deterministic, explainable headway control recommendation engine.
Recommends HOLD or NO_HOLD decisions with bounded hold durations and transparent reasoning.
"""

from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Any

from app.control.bunching import (
    BusStatus,
    evaluate_bus_bunching,
    BunchingResult,
    NORMAL_THRESHOLD_RATIO,
    AT_RISK_THRESHOLD_RATIO,
)
from app.control.risk import (
    RiskLevel,
    RiskResult,
    calculate_bus_risk,
)


class ControlDecision:
    HOLD = "HOLD"
    NO_HOLD = "NO_HOLD"


# Configurable Controller & Safety Thresholds
MAX_HOLD_SECONDS: float = 60.0                 # Hard safety ceiling for hold duration
MIN_HOLD_SECONDS: float = 5.0                  # Minimum practical hold intervention threshold
PROPORTIONAL_CORRECTION_RATE: float = 0.12     # Proportional deficit correction rate (12% of deficit)

# Safety Rule Thresholds
MAX_DELAY_FOR_HOLD_SECONDS: float = 120.0      # Buses delayed >= 120s receive NO_HOLD (Rule 1: Late bus safety)
MAX_LOAD_RATIO_FOR_HOLD: float = 0.85          # Buses at >= 85% capacity receive NO_HOLD (Rule 2: Crowding safety)
MIN_REAR_GAP_RATIO: float = 0.60               # Trailing gap must be >= 60% desired headway to permit HOLD (Rule 6)
MIN_DEFICIT_RATIO_FOR_HOLD: float = 0.25       # Forward headway must be compressed by at least 25% (headway_ahead <= 75% desired)


@dataclass
class ControlRecommendation:
    bus_id: str
    route_id: str
    decision: str
    recommended_hold_seconds: float
    headway_ahead: float
    headway_behind: float
    desired_headway: float
    passenger_load: int
    capacity: int
    delay_seconds: float
    risk_score: float
    risk_level: str
    bunching_status: str
    predicted_demand: float
    traffic_condition: str
    reason: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def calculate_hold_factors(
    headway_behind: float,
    desired_headway: float,
    delay_seconds: float,
    passengers: int,
    capacity: int,
    traffic_condition: str,
    predicted_demand: float,
) -> Dict[str, float]:
    """
    Computes deterministic safety discount factors for hold duration calculation.
    """
    # 1. Rear gap scaling factor (larger rear gap permits stronger hold up to 1.2x)
    rear_ratio = (headway_behind / desired_headway) if desired_headway > 0 else 1.0
    f_rear = min(1.20, max(0.50, rear_ratio))

    # 2. Delay safety penalty factor (higher delay linearly reduces hold duration)
    f_delay = max(0.0, 1.0 - (max(0.0, delay_seconds) / MAX_DELAY_FOR_HOLD_SECONDS))

    # 3. Passenger load safety factor (crowded buses receive reduced hold duration)
    load_ratio = (passengers / float(capacity)) if capacity > 0 else 0.0
    f_load = max(0.20, 1.0 - (0.80 * min(1.0, max(0.0, load_ratio))))

    # 4. Traffic condition penalty factor (congested traffic warrants conservative holding)
    traffic_upper = (traffic_condition or "NORMAL").upper()
    if traffic_upper == "HEAVY":
        f_traffic = 0.50
    elif traffic_upper == "MODERATE":
        f_traffic = 0.75
    else:
        f_traffic = 1.00

    # 5. Demand pressure safety factor (higher waiting demand reduces dwell/holding)
    f_demand = max(0.50, 1.0 - (min(60.0, max(0.0, predicted_demand)) / 120.0))

    return {
        "f_rear": f_rear,
        "f_delay": f_delay,
        "f_load": f_load,
        "f_traffic": f_traffic,
        "f_demand": f_demand,
    }


def evaluate_bus_control(
    bus: Any,
    traffic_condition: Optional[str] = None,
    stop_waiting_passengers: Optional[int] = None,
    stop_arrival_rate: Optional[float] = None,
    risk_result_override: Optional[RiskResult] = None,
) -> ControlRecommendation:
    """
    Evaluates explainable control decision (HOLD vs NO_HOLD) and calculates
    recommended hold seconds for a single bus using observable simulation state.
    """
    # 1. Reuse existing Risk calculation (which consumes headway and bunching)
    if risk_result_override is not None:
        risk_res = risk_result_override
    else:
        risk_res = calculate_bus_risk(
            bus=bus,
            traffic_condition=traffic_condition,
            stop_waiting_passengers=stop_waiting_passengers,
            stop_arrival_rate=stop_arrival_rate,
        )

    hw_ahead = risk_res.headway_ahead
    hw_behind = risk_res.headway_behind
    desired_hw = risk_res.desired_headway
    delay = risk_res.delay_seconds
    passengers = risk_res.passengers
    capacity = risk_res.capacity
    traffic = risk_res.traffic_condition
    predicted_demand = risk_res.predicted_demand
    bunching_status = risk_res.bunching_status
    risk_score = risk_res.risk_score
    risk_level = risk_res.risk_level

    # Headway deficit calculation
    headway_deficit = max(0.0, desired_hw - hw_ahead)
    ratio_ahead = (hw_ahead / desired_hw) if desired_hw > 0 else 1.0
    ratio_behind = (hw_behind / desired_hw) if desired_hw > 0 else 1.0
    load_ratio = (passengers / float(capacity)) if capacity > 0 else 0.0

    # Safety Rule Checks & Decision Logic

    # Check 1: Nominal forward spacing (no bunching / no headway compression)
    if ratio_ahead >= NORMAL_THRESHOLD_RATIO or headway_deficit <= 0:
        return ControlRecommendation(
            bus_id=bus.bus_id,
            route_id=bus.route_id,
            decision=ControlDecision.NO_HOLD,
            recommended_hold_seconds=0.0,
            headway_ahead=hw_ahead,
            headway_behind=hw_behind,
            desired_headway=desired_hw,
            passenger_load=passengers,
            capacity=capacity,
            delay_seconds=delay,
            risk_score=risk_score,
            risk_level=risk_level,
            bunching_status=bunching_status,
            predicted_demand=predicted_demand,
            traffic_condition=traffic,
            reason=(
                f"NO_HOLD because forward headway is nominal ({hw_ahead:.1f}s vs desired {desired_hw:.1f}s). "
                f"No headway compression or bunching detected."
            ),
        )

    # Check 2: Late bus safety rule (Rule 1)
    if delay >= MAX_DELAY_FOR_HOLD_SECONDS:
        return ControlRecommendation(
            bus_id=bus.bus_id,
            route_id=bus.route_id,
            decision=ControlDecision.NO_HOLD,
            recommended_hold_seconds=0.0,
            headway_ahead=hw_ahead,
            headway_behind=hw_behind,
            desired_headway=desired_hw,
            passenger_load=passengers,
            capacity=capacity,
            delay_seconds=delay,
            risk_score=risk_score,
            risk_level=risk_level,
            bunching_status=bunching_status,
            predicted_demand=predicted_demand,
            traffic_condition=traffic,
            reason=(
                f"NO_HOLD because the bus is already {delay:.1f}s late (exceeds {MAX_DELAY_FOR_HOLD_SECONDS:.0f}s threshold). "
                f"Additional holding would compound passenger schedule delay."
            ),
        )

    # Check 3: Passenger crowding safety rule (Rule 2)
    if load_ratio >= MAX_LOAD_RATIO_FOR_HOLD:
        return ControlRecommendation(
            bus_id=bus.bus_id,
            route_id=bus.route_id,
            decision=ControlDecision.NO_HOLD,
            recommended_hold_seconds=0.0,
            headway_ahead=hw_ahead,
            headway_behind=hw_behind,
            desired_headway=desired_hw,
            passenger_load=passengers,
            capacity=capacity,
            delay_seconds=delay,
            risk_score=risk_score,
            risk_level=risk_level,
            bunching_status=bunching_status,
            predicted_demand=predicted_demand,
            traffic_condition=traffic,
            reason=(
                f"NO_HOLD because bus passenger load is very high ({passengers}/{capacity}, {load_ratio * 100:.1f}%). "
                f"Holding a heavily loaded vehicle creates excessive on-board passenger delay."
            ),
        )

    # Check 4: Small rear gap safety rule (Rule 6)
    if ratio_behind < MIN_REAR_GAP_RATIO:
        return ControlRecommendation(
            bus_id=bus.bus_id,
            route_id=bus.route_id,
            decision=ControlDecision.NO_HOLD,
            recommended_hold_seconds=0.0,
            headway_ahead=hw_ahead,
            headway_behind=hw_behind,
            desired_headway=desired_hw,
            passenger_load=passengers,
            capacity=capacity,
            delay_seconds=delay,
            risk_score=risk_score,
            risk_level=risk_level,
            bunching_status=bunching_status,
            predicted_demand=predicted_demand,
            traffic_condition=traffic,
            reason=(
                f"NO_HOLD because trailing bus is already close behind ({hw_behind:.1f}s vs desired {desired_hw:.1f}s, {ratio_behind * 100:.1f}%). "
                f"Holding would induce secondary bunching behind this vehicle."
            ),
        )

    # If all safety prerequisites pass, compute bounded corrective hold duration
    factors = calculate_hold_factors(
        headway_behind=hw_behind,
        desired_headway=desired_hw,
        delay_seconds=delay,
        passengers=passengers,
        capacity=capacity,
        traffic_condition=traffic,
        predicted_demand=predicted_demand,
    )

    safety_multiplier = (
        factors["f_rear"]
        * factors["f_delay"]
        * factors["f_load"]
        * factors["f_traffic"]
        * factors["f_demand"]
    )

    raw_hold = headway_deficit * PROPORTIONAL_CORRECTION_RATE * safety_multiplier

    # Check 5: Minimum intervention threshold (Rule 7)
    if raw_hold < MIN_HOLD_SECONDS:
        return ControlRecommendation(
            bus_id=bus.bus_id,
            route_id=bus.route_id,
            decision=ControlDecision.NO_HOLD,
            recommended_hold_seconds=0.0,
            headway_ahead=hw_ahead,
            headway_behind=hw_behind,
            desired_headway=desired_hw,
            passenger_load=passengers,
            capacity=capacity,
            delay_seconds=delay,
            risk_score=risk_score,
            risk_level=risk_level,
            bunching_status=bunching_status,
            predicted_demand=predicted_demand,
            traffic_condition=traffic,
            reason=(
                f"NO_HOLD because required corrective hold ({raw_hold:.1f}s) is below minimum practical intervention threshold ({MIN_HOLD_SECONDS:.0f}s)."
            ),
        )

    # Bounded hold clamping [0, MAX_HOLD_SECONDS] (Rule 8)
    bounded_hold = round(max(0.0, min(MAX_HOLD_SECONDS, raw_hold)), 1)

    reason = (
        f"HOLD recommended for {bounded_hold:.1f}s. "
        f"Forward headway is compressed ({hw_ahead:.1f}s vs desired {desired_hw:.1f}s, deficit {headway_deficit:.1f}s) with bunching status {bunching_status} and risk score {risk_score:.2f} ({risk_level}). "
        f"Rear gap of {hw_behind:.1f}s provides sufficient trailing buffer. "
        f"Passenger load ({passengers}/{capacity}) and schedule delay ({delay:.1f}s) are within safe operational bounds."
    )

    return ControlRecommendation(
        bus_id=bus.bus_id,
        route_id=bus.route_id,
        decision=ControlDecision.HOLD,
        recommended_hold_seconds=bounded_hold,
        headway_ahead=hw_ahead,
        headway_behind=hw_behind,
        desired_headway=desired_hw,
        passenger_load=passengers,
        capacity=capacity,
        delay_seconds=delay,
        risk_score=risk_score,
        risk_level=risk_level,
        bunching_status=bunching_status,
        predicted_demand=predicted_demand,
        traffic_condition=traffic,
        reason=reason,
    )


def evaluate_fleet_control(
    buses: List[Any],
    traffic_condition: Optional[str] = None,
    stop_passenger_states: Optional[Dict[str, Any]] = None,
    fleet_risk_results: Optional[Dict[str, RiskResult]] = None,
) -> Dict[str, ControlRecommendation]:
    """
    Evaluates explainable control recommendations across the fleet in deterministic order.
    """
    results: Dict[str, ControlRecommendation] = {}
    for bus in buses:
        waiting = 10
        arr_rate = 0.20
        if stop_passenger_states and bus.current_stop in stop_passenger_states:
            pstate = stop_passenger_states[bus.current_stop]
            waiting = getattr(pstate, "waiting_passengers", 10)
            arr_rate = getattr(pstate, "arrival_rate", 0.20)

        risk_override = fleet_risk_results.get(bus.bus_id) if fleet_risk_results else None

        results[bus.bus_id] = evaluate_bus_control(
            bus=bus,
            traffic_condition=traffic_condition,
            stop_waiting_passengers=waiting,
            stop_arrival_rate=arr_rate,
            risk_result_override=risk_override,
        )
    return results
