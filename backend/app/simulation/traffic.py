from dataclasses import dataclass, asdict
from typing import Dict, Any


class TrafficCondition:
    NORMAL = "NORMAL"
    MODERATE = "MODERATE"
    HEAVY = "HEAVY"


@dataclass
class TrafficProfile:
    condition: str
    speed_multiplier: float
    delay_multiplier: float
    description: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


TRAFFIC_PROFILES: Dict[str, TrafficProfile] = {
    TrafficCondition.NORMAL: TrafficProfile(
        condition=TrafficCondition.NORMAL,
        speed_multiplier=1.0,
        delay_multiplier=1.0,
        description="Free flow traffic conditions, standard operating speeds",
    ),
    TrafficCondition.MODERATE: TrafficProfile(
        condition=TrafficCondition.MODERATE,
        speed_multiplier=0.75,
        delay_multiplier=1.35,
        description="Moderate traffic congestion, slight travel delays",
    ),
    TrafficCondition.HEAVY: TrafficProfile(
        condition=TrafficCondition.HEAVY,
        speed_multiplier=0.50,
        delay_multiplier=2.00,
        description="Heavy traffic congestion, severe speed reduction and significant delays",
    ),
}


class TrafficManager:
    def __init__(self, initial_condition: str = TrafficCondition.NORMAL):
        self._current_condition = initial_condition

    @property
    def current_condition(self) -> str:
        return self._current_condition

    @property
    def current_profile(self) -> TrafficProfile:
        return TRAFFIC_PROFILES.get(self._current_condition, TRAFFIC_PROFILES[TrafficCondition.NORMAL])

    def set_condition(self, condition: str) -> TrafficProfile:
        if condition not in TRAFFIC_PROFILES:
            raise ValueError(f"Invalid traffic condition '{condition}'. Allowed: {list(TRAFFIC_PROFILES.keys())}")
        self._current_condition = condition
        return self.current_profile

    def reset(self) -> None:
        self._current_condition = TrafficCondition.NORMAL


# Global in-memory traffic manager instance
TRAFFIC_MANAGER = TrafficManager()


def get_current_traffic() -> TrafficProfile:
    """Retrieve the current traffic profile."""
    return TRAFFIC_MANAGER.current_profile


def set_traffic_condition(condition: str) -> TrafficProfile:
    """Update the active traffic condition."""
    return TRAFFIC_MANAGER.set_condition(condition)
