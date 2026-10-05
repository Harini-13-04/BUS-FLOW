from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
import copy

from app.simulation.route import Route, DEMO_ROUTE
from app.simulation.stop import Stop
from app.simulation.bus import (
    Bus,
    BusStatus,
    BUS_STORE,
    create_demo_fleet,
    get_all_buses,
    reset_bus_fleet,
)
from app.simulation.passenger import (
    StopPassengerState,
    PASSENGER_STORE,
    create_initial_passenger_states,
    get_all_passenger_states,
    get_passenger_state,
    advance_passenger_demand,
    reset_passenger_demand,
)
from app.simulation.traffic import (
    TrafficCondition,
    TrafficProfile,
    TRAFFIC_MANAGER,
    get_current_traffic,
    set_traffic_condition,
)
from app.simulation.incident import (
    Incident,
    IncidentStatus,
    IncidentType,
    IncidentSeverity,
    INCIDENT_STORE,
    get_all_incidents,
    reset_incident_store,
)
from app.control.headway import calculate_fleet_headways
from app.control.bunching import evaluate_fleet_bunching
from app.control.risk import calculate_fleet_risk
from app.control.controller import evaluate_fleet_control
from app.control.action import (
    ControlActionState,
    get_pending_approved_actions,
    get_action_by_id,
    reset_action_store,
)
from app.control.recovery import (
    start_recovery_tracking,
    evaluate_active_recovery_measurements,
    reset_recovery_store,
)


@dataclass
class SimulationConfig:
    route_id: str = "21G"
    number_of_buses: int = 5
    timestep_seconds: float = 5.0
    traffic_condition: str = TrafficCondition.NORMAL
    simulation_duration: float = 600.0


class SimulationEngine:
    def __init__(self, config: Optional[SimulationConfig] = None):
        self.config = config or SimulationConfig()
        self.running: bool = False
        self.simulation_time: float = 0.0
        self.timestep_seconds: float = self.config.timestep_seconds
        self.route: Route = DEMO_ROUTE
        # Initial headway and bunching evaluation
        calculate_fleet_headways(
            get_all_buses(),
            self.route.route_length,
            traffic_multiplier=get_current_traffic().speed_multiplier,
        )
        evaluate_fleet_bunching(get_all_buses())
        calculate_fleet_risk(
            get_all_buses(),
            traffic_condition=get_current_traffic().condition,
            stop_passenger_states={ps.stop_id: ps for ps in get_all_passenger_states()},
        )
        evaluate_fleet_control(
            get_all_buses(),
            traffic_condition=get_current_traffic().condition,
            stop_passenger_states={ps.stop_id: ps for ps in get_all_passenger_states()},
        )

    def start(self, config: Optional[SimulationConfig] = None) -> Dict[str, Any]:
        """Start or reinitialize simulation with configuration."""
        if config:
            self.config = config
            self.timestep_seconds = config.timestep_seconds
            set_traffic_condition(config.traffic_condition)
        self.simulation_time = 0.0
        self.running = True
        calculate_fleet_headways(
            get_all_buses(),
            self.route.route_length,
            traffic_multiplier=get_current_traffic().speed_multiplier,
        )
        evaluate_fleet_bunching(get_all_buses())
        calculate_fleet_risk(
            get_all_buses(),
            traffic_condition=get_current_traffic().condition,
            stop_passenger_states={ps.stop_id: ps for ps in get_all_passenger_states()},
        )
        evaluate_fleet_control(
            get_all_buses(),
            traffic_condition=get_current_traffic().condition,
            stop_passenger_states={ps.stop_id: ps for ps in get_all_passenger_states()},
        )
        return self.get_state()

    def reset(self) -> Dict[str, Any]:
        """Reset simulation clock, fleet, passenger demands, and incidents to deterministic initial state."""
        self.running = False
        self.simulation_time = 0.0
        self.timestep_seconds = self.config.timestep_seconds
        reset_bus_fleet()
        reset_passenger_demand()
        set_traffic_condition(self.config.traffic_condition)
        reset_incident_store()
        reset_action_store()
        reset_recovery_store()
        calculate_fleet_headways(
            get_all_buses(),
            self.route.route_length,
            traffic_multiplier=get_current_traffic().speed_multiplier,
        )
        evaluate_fleet_bunching(get_all_buses())
        calculate_fleet_risk(
            get_all_buses(),
            traffic_condition=self.config.traffic_condition,
            stop_passenger_states={ps.stop_id: ps for ps in get_all_passenger_states()},
        )
        evaluate_fleet_control(
            get_all_buses(),
            traffic_condition=self.config.traffic_condition,
            stop_passenger_states={ps.stop_id: ps for ps in get_all_passenger_states()},
        )
        return self.get_state()

    def step(self, dt: Optional[float] = None) -> Dict[str, Any]:
        """
        Advance the simulation by exactly one timestep.
        Deterministic pipeline:
        1. Advance simulation clock
        2. Process active incident lifecycles
        3. Advance passenger arrival demand & waiting time
        4. Apply pending approved control actions (start recovery tracking baseline)
        5. Calculate bus movement & stop arrivals/boarding / hold execution
        6. Recalculate two-sided headways across fleet
        7. Evaluate bunching status across fleet
        8. Calculate explainable risk scores across fleet
        9. Evaluate control recommendations across fleet
        10. Evaluate active recovery measurements (criteria satisfaction / timeout)
        """
        step_dt = dt if dt is not None else self.timestep_seconds
        if step_dt <= 0:
            return self.get_state()

        self.simulation_time += step_dt
        traffic_profile = get_current_traffic()
        speed_multiplier = traffic_profile.speed_multiplier
        route_length = self.route.route_length or 12000.0

        # 1. Update active incidents lifecycle
        active_incidents = [inc for inc in get_all_incidents() if inc.status == IncidentStatus.ACTIVE]
        for incident in active_incidents:
            if incident.start_time is None:
                incident.start_time = self.simulation_time - step_dt
            if self.simulation_time >= (incident.start_time + incident.duration):
                incident.resolve()

        # 2. Advance passenger demand across all stops
        advance_passenger_demand(step_dt)

        # 3. Apply any pending approved control actions & capture baseline recovery snapshot (Phase 10 & 11)
        pending_actions = get_pending_approved_actions()
        pstates = {ps.stop_id: ps for ps in get_all_passenger_states()}
        for action in pending_actions:
            target_bus = BUS_STORE.get(action.bus_id)
            if target_bus:
                action.state = ControlActionState.APPLIED
                action.applied_at_simulation_time = round(self.simulation_time, 2)
                target_bus.is_holding = True
                target_bus.hold_remaining_seconds = action.approved_hold_seconds
                target_bus.active_control_action_id = action.action_id

                # Start recovery measurement baseline tracking for this control action
                start_recovery_tracking(
                    action=action,
                    bus=target_bus,
                    simulation_time=self.simulation_time,
                    stop_passenger_states=pstates,
                    traffic_condition=traffic_profile.condition,
                )

        # 4. Process bus movement, holds, dwells, and incidents
        for bus in get_all_buses():
            # Check if this bus is affected by active incidents
            bus_incidents = [
                inc
                for inc in get_all_incidents()
                if inc.status == IncidentStatus.ACTIVE
                and (
                    inc.affected_bus == bus.bus_id
                    or (inc.affected_route == bus.route_id and inc.affected_bus is None)
                )
            ]

            is_stalled = False
            for inc in bus_incidents:
                if inc.type in [IncidentType.BUS_STALL, IncidentType.BUS_BREAKDOWN]:
                    is_stalled = True
                    break

            if is_stalled:
                # Bus is stalled: cannot move, delay accumulates
                bus.delay_seconds += step_dt
                bus.status = BusStatus.SEVERE_DELAY
                continue

            effective_dt = step_dt

            # Process active control HOLD timer if bus is currently held
            if bus.hold_remaining_seconds > 0:
                hold_consumed = min(effective_dt, bus.hold_remaining_seconds)
                bus.hold_remaining_seconds -= hold_consumed
                bus.delay_seconds += hold_consumed
                effective_dt -= hold_consumed

                if bus.hold_remaining_seconds <= 0:
                    bus.is_holding = False
                    bus.hold_remaining_seconds = 0.0
                    if bus.active_control_action_id:
                        action = get_action_by_id(bus.active_control_action_id)
                        if action and action.state == ControlActionState.APPLIED:
                            action.state = ControlActionState.COMPLETED
                            action.completed_at_simulation_time = round(self.simulation_time, 2)
                        bus.active_control_action_id = None

            # Process dwell time if bus is currently dwelling at a stop and effective_dt remains
            if effective_dt > 0 and bus.dwell_time_remaining > 0:
                dwell_step = min(effective_dt, bus.dwell_time_remaining)
                bus.dwell_time_remaining -= dwell_step
                bus.delay_seconds += dwell_step
                effective_dt -= dwell_step

            # If remaining time in this step, advance position
            if effective_dt > 0:
                # Speed conversion from km/h to m/s
                speed_mps = (bus.speed * 1000.0) / 3600.0
                effective_speed = speed_mps * speed_multiplier
                travel_distance = effective_speed * effective_dt

                old_pos = bus.position
                new_pos_raw = old_pos + travel_distance

                # Detect if any stop along the route was reached / passed
                stop_reached: Optional[Stop] = None
                for stop in self.route.stops:
                    stop_pos = stop.position
                    # Calculate distance ahead to stop position
                    dist_to_stop = (stop_pos - old_pos) % route_length
                    # If bus is exactly on stop and just served it, look ahead full circle
                    if dist_to_stop == 0.0 and bus.last_stop_served == stop.stop_id:
                        dist_to_stop = route_length

                    if dist_to_stop <= travel_distance:
                        # Found stop reached during this step
                        stop_reached = stop
                        break

                if stop_reached:
                    # Bus arrives at stop
                    bus.position = stop_reached.position
                    bus.current_stop = stop_reached.stop_id
                    bus.last_stop_served = stop_reached.stop_id

                    # Trigger boarding
                    pstate = get_passenger_state(stop_reached.stop_id)
                    if pstate:
                        avail_cap = max(0, bus.capacity - bus.passengers)
                        boarded, dwell = pstate.board(avail_cap)
                        bus.passengers += boarded
                        bus.dwell_time_remaining = dwell
                else:
                    # Bus moves between stops
                    bus.position = new_pos_raw % route_length
                    # If moved past previous stop position, clear last_stop_served restriction
                    curr_stop_candidate = self._get_nearest_passed_stop(bus.position)
                    if curr_stop_candidate:
                        bus.current_stop = curr_stop_candidate.stop_id
                    if bus.last_stop_served and bus.position != self._get_stop_pos(bus.last_stop_served):
                        bus.last_stop_served = None

        # 5. Recalculate fleet headways
        calculate_fleet_headways(
            get_all_buses(),
            route_length=route_length,
            traffic_multiplier=speed_multiplier,
        )

        # 6. Evaluate bunching detection across fleet
        evaluate_fleet_bunching(get_all_buses())

        # 7. Calculate explainable bunching risk scores across fleet
        updated_pstates = {ps.stop_id: ps for ps in get_all_passenger_states()}
        calculate_fleet_risk(
            get_all_buses(),
            traffic_condition=traffic_profile.condition,
            stop_passenger_states=updated_pstates,
        )

        # 8. Evaluate explainable control recommendations across fleet (RECOMMENDATION ONLY)
        evaluate_fleet_control(
            get_all_buses(),
            traffic_condition=traffic_profile.condition,
            stop_passenger_states=updated_pstates,
        )

        # 9. Evaluate active recovery measurements (Phase 11)
        evaluate_active_recovery_measurements(
            simulation_time=self.simulation_time,
            buses=get_all_buses(),
            stop_passenger_states=updated_pstates,
            traffic_condition=traffic_profile.condition,
        )

        return self.get_state()

    def run(self, steps: Optional[int] = None, duration_seconds: Optional[float] = None) -> Dict[str, Any]:
        """Run simulation for a requested number of steps or duration."""
        if steps is not None and steps > 0:
            total_steps = steps
        elif duration_seconds is not None and duration_seconds > 0:
            total_steps = max(1, int(round(duration_seconds / self.timestep_seconds)))
        else:
            total_steps = 1

        for _ in range(total_steps):
            self.step(self.timestep_seconds)

        return self.get_state()

    def get_state(self) -> Dict[str, Any]:
        """Generate current complete simulation state snapshot."""
        buses = get_all_buses()
        passenger_states = get_all_passenger_states()
        active_incidents = [
            inc.to_dict() for inc in get_all_incidents() if inc.status == IncidentStatus.ACTIVE
        ]

        total_waiting = sum(ps.waiting_passengers for ps in passenger_states)
        total_boarded = sum(ps.total_boarded for ps in passenger_states)
        total_waiting_time = sum(ps.total_waiting_time for ps in passenger_states)

        return {
            "running": self.running,
            "simulation_time": round(self.simulation_time, 2),
            "timestep_seconds": self.timestep_seconds,
            "route_id": self.route.route_id,
            "traffic_condition": get_current_traffic().condition,
            "active_incidents": active_incidents,
            "buses": [bus.to_dict() for bus in buses],
            "passenger_summary": {
                "total_waiting": total_waiting,
                "total_boarded": total_boarded,
                "total_waiting_time": round(total_waiting_time, 2),
            },
        }

    def _get_nearest_passed_stop(self, position: float) -> Optional[Stop]:
        """Find the most recently passed stop along the route loop."""
        sorted_stops = sorted(self.route.stops, key=lambda s: s.position)
        passed = [s for s in sorted_stops if s.position <= position]
        if passed:
            return passed[-1]
        return sorted_stops[-1] if sorted_stops else None

    def _get_stop_pos(self, stop_id: str) -> Optional[float]:
        for s in self.route.stops:
            if s.stop_id == stop_id:
                return s.position
        return None


# Global simulation engine instance
SIMULATION_ENGINE = SimulationEngine()
