"""
BUSFLOW — Phase 8: Explainable Bunching Risk Score Engine
Deterministic, explainable operational risk assessment for bus bunching and headway disruptions.
"""

from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Any, Tuple

from app.control.bunching import (
    BusStatus,
    evaluate_bus_bunching,
    BunchingResult,
    NORMAL_THRESHOLD_RATIO,
    AT_RISK_THRESHOLD_RATIO,
    LARGE_REAR_GAP_RATIO,
)


class RiskLevel:
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


# Explicit, transparent, documented risk weights (Sum = 1.00)
WEIGHT_HEADWAY_COMPRESSION: float = 0.35
WEIGHT_REAR_GAP: float = 0.15
WEIGHT_DELAY: float = 0.15
WEIGHT_PASSENGER_LOAD: float = 0.15
WEIGHT_TRAFFIC: float = 0.10
WEIGHT_DEMAND_PRESSURE: float = 0.10

# Normalization Caps and Baseline Constants
MAX_DELAY_CAP_SECONDS: float = 300.0        # 5-minute cap for full delay risk saturation
MAX_DEMAND_CAP_PAX: float = 30.0            # 30-passenger predicted demand cap for full saturation
PREDICTION_HORIZON_SECONDS: float = 60.0    # 60-second lookahead for arrival demand pressure

# Risk Level Classification Thresholds
RISK_LEVEL_LOW_MAX: float = 0.25            # [0.00, 0.25) -> LOW
RISK_LEVEL_MEDIUM_MAX: float = 0.50         # [0.25, 0.50) -> MEDIUM
RISK_LEVEL_HIGH_MAX: float = 0.75           # [0.50, 0.75) -> HIGH
                                            # [0.75, 1.00] -> CRITICAL


@dataclass
class RiskComponents:
    headway_compression_risk: float
    rear_gap_risk: float
    delay_risk: float
    load_risk: float
    traffic_risk: float
    demand_risk: float

    def to_dict(self) -> Dict[str, float]:
        return asdict(self)


@dataclass
class RiskResult:
    bus_id: str
    route_id: str
    risk_score: float
    risk_level: str
    headway_ahead: float
    headway_behind: float
    desired_headway: float
    delay_seconds: float
    passengers: int
    capacity: int
    traffic_condition: str
    predicted_demand: float
    bunching_status: str
    is_bunching: bool
    explanation: str
    components: Optional[RiskComponents] = None

    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        if self.components:
            data["components"] = self.components.to_dict()
        return data


def normalize_headway_compression(headway_ahead: float, desired_headway: float) -> float:
    """
    Computes normalized forward headway compression risk in [0.0, 1.0].
    If headway_ahead >= desired_headway, risk is 0.0.
    As headway_ahead approaches 0.0, risk increases linearly to 1.0.
    """
    if desired_headway <= 0.0:
        return 0.0
    ratio = max(0.0, headway_ahead) / desired_headway
    if ratio >= 1.0:
        return 0.0
    return max(0.0, min(1.0, 1.0 - ratio))


def normalize_rear_gap_imbalance(headway_behind: float, desired_headway: float) -> float:
    """
    Computes normalized rear gap imbalance risk in [0.0, 1.0].
    If headway_behind <= desired_headway, risk is 0.0.
    As headway_behind exceeds desired_headway up to 2x desired_headway, risk scales to 1.0.
    """
    if desired_headway <= 0.0:
        return 0.0
    ratio = max(0.0, headway_behind) / desired_headway
    if ratio <= 1.0:
        return 0.0
    return max(0.0, min(1.0, ratio - 1.0))


def normalize_delay(delay_seconds: float, max_cap: float = MAX_DELAY_CAP_SECONDS) -> float:
    """
    Computes normalized delay risk in [0.0, 1.0].
    Scales delay up to max_cap seconds.
    """
    if max_cap <= 0.0:
        return 0.0
    return max(0.0, min(1.0, max(0.0, delay_seconds) / max_cap))


def normalize_passenger_load(passengers: int, capacity: int) -> float:
    """
    Computes normalized passenger load risk in [0.0, 1.0].
    Represents crowding and high boarding dwell vulnerability.
    """
    if capacity <= 0:
        return 0.0
    return max(0.0, min(1.0, max(0, passengers) / float(capacity)))


def normalize_traffic_condition(traffic_condition: str) -> float:
    """
    Maps discrete traffic condition to normalized traffic disruption risk:
    NORMAL -> 0.0, MODERATE -> 0.5, HEAVY -> 1.0.
    """
    condition_upper = (traffic_condition or "").upper()
    if condition_upper == "HEAVY":
        return 1.0
    elif condition_upper == "MODERATE":
        return 0.5
    return 0.0


def calculate_predicted_demand_pressure(
    stop_waiting_passengers: int = 0,
    stop_arrival_rate: float = 0.20,
    horizon_seconds: float = PREDICTION_HORIZON_SECONDS,
) -> float:
    """
    Deterministic simulation-based near-future demand pressure calculation.
    predicted_demand = current_waiting + (arrival_rate * horizon_seconds).
    """
    waiting = max(0, stop_waiting_passengers)
    arr_rate = max(0.0, stop_arrival_rate)
    horizon = max(0.0, horizon_seconds)
    return waiting + (arr_rate * horizon)


def normalize_predicted_demand(
    predicted_demand: float,
    max_cap: float = MAX_DEMAND_CAP_PAX,
) -> float:
    """
    Computes normalized demand pressure risk in [0.0, 1.0].
    """
    if max_cap <= 0.0:
        return 0.0
    return max(0.0, min(1.0, max(0.0, predicted_demand) / max_cap))


def determine_risk_level(risk_score: float) -> str:
    """
    Maps continuous risk score in [0.0, 1.0] to transparent categorical risk tier:
    [0.00, 0.25) -> LOW
    [0.25, 0.50) -> MEDIUM
    [0.50, 0.75) -> HIGH
    [0.75, 1.00] -> CRITICAL
    """
    if risk_score < RISK_LEVEL_LOW_MAX:
        return RiskLevel.LOW
    elif risk_score < RISK_LEVEL_MEDIUM_MAX:
        return RiskLevel.MEDIUM
    elif risk_score < RISK_LEVEL_HIGH_MAX:
        return RiskLevel.HIGH
    else:
        return RiskLevel.CRITICAL


def generate_risk_explanation(
    risk_score: float,
    risk_level: str,
    hw_ahead: float,
    hw_behind: float,
    desired_hw: float,
    delay: float,
    passengers: int,
    capacity: int,
    traffic_condition: str,
    predicted_demand: float,
    bunching_status: str,
    is_bunching: bool,
) -> str:
    """
    Generates a clear, transparent human-readable explanation of why the risk score exists,
    explicitly detailing contributing factors from observable simulation state.
    """
    reasons: List[str] = []

    # 1. Forward Headway
    ratio_ahead = (hw_ahead / desired_hw) if desired_hw > 0 else 1.0
    if is_bunching or ratio_ahead < AT_RISK_THRESHOLD_RATIO:
        reasons.append(
            f"Headway ahead is severely compressed ({hw_ahead:.1f}s vs desired {desired_hw:.1f}s, {ratio_ahead * 100:.1f}%), indicating active bus bunching."
        )
    elif ratio_ahead < NORMAL_THRESHOLD_RATIO:
        reasons.append(
            f"Headway ahead is below desired spacing ({hw_ahead:.1f}s vs desired {desired_hw:.1f}s, {ratio_ahead * 100:.1f}%), indicating emerging headway compression."
        )
    else:
        reasons.append(
            f"Headway ahead is nominal ({hw_ahead:.1f}s vs desired {desired_hw:.1f}s)."
        )

    # 2. Rear Gap Spacing
    ratio_behind = (hw_behind / desired_hw) if desired_hw > 0 else 1.0
    if ratio_behind >= LARGE_REAR_GAP_RATIO:
        reasons.append(
            f"Rear gap is significantly larger than desired ({hw_behind:.1f}s vs desired {desired_hw:.1f}s), leaving service void behind."
        )
    else:
        reasons.append(
            f"Rear gap spacing is balanced ({hw_behind:.1f}s vs desired {desired_hw:.1f}s)."
        )

    # 3. Delay
    if delay > 120.0:
        reasons.append(f"Significant cumulative schedule delay ({delay:.1f}s).")
    elif delay > 0.0:
        reasons.append(f"Minor schedule delay ({delay:.1f}s).")
    else:
        reasons.append("On-time schedule performance (0.0s delay).")

    # 4. Passenger Load
    load_pct = (passengers / capacity * 100.0) if capacity > 0 else 0.0
    reasons.append(f"Bus passenger load is {passengers}/{capacity} ({load_pct:.1f}%).")

    # 5. Traffic
    reasons.append(f"Traffic condition is {traffic_condition.upper()}.")

    # 6. Demand Pressure
    reasons.append(f"Predicted near-future demand pressure is {predicted_demand:.1f} passengers.")

    # 7. Operational Status
    reasons.append(f"Bunching operational status is {bunching_status}.")

    reasons_formatted = " ".join(reasons)
    return f"Risk Score: {risk_score:.2f} ({risk_level}). {reasons_formatted}"


def calculate_bus_risk(
    bus: Any,
    traffic_condition: Optional[str] = None,
    stop_waiting_passengers: Optional[int] = None,
    stop_arrival_rate: Optional[float] = None,
    predicted_demand_override: Optional[float] = None,
) -> RiskResult:
    """
    Calculates transparent, deterministic risk score for a single bus using observable simulation state.
    """
    # 1. Headway & bunching evaluation
    bunching_res: BunchingResult = evaluate_bus_bunching(bus)

    hw_ahead = float(bus.headway_ahead) if getattr(bus, "headway_ahead", None) is not None else 0.0
    hw_behind = float(bus.headway_behind) if getattr(bus, "headway_behind", None) is not None else 0.0
    desired_hw = float(bus.desired_headway) if getattr(bus, "desired_headway", None) is not None else 345.6
    delay = float(bus.delay_seconds) if getattr(bus, "delay_seconds", None) is not None else 0.0
    passengers = int(bus.passengers) if getattr(bus, "passengers", None) is not None else 0
    capacity = int(bus.capacity) if getattr(bus, "capacity", None) is not None else 70
    traffic = str(traffic_condition or "NORMAL")

    # 2. Predicted Demand Pressure
    if predicted_demand_override is not None:
        predicted_demand = float(predicted_demand_override)
    else:
        waiting = stop_waiting_passengers if stop_waiting_passengers is not None else 10
        arr_rate = stop_arrival_rate if stop_arrival_rate is not None else 0.20
        predicted_demand = calculate_predicted_demand_pressure(
            stop_waiting_passengers=waiting,
            stop_arrival_rate=arr_rate,
            horizon_seconds=PREDICTION_HORIZON_SECONDS,
        )

    # 3. Calculate Normalized Components [0.0, 1.0]
    c_headway = normalize_headway_compression(hw_ahead, desired_hw)
    c_rear_gap = normalize_rear_gap_imbalance(hw_behind, desired_hw)
    c_delay = normalize_delay(delay, MAX_DELAY_CAP_SECONDS)
    c_load = normalize_passenger_load(passengers, capacity)
    c_traffic = normalize_traffic_condition(traffic)
    c_demand = normalize_predicted_demand(predicted_demand, MAX_DEMAND_CAP_PAX)

    components = RiskComponents(
        headway_compression_risk=round(c_headway, 4),
        rear_gap_risk=round(c_rear_gap, 4),
        delay_risk=round(c_delay, 4),
        load_risk=round(c_load, 4),
        traffic_risk=round(c_traffic, 4),
        demand_risk=round(c_demand, 4),
    )

    # 4. Weighted Risk Sum
    raw_risk = (
        (WEIGHT_HEADWAY_COMPRESSION * c_headway)
        + (WEIGHT_REAR_GAP * c_rear_gap)
        + (WEIGHT_DELAY * c_delay)
        + (WEIGHT_PASSENGER_LOAD * c_load)
        + (WEIGHT_TRAFFIC * c_traffic)
        + (WEIGHT_DEMAND_PRESSURE * c_demand)
    )

    # Clamp final risk to [0.0, 1.0]
    risk_score = max(0.0, min(1.0, raw_risk))
    risk_level = determine_risk_level(risk_score)

    # 5. Generate transparent explanation
    explanation = generate_risk_explanation(
        risk_score=risk_score,
        risk_level=risk_level,
        hw_ahead=hw_ahead,
        hw_behind=hw_behind,
        desired_hw=desired_hw,
        delay=delay,
        passengers=passengers,
        capacity=capacity,
        traffic_condition=traffic,
        predicted_demand=predicted_demand,
        bunching_status=bunching_res.status,
        is_bunching=bunching_res.is_bunching,
    )

    return RiskResult(
        bus_id=bus.bus_id,
        route_id=bus.route_id,
        risk_score=round(risk_score, 4),
        risk_level=risk_level,
        headway_ahead=round(hw_ahead, 2),
        headway_behind=round(hw_behind, 2),
        desired_headway=round(desired_hw, 2),
        delay_seconds=round(delay, 2),
        passengers=passengers,
        capacity=capacity,
        traffic_condition=traffic.upper(),
        predicted_demand=round(predicted_demand, 2),
        bunching_status=bunching_res.status,
        is_bunching=bunching_res.is_bunching,
        explanation=explanation,
        components=components,
    )


def calculate_fleet_risk(
    buses: List[Any],
    traffic_condition: Optional[str] = None,
    stop_passenger_states: Optional[Dict[str, Any]] = None,
) -> Dict[str, RiskResult]:
    """
    Calculates deterministic risk scores and explanations across the entire fleet.
    """
    results: Dict[str, RiskResult] = {}
    for bus in buses:
        # Determine demand context from the bus's current stop if available
        waiting = 10
        arr_rate = 0.20
        if stop_passenger_states and bus.current_stop in stop_passenger_states:
            pstate = stop_passenger_states[bus.current_stop]
            waiting = getattr(pstate, "waiting_passengers", 10)
            arr_rate = getattr(pstate, "arrival_rate", 0.20)

        results[bus.bus_id] = calculate_bus_risk(
            bus=bus,
            traffic_condition=traffic_condition,
            stop_waiting_passengers=waiting,
            stop_arrival_rate=arr_rate,
        )
    return results
