from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Any, TYPE_CHECKING

if TYPE_CHECKING:
    from app.simulation.bus import Bus


class BusStatus:
    NORMAL = "NORMAL"
    AT_RISK = "AT_RISK"
    SEVERE_DELAY = "SEVERE_DELAY"


# Configurable transparent bunching thresholds relative to desired headway
NORMAL_THRESHOLD_RATIO: float = 0.75       # >= 75% of desired headway
AT_RISK_THRESHOLD_RATIO: float = 0.50      # 50% - 75% of desired headway
LARGE_REAR_GAP_RATIO: float = 1.25         # >= 125% of desired headway trailing gap


@dataclass
class BunchingResult:
    bus_id: str
    route_id: str
    status: str
    headway_ahead: float
    headway_behind: float
    desired_headway: float
    delay_seconds: float
    is_bunching: bool
    explanation: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def evaluate_bus_bunching(bus: Any) -> BunchingResult:
    """
    Evaluates bunching condition and headway irregularity for a single bus.
    Uses two-sided headway with desired_headway as the reference baseline.
    """
    hw_ahead = float(bus.headway_ahead) if getattr(bus, "headway_ahead", None) is not None else 0.0
    hw_behind = float(bus.headway_behind) if getattr(bus, "headway_behind", None) is not None else 0.0
    desired_hw = float(bus.desired_headway) if getattr(bus, "desired_headway", None) is not None else 345.6
    delay = float(bus.delay_seconds) if getattr(bus, "delay_seconds", None) is not None else 0.0

    # Edge case: non-positive desired headway
    if desired_hw <= 0:
        return BunchingResult(
            bus_id=bus.bus_id,
            route_id=bus.route_id,
            status=BusStatus.NORMAL,
            headway_ahead=hw_ahead,
            headway_behind=hw_behind,
            desired_headway=desired_hw,
            delay_seconds=delay,
            is_bunching=False,
            explanation="Single bus or unconfigured desired headway; spacing is nominal.",
        )

    ratio_ahead = hw_ahead / desired_hw
    ratio_behind = hw_behind / desired_hw

    # Primary Forward Headway Classification
    if ratio_ahead >= NORMAL_THRESHOLD_RATIO:
        # Normal headway ahead
        status = BusStatus.NORMAL
        is_bunching = False
        if delay > 120.0:
            explanation = (
                f"Headway ahead is within acceptable range ({hw_ahead:.1f}s vs desired {desired_hw:.1f}s). "
                f"Bus delay is {delay:.1f}s."
            )
        else:
            explanation = f"Headway ahead is within the acceptable range ({hw_ahead:.1f}s vs desired {desired_hw:.1f}s)."

    elif ratio_ahead >= AT_RISK_THRESHOLD_RATIO:
        # At-risk headway spacing
        status = BusStatus.AT_RISK
        is_bunching = False
        explanation = (
            f"Headway ahead is below the desired spacing ({hw_ahead:.1f}s vs desired {desired_hw:.1f}s, "
            f"{ratio_ahead * 100:.1f}%) and requires monitoring."
        )

    else:
        # Severe headway compression / bunching
        status = BusStatus.SEVERE_DELAY
        is_bunching = True
        explanation = (
            f"Headway ahead is significantly below the desired spacing ({hw_ahead:.1f}s vs desired {desired_hw:.1f}s, "
            f"{ratio_ahead * 100:.1f}%), indicating potential bus bunching."
        )

    # Secondary Two-Sided Awareness: Trailing Gap Context
    if ratio_behind >= LARGE_REAR_GAP_RATIO:
        explanation += (
            f" Large trailing gap behind ({hw_behind:.1f}s vs desired {desired_hw:.1f}s) "
            f"indicates spacing irregularity."
        )

    # Update the bus model's operational status
    bus.status = status

    return BunchingResult(
        bus_id=bus.bus_id,
        route_id=bus.route_id,
        status=status,
        headway_ahead=round(hw_ahead, 2),
        headway_behind=round(hw_behind, 2),
        desired_headway=round(desired_hw, 2),
        delay_seconds=round(delay, 2),
        is_bunching=is_bunching,
        explanation=explanation,
    )


def evaluate_fleet_bunching(buses: List[Any]) -> Dict[str, BunchingResult]:
    """
    Evaluates bunching conditions across the entire fleet in deterministic order.
    """
    results: Dict[str, BunchingResult] = {}
    for bus in buses:
        results[bus.bus_id] = evaluate_bus_bunching(bus)
    return results
