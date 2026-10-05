"""
BUSFLOW — Phase 10: Control Action Lifecycle & Storage
Tracks operator approvals, rejections, manual holds, and execution states.
"""

from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Any


class ControlActionState:
    RECOMMENDED = "RECOMMENDED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    APPLIED = "APPLIED"
    COMPLETED = "COMPLETED"


class OperatorActionType:
    RECOMMENDATION_APPROVAL = "RECOMMENDATION_APPROVAL"
    RECOMMENDATION_REJECTION = "RECOMMENDATION_REJECTION"
    MANUAL = "MANUAL"


@dataclass
class ControlAction:
    action_id: str
    bus_id: str
    route_id: str
    decision: str
    requested_hold_seconds: float
    approved_hold_seconds: float
    state: str
    created_at_simulation_time: float
    approved_at_simulation_time: Optional[float] = None
    applied_at_simulation_time: Optional[float] = None
    completed_at_simulation_time: Optional[float] = None
    reason: str = ""
    operator_action: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


# Global in-memory storage for control action history
ACTION_STORE: Dict[str, ControlAction] = {}
_ACTION_COUNTER: int = 0


def create_control_action(
    bus_id: str,
    route_id: str,
    decision: str,
    requested_hold_seconds: float,
    approved_hold_seconds: float,
    state: str,
    simulation_time: float,
    reason: str = "",
    operator_action: Optional[str] = None,
    action_id: Optional[str] = None,
) -> ControlAction:
    """
    Creates and records a new control action in the in-memory store.
    """
    global _ACTION_COUNTER
    _ACTION_COUNTER += 1

    if not action_id:
        action_id = f"ACT_{bus_id}_{int(simulation_time)}_{_ACTION_COUNTER}"

    approved_time = simulation_time if state == ControlActionState.APPROVED else None

    action = ControlAction(
        action_id=action_id,
        bus_id=bus_id,
        route_id=route_id,
        decision=decision,
        requested_hold_seconds=round(max(0.0, requested_hold_seconds), 1),
        approved_hold_seconds=round(max(0.0, approved_hold_seconds), 1),
        state=state,
        created_at_simulation_time=round(simulation_time, 2),
        approved_at_simulation_time=round(approved_time, 2) if approved_time is not None else None,
        applied_at_simulation_time=None,
        completed_at_simulation_time=None,
        reason=reason,
        operator_action=operator_action,
    )

    ACTION_STORE[action_id] = action
    return action


def get_all_actions() -> List[ControlAction]:
    """Retrieve all recorded control actions in deterministic order."""
    return list(ACTION_STORE.values())


def get_action_by_id(action_id: str) -> Optional[ControlAction]:
    """Retrieve a single control action by its unique identifier."""
    return ACTION_STORE.get(action_id)


def get_active_action_for_bus(bus_id: str) -> Optional[ControlAction]:
    """
    Find an active action for a bus (either APPROVED pending application or APPLIED currently executing).
    """
    for action in reversed(list(ACTION_STORE.values())):
        if action.bus_id == bus_id and action.state in [ControlActionState.APPROVED, ControlActionState.APPLIED]:
            return action
    return None


def get_pending_approved_actions() -> List[ControlAction]:
    """
    Retrieve all actions in APPROVED state ready to be applied by the simulation.
    """
    return [act for act in ACTION_STORE.values() if act.state == ControlActionState.APPROVED]


def reset_action_store() -> None:
    """Reset the control action history store to clean initial state."""
    global _ACTION_COUNTER
    ACTION_STORE.clear()
    _ACTION_COUNTER = 0
