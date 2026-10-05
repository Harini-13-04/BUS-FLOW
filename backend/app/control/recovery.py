"""
BUSFLOW — Phase 11: Recovery Measurement Engine
Measures service regularity recovery after approved control actions (HOLD).
Compares BEFORE_CONTROL vs AFTER_CONTROL operational states deterministically.
"""

from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Any

from app.control.bunching import (
    BusStatus,
    evaluate_bus_bunching,
    BunchingResult,
    NORMAL_THRESHOLD_RATIO,
)
from app.control.risk import (
    RiskLevel,
    calculate_bus_risk,
    RiskResult,
    calculate_fleet_risk,
)


class RecoveryState:
    NOT_STARTED = "NOT_STARTED"
    TRACKING = "TRACKING"
    RECOVERED = "RECOVERED"
    TIMEOUT = "TIMEOUT"


# Deterministic Recovery Criteria Constants
HEADWAY_RECOVERY_RATIO: float = 0.75        # headway_ahead >= 75% of desired_headway (259.2s for 345.6s)
BUNCHING_RECOVERY_STATUS: str = BusStatus.NORMAL
MAX_RECOVERY_RISK_SCORE: float = 0.50       # Risk level LOW or MEDIUM (< 0.50)
MAX_RECOVERY_TIME_SECONDS: float = 900.0    # 15-minute maximum observation window


@dataclass
class RecoverySnapshot:
    action_id: str
    bus_id: str
    simulation_time: float
    position: float
    headway_ahead: float
    headway_behind: float
    desired_headway: float
    bunching_status: str
    is_bunching: bool
    risk_score: float
    risk_level: str
    delay_seconds: float
    passenger_load: int
    passenger_capacity: int
    passenger_waiting_at_relevant_stop: Optional[int] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class RecoveryMeasurement:
    recovery_id: str
    action_id: str
    bus_id: str
    state: str
    started_at_simulation_time: float
    observation_window_seconds: float = MAX_RECOVERY_TIME_SECONDS
    recovered_at_simulation_time: Optional[float] = None
    recovery_time_seconds: Optional[float] = None
    hold_duration_seconds: float = 0.0

    # Before snapshot
    before_control: Optional[RecoverySnapshot] = None

    # After snapshot
    after_control: Optional[RecoverySnapshot] = None

    # Impact metrics
    headway_change_seconds: Optional[float] = None
    risk_change: Optional[float] = None
    delay_change_seconds: Optional[float] = None
    control_delay_added: float = 0.0
    risk_reduction_percentage: Optional[float] = None
    passenger_waiting_before: Optional[int] = None
    passenger_waiting_after: Optional[int] = None
    passenger_waiting_change: Optional[int] = None
    summary: str = ""

    # Convenience properties for flat access
    @property
    def before_headway_ahead(self) -> Optional[float]:
        return self.before_control.headway_ahead if self.before_control else None

    @property
    def before_headway_behind(self) -> Optional[float]:
        return self.before_control.headway_behind if self.before_control else None

    @property
    def before_desired_headway(self) -> Optional[float]:
        return self.before_control.desired_headway if self.before_control else None

    @property
    def before_risk_score(self) -> Optional[float]:
        return self.before_control.risk_score if self.before_control else None

    @property
    def before_risk_level(self) -> Optional[str]:
        return self.before_control.risk_level if self.before_control else None

    @property
    def before_bunching_status(self) -> Optional[str]:
        return self.before_control.bunching_status if self.before_control else None

    @property
    def before_delay_seconds(self) -> Optional[float]:
        return self.before_control.delay_seconds if self.before_control else None

    @property
    def before_passenger_load(self) -> Optional[int]:
        return self.before_control.passenger_load if self.before_control else None

    @property
    def after_headway_ahead(self) -> Optional[float]:
        return self.after_control.headway_ahead if self.after_control else None

    @property
    def after_headway_behind(self) -> Optional[float]:
        return self.after_control.headway_behind if self.after_control else None

    @property
    def after_risk_score(self) -> Optional[float]:
        return self.after_control.risk_score if self.after_control else None

    @property
    def after_risk_level(self) -> Optional[str]:
        return self.after_control.risk_level if self.after_control else None

    @property
    def after_bunching_status(self) -> Optional[str]:
        return self.after_control.bunching_status if self.after_control else None

    @property
    def after_delay_seconds(self) -> Optional[float]:
        return self.after_control.delay_seconds if self.after_control else None

    @property
    def after_passenger_load(self) -> Optional[int]:
        return self.after_control.passenger_load if self.after_control else None

    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        # Add flattened helper fields
        data.update({
            "before_headway_ahead": self.before_headway_ahead,
            "before_headway_behind": self.before_headway_behind,
            "before_desired_headway": self.before_desired_headway,
            "before_risk_score": self.before_risk_score,
            "before_risk_level": self.before_risk_level,
            "before_bunching_status": self.before_bunching_status,
            "before_delay_seconds": self.before_delay_seconds,
            "before_passenger_load": self.before_passenger_load,
            "after_headway_ahead": self.after_headway_ahead,
            "after_headway_behind": self.after_headway_behind,
            "after_risk_score": self.after_risk_score,
            "after_risk_level": self.after_risk_level,
            "after_bunching_status": self.after_bunching_status,
            "after_delay_seconds": self.after_delay_seconds,
            "after_passenger_load": self.after_passenger_load,
        })
        return data


# Global in-memory storage for recovery measurements
RECOVERY_STORE: Dict[str, RecoveryMeasurement] = {}


def start_recovery_tracking(
    action: Any,
    bus: Any,
    simulation_time: float,
    stop_passenger_states: Optional[Dict[str, Any]] = None,
    traffic_condition: Optional[str] = None,
) -> RecoveryMeasurement:
    """
    Initializes and records recovery tracking for an approved control action at the exact
    moment the action transitions to APPLIED. Captures the live baseline before_control snapshot.
    """
    bunching_res: BunchingResult = evaluate_bus_bunching(bus)

    waiting = None
    arr_rate = 0.20
    if stop_passenger_states and bus.current_stop in stop_passenger_states:
        pstate = stop_passenger_states[bus.current_stop]
        waiting = getattr(pstate, "waiting_passengers", 10)
        arr_rate = getattr(pstate, "arrival_rate", 0.20)

    risk_res: RiskResult = calculate_bus_risk(
        bus=bus,
        traffic_condition=traffic_condition,
        stop_waiting_passengers=waiting if waiting is not None else 10,
        stop_arrival_rate=arr_rate,
    )

    before_snapshot = RecoverySnapshot(
        action_id=action.action_id,
        bus_id=bus.bus_id,
        simulation_time=round(simulation_time, 2),
        position=round(bus.position, 1),
        headway_ahead=round(float(bus.headway_ahead or 0.0), 2),
        headway_behind=round(float(bus.headway_behind or 0.0), 2),
        desired_headway=round(float(bus.desired_headway or 345.6), 2),
        bunching_status=bunching_res.status,
        is_bunching=bunching_res.is_bunching,
        risk_score=round(risk_res.risk_score, 4),
        risk_level=risk_res.risk_level,
        delay_seconds=round(float(bus.delay_seconds), 2),
        passenger_load=int(bus.passengers),
        passenger_capacity=int(bus.capacity),
        passenger_waiting_at_relevant_stop=waiting,
    )

    measurement = RecoveryMeasurement(
        recovery_id=f"REC_{action.action_id}",
        action_id=action.action_id,
        bus_id=bus.bus_id,
        state=RecoveryState.TRACKING,
        started_at_simulation_time=round(simulation_time, 2),
        observation_window_seconds=MAX_RECOVERY_TIME_SECONDS,
        recovered_at_simulation_time=None,
        recovery_time_seconds=None,
        hold_duration_seconds=round(float(action.approved_hold_seconds), 1),
        before_control=before_snapshot,
        after_control=None,
        headway_change_seconds=None,
        risk_change=None,
        delay_change_seconds=None,
        control_delay_added=round(float(action.approved_hold_seconds), 1),
        risk_reduction_percentage=None,
        passenger_waiting_before=waiting,
        passenger_waiting_after=None,
        passenger_waiting_change=None,
        summary=f"Recovery tracking initiated for bus {bus.bus_id} at simulation time {simulation_time:.1f}s after approved {action.approved_hold_seconds:.1f}s hold. Monitoring service spacing recovery.",
    )

    RECOVERY_STORE[action.action_id] = measurement
    return measurement


def evaluate_active_recovery_measurements(
    simulation_time: float,
    buses: List[Any],
    stop_passenger_states: Optional[Dict[str, Any]] = None,
    traffic_condition: Optional[str] = None,
) -> List[RecoveryMeasurement]:
    """
    Evaluates all currently active (TRACKING) recovery measurements against deterministic
    recovery criteria and observation timeouts.

    Deterministic criteria:
    1. Headway: headway_ahead >= 0.75 * desired_headway
    2. Bunching: bunching_status == NORMAL (not is_bunching)
    3. Risk: risk_level in [LOW, MEDIUM] (risk_score < 0.50)
    """
    bus_map = {b.bus_id: b for b in buses}
    updated_measurements: List[RecoveryMeasurement] = []

    for measurement in list(RECOVERY_STORE.values()):
        if measurement.state != RecoveryState.TRACKING:
            continue

        bus = bus_map.get(measurement.bus_id)
        if not bus:
            continue

        elapsed = round(simulation_time - measurement.started_at_simulation_time, 2)
        bunching_res: BunchingResult = evaluate_bus_bunching(bus)

        waiting = None
        arr_rate = 0.20
        if stop_passenger_states and bus.current_stop in stop_passenger_states:
            pstate = stop_passenger_states[bus.current_stop]
            waiting = getattr(pstate, "waiting_passengers", 10)
            arr_rate = getattr(pstate, "arrival_rate", 0.20)

        risk_res: RiskResult = calculate_bus_risk(
            bus=bus,
            traffic_condition=traffic_condition,
            stop_waiting_passengers=waiting if waiting is not None else 10,
            stop_arrival_rate=arr_rate,
        )

        curr_hw_ahead = float(bus.headway_ahead or 0.0)
        desired_hw = float(bus.desired_headway or 345.6)
        min_headway_threshold = desired_hw * HEADWAY_RECOVERY_RATIO

        # Check explicit deterministic recovery criteria
        headway_recovered = curr_hw_ahead >= min_headway_threshold
        bunching_recovered = bunching_res.status == BusStatus.NORMAL and not bunching_res.is_bunching
        risk_recovered = risk_res.risk_level in [RiskLevel.LOW, RiskLevel.MEDIUM] and risk_res.risk_score < MAX_RECOVERY_RISK_SCORE

        is_recovered = headway_recovered and bunching_recovered and risk_recovered

        if is_recovered:
            # Recovery achieved
            measurement.state = RecoveryState.RECOVERED
            measurement.recovered_at_simulation_time = round(simulation_time, 2)
            measurement.recovery_time_seconds = round(elapsed, 2)

            after_snapshot = RecoverySnapshot(
                action_id=measurement.action_id,
                bus_id=bus.bus_id,
                simulation_time=round(simulation_time, 2),
                position=round(bus.position, 1),
                headway_ahead=round(curr_hw_ahead, 2),
                headway_behind=round(float(bus.headway_behind or 0.0), 2),
                desired_headway=round(desired_hw, 2),
                bunching_status=bunching_res.status,
                is_bunching=bunching_res.is_bunching,
                risk_score=round(risk_res.risk_score, 4),
                risk_level=risk_res.risk_level,
                delay_seconds=round(float(bus.delay_seconds), 2),
                passenger_load=int(bus.passengers),
                passenger_capacity=int(bus.capacity),
                passenger_waiting_at_relevant_stop=waiting,
            )
            measurement.after_control = after_snapshot

            # Calculate actual quantitative improvement metrics
            before = measurement.before_control
            if before:
                measurement.headway_change_seconds = round(after_snapshot.headway_ahead - before.headway_ahead, 2)
                measurement.risk_change = round(after_snapshot.risk_score - before.risk_score, 4)
                measurement.delay_change_seconds = round(after_snapshot.delay_seconds - before.delay_seconds, 2)
                measurement.passenger_waiting_after = waiting
                if before.passenger_waiting_at_relevant_stop is not None and waiting is not None:
                    measurement.passenger_waiting_change = waiting - before.passenger_waiting_at_relevant_stop

                if before.risk_score > 0:
                    pct = ((before.risk_score - after_snapshot.risk_score) / before.risk_score) * 100.0
                    measurement.risk_reduction_percentage = round(pct, 2)
                else:
                    measurement.risk_reduction_percentage = None

                hw_sign = "+" if measurement.headway_change_seconds >= 0 else ""
                r_sign = "+" if measurement.risk_change >= 0 else ""
                measurement.summary = (
                    f"Recovery achieved in {measurement.recovery_time_seconds:.1f}s. "
                    f"Forward headway changed from {before.headway_ahead:.1f}s to {after_snapshot.headway_ahead:.1f}s ({hw_sign}{measurement.headway_change_seconds:.1f}s), "
                    f"bunching status improved from {before.bunching_status} to {after_snapshot.bunching_status}, "
                    f"and risk changed from {before.risk_score:.2f} ({before.risk_level}) to {after_snapshot.risk_score:.2f} ({after_snapshot.risk_level}) ({r_sign}{measurement.risk_change:.4f}) "
                    f"after a {measurement.hold_duration_seconds:.1f}s approved hold."
                )

            updated_measurements.append(measurement)

        elif elapsed >= measurement.observation_window_seconds:
            # Maximum observation window elapsed without meeting criteria -> TIMEOUT
            measurement.state = RecoveryState.TIMEOUT
            measurement.recovered_at_simulation_time = None
            measurement.recovery_time_seconds = None

            after_snapshot = RecoverySnapshot(
                action_id=measurement.action_id,
                bus_id=bus.bus_id,
                simulation_time=round(simulation_time, 2),
                position=round(bus.position, 1),
                headway_ahead=round(curr_hw_ahead, 2),
                headway_behind=round(float(bus.headway_behind or 0.0), 2),
                desired_headway=round(desired_hw, 2),
                bunching_status=bunching_res.status,
                is_bunching=bunching_res.is_bunching,
                risk_score=round(risk_res.risk_score, 4),
                risk_level=risk_res.risk_level,
                delay_seconds=round(float(bus.delay_seconds), 2),
                passenger_load=int(bus.passengers),
                passenger_capacity=int(bus.capacity),
                passenger_waiting_at_relevant_stop=waiting,
            )
            measurement.after_control = after_snapshot

            before = measurement.before_control
            if before:
                measurement.headway_change_seconds = round(after_snapshot.headway_ahead - before.headway_ahead, 2)
                measurement.risk_change = round(after_snapshot.risk_score - before.risk_score, 4)
                measurement.delay_change_seconds = round(after_snapshot.delay_seconds - before.delay_seconds, 2)
                measurement.passenger_waiting_after = waiting
                if before.passenger_waiting_at_relevant_stop is not None and waiting is not None:
                    measurement.passenger_waiting_change = waiting - before.passenger_waiting_at_relevant_stop

                if before.risk_score > 0:
                    pct = ((before.risk_score - after_snapshot.risk_score) / before.risk_score) * 100.0
                    measurement.risk_reduction_percentage = round(pct, 2)
                else:
                    measurement.risk_reduction_percentage = None

            measurement.summary = (
                f"Recovery not achieved within the {measurement.observation_window_seconds:.0f}s observation window. "
                f"Bus {bus.bus_id} remained below acceptable regularity criteria (Headway: {curr_hw_ahead:.1f}s vs desired {desired_hw:.1f}s, "
                f"Bunching: {bunching_res.status}, Risk: {risk_res.risk_score:.2f} {risk_res.risk_level})."
            )
            updated_measurements.append(measurement)

    return updated_measurements


def get_all_recoveries() -> List[RecoveryMeasurement]:
    """Retrieve all recorded recovery measurements in deterministic order."""
    return list(RECOVERY_STORE.values())


def get_recovery_by_action_id(action_id: str) -> Optional[RecoveryMeasurement]:
    """Retrieve a single recovery measurement by its associated action ID."""
    return RECOVERY_STORE.get(action_id)


def get_recoveries_for_bus(bus_id: str) -> List[RecoveryMeasurement]:
    """Retrieve all recovery measurements for a specific bus."""
    return [rec for rec in RECOVERY_STORE.values() if rec.bus_id == bus_id]


def reset_recovery_store() -> None:
    """Reset the recovery measurement store to clean initial state."""
    RECOVERY_STORE.clear()
