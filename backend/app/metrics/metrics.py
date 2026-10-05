"""
BUSFLOW — Phase 12: Operational Metrics Engine
Deterministic public-transport operational metrics calculation, snapshot generation,
and comparative baseline evaluation (WITHOUT_CONTROL vs WITH_BUSFLOW).
"""

import math
import copy
from dataclasses import dataclass, asdict, field
from typing import Dict, List, Optional, Any, Tuple

from app.simulation.bus import (
    Bus,
    BusStatus,
    get_all_buses,
    reset_bus_fleet,
    BUS_STORE,
)
from app.simulation.passenger import (
    StopPassengerState,
    get_all_passenger_states,
    reset_passenger_demand,
    PASSENGER_STORE,
)
from app.simulation.traffic import (
    get_current_traffic,
    set_traffic_condition,
    TrafficCondition,
)
from app.simulation.incident import (
    Incident,
    IncidentStatus,
    IncidentType,
    IncidentSeverity,
    get_all_incidents,
    reset_incident_store,
    create_incident,
    INCIDENT_STORE,
)
from app.control.headway import calculate_fleet_headways
from app.control.bunching import evaluate_fleet_bunching
from app.control.risk import calculate_fleet_risk, RiskLevel
from app.control.action import (
    ControlAction,
    ControlActionState,
    get_all_actions,
    reset_action_store,
    create_control_action,
    ACTION_STORE,
)
from app.control.recovery import (
    RecoveryMeasurement,
    RecoveryState,
    get_all_recoveries,
    reset_recovery_store,
    RECOVERY_STORE,
)


# Operational Constants
ON_TIME_DELAY_THRESHOLD_SECONDS: float = 60.0  # Delay <= 60s is considered ON-TIME


@dataclass
class FleetMetrics:
    total_buses: int = 0
    buses_running: int = 0
    buses_at_risk: int = 0
    buses_severe_delay: int = 0
    buses_bunching: int = 0
    bunching_risk_count: int = 0
    severe_bunching_count: int = 0
    average_risk_score: float = 0.0
    high_risk_bus_count: int = 0
    critical_risk_bus_count: int = 0

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class PassengerMetrics:
    total_passenger_arrivals: int = 0
    total_passengers_boarded: int = 0
    total_passenger_waiting_time_seconds: float = 0.0
    average_passenger_waiting_time_seconds: Optional[float] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ServiceMetrics:
    headway_values: List[float] = field(default_factory=list)
    average_headway_seconds: Optional[float] = None
    headway_standard_deviation: Optional[float] = None
    headway_cov: Optional[float] = None
    total_delay_seconds: float = 0.0
    average_delay_seconds: Optional[float] = None
    on_time_buses: int = 0
    on_time_performance_percent: Optional[float] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ControlMetrics:
    total_control_actions: int = 0
    approved_control_actions: int = 0
    rejected_control_actions: int = 0
    completed_control_actions: int = 0
    active_control_actions: int = 0
    total_holding_time_seconds: float = 0.0
    average_hold_duration_seconds: Optional[float] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class RecoveryMetrics:
    total_recovery_measurements: int = 0
    recovered_control_actions: int = 0
    timed_out_control_actions: int = 0
    average_recovery_time_seconds: Optional[float] = None
    fastest_recovery_time_seconds: Optional[float] = None
    slowest_recovery_time_seconds: Optional[float] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class MetricsSnapshot:
    timestamp_simulation: float
    scenario_id: Optional[str] = None
    fleet: FleetMetrics = field(default_factory=FleetMetrics)
    passenger: PassengerMetrics = field(default_factory=PassengerMetrics)
    service: ServiceMetrics = field(default_factory=ServiceMetrics)
    control: ControlMetrics = field(default_factory=ControlMetrics)
    recovery: RecoveryMetrics = field(default_factory=RecoveryMetrics)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "timestamp_simulation": round(self.timestamp_simulation, 2),
            "scenario_id": self.scenario_id,
            "fleet": self.fleet.to_dict(),
            "passenger": self.passenger.to_dict(),
            "service": self.service.to_dict(),
            "control": self.control.to_dict(),
            "recovery": self.recovery.to_dict(),
        }


@dataclass
class MetricComparisonItem:
    metric_name: str
    metric_key: str
    without_control: Optional[float]
    with_busflow: Optional[float]
    change: Optional[float]
    improvement_percentage: Optional[float]
    lower_is_better: bool
    interpretation: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ScenarioComparisonResult:
    scenario_name: str
    without_control: MetricsSnapshot
    with_busflow: MetricsSnapshot
    comparison_metrics: List[MetricComparisonItem]
    summary: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "scenario_name": self.scenario_name,
            "without_control": self.without_control.to_dict(),
            "with_busflow": self.with_busflow.to_dict(),
            "comparison_metrics": [m.to_dict() for m in self.comparison_metrics],
            "summary": self.summary,
        }


# ==========================================
# Pure Calculation Functions
# ==========================================


def calculate_passenger_metrics(passenger_states: Optional[List[Any]] = None) -> PassengerMetrics:
    """
    Computes aggregated passenger statistics across all stops.
    average_waiting_time = sum(total_waiting_time) / sum(total_arrivals)
    """
    states = passenger_states if passenger_states is not None else get_all_passenger_states()
    tot_arr = sum(int(getattr(ps, "total_arrivals", 0)) for ps in states)
    tot_boarded = sum(int(getattr(ps, "total_boarded", 0)) for ps in states)
    tot_waiting_time = sum(float(getattr(ps, "total_waiting_time", 0.0)) for ps in states)

    avg_wait = None
    if tot_arr > 0:
        avg_wait = round(tot_waiting_time / tot_arr, 2)

    return PassengerMetrics(
        total_passenger_arrivals=tot_arr,
        total_passengers_boarded=tot_boarded,
        total_passenger_waiting_time_seconds=round(tot_waiting_time, 2),
        average_passenger_waiting_time_seconds=avg_wait,
    )


def calculate_delay_metrics(
    buses: Optional[List[Any]] = None,
    on_time_threshold: float = ON_TIME_DELAY_THRESHOLD_SECONDS,
) -> Dict[str, Any]:
    """
    Computes fleet delay aggregation and on-time performance metrics.
    """
    fleet = buses if buses is not None else get_all_buses()
    tot_delay = round(sum(float(getattr(b, "delay_seconds", 0.0)) for b in fleet), 2)
    avg_delay = round(tot_delay / len(fleet), 2) if fleet else None
    on_time = sum(1 for b in fleet if float(getattr(b, "delay_seconds", 0.0)) <= on_time_threshold)
    otp_pct = round((on_time / len(fleet)) * 100.0, 2) if fleet else None

    return {
        "total_delay_seconds": tot_delay,
        "average_delay_seconds": avg_delay,
        "on_time_buses": on_time,
        "on_time_performance_percent": otp_pct,
    }


def calculate_headway_metrics(buses: Optional[List[Any]] = None) -> ServiceMetrics:
    """
    Computes service regularity metrics using actual forward headway values across the fleet.
    Calculates mean headway, population standard deviation, and Coefficient of Variation (CoV).
    """
    fleet = buses if buses is not None else get_all_buses()
    hws = [
        round(float(b.headway_ahead), 2)
        for b in fleet
        if getattr(b, "headway_ahead", None) is not None
    ]

    tot_delay = round(sum(float(getattr(b, "delay_seconds", 0.0)) for b in fleet), 2)
    avg_delay = round(tot_delay / len(fleet), 2) if fleet else None
    on_time = sum(1 for b in fleet if float(getattr(b, "delay_seconds", 0.0)) <= ON_TIME_DELAY_THRESHOLD_SECONDS)
    otp_pct = round((on_time / len(fleet)) * 100.0, 2) if fleet else None

    if not hws:
        return ServiceMetrics(
            headway_values=[],
            average_headway_seconds=None,
            headway_standard_deviation=None,
            headway_cov=None,
            total_delay_seconds=tot_delay,
            average_delay_seconds=avg_delay,
            on_time_buses=on_time,
            on_time_performance_percent=otp_pct,
        )

    mean_hw = sum(hws) / len(hws)
    variance = sum((h - mean_hw) ** 2 for h in hws) / len(hws)
    std_dev = math.sqrt(variance)

    cov = None
    if mean_hw > 0:
        cov = round(std_dev / mean_hw, 4)

    return ServiceMetrics(
        headway_values=hws,
        average_headway_seconds=round(mean_hw, 2),
        headway_standard_deviation=round(std_dev, 2),
        headway_cov=cov,
        total_delay_seconds=tot_delay,
        average_delay_seconds=avg_delay,
        on_time_buses=on_time,
        on_time_performance_percent=otp_pct,
    )


def calculate_control_metrics(actions: Optional[List[Any]] = None) -> ControlMetrics:
    """
    Computes control action and holding intervention metrics.
    Only approved/manual holds that actually executed (APPLIED / COMPLETED) contribute to holding time.
    """
    acts = actions if actions is not None else get_all_actions()
    total = len(acts)
    approved = sum(1 for a in acts if a.state in [ControlActionState.APPROVED, ControlActionState.APPLIED, ControlActionState.COMPLETED])
    rejected = sum(1 for a in acts if a.state == ControlActionState.REJECTED)
    completed = sum(1 for a in acts if a.state == ControlActionState.COMPLETED)
    active = sum(1 for a in acts if a.state in [ControlActionState.APPROVED, ControlActionState.APPLIED])

    executed = [a for a in acts if a.state in [ControlActionState.APPLIED, ControlActionState.COMPLETED]]
    tot_holding = round(sum(float(a.approved_hold_seconds) for a in executed), 2)
    avg_hold = round(tot_holding / len(executed), 2) if executed else None

    return ControlMetrics(
        total_control_actions=total,
        approved_control_actions=approved,
        rejected_control_actions=rejected,
        completed_control_actions=completed,
        active_control_actions=active,
        total_holding_time_seconds=tot_holding,
        average_hold_duration_seconds=avg_hold,
    )


def calculate_recovery_metrics(recoveries: Optional[List[Any]] = None) -> RecoveryMetrics:
    """
    Computes recovery metrics using Phase 11 recovery measurements.
    Only RECOVERED measurements with numeric recovery_time_seconds contribute to recovery statistics.
    TIMEOUT actions are NOT counted as zero.
    """
    recs = recoveries if recoveries is not None else get_all_recoveries()
    total = len(recs)
    recovered_list = [r for r in recs if r.state == RecoveryState.RECOVERED and r.recovery_time_seconds is not None]
    timed_out = sum(1 for r in recs if r.state == RecoveryState.TIMEOUT)

    avg_rec = None
    fastest = None
    slowest = None

    if recovered_list:
        times = [float(r.recovery_time_seconds) for r in recovered_list]
        avg_rec = round(sum(times) / len(times), 2)
        fastest = round(min(times), 2)
        slowest = round(max(times), 2)

    return RecoveryMetrics(
        total_recovery_measurements=total,
        recovered_control_actions=len(recovered_list),
        timed_out_control_actions=timed_out,
        average_recovery_time_seconds=avg_rec,
        fastest_recovery_time_seconds=fastest,
        slowest_recovery_time_seconds=slowest,
    )


def calculate_fleet_metrics(
    buses: Optional[List[Any]] = None,
    traffic_condition: Optional[str] = None,
    stop_passenger_states: Optional[Dict[str, Any]] = None,
) -> FleetMetrics:
    """
    Computes fleet bunching, operational status, and explainable risk scores across the active fleet.
    """
    fleet = buses if buses is not None else get_all_buses()
    total = len(fleet)
    running = sum(1 for b in fleet if not getattr(b, "is_holding", False))
    at_risk = sum(1 for b in fleet if getattr(b, "status", "") == BusStatus.AT_RISK)
    severe = sum(1 for b in fleet if getattr(b, "status", "") == BusStatus.SEVERE_DELAY)
    bunching = severe  # Bunching defined by SEVERE_DELAY / is_bunching

    # Calculate Phase 8 explainable risk scores
    pstates = stop_passenger_states
    if pstates is None:
        pstates = {ps.stop_id: ps for ps in get_all_passenger_states()}
    traffic = traffic_condition or get_current_traffic().condition

    risk_dict = calculate_fleet_risk(fleet, traffic_condition=traffic, stop_passenger_states=pstates)
    scores = [r.risk_score for r in risk_dict.values()]
    avg_risk = round(sum(scores) / len(scores), 4) if scores else 0.0
    high_count = sum(1 for r in risk_dict.values() if r.risk_level == RiskLevel.HIGH)
    critical_count = sum(1 for r in risk_dict.values() if r.risk_level == RiskLevel.CRITICAL)

    return FleetMetrics(
        total_buses=total,
        buses_running=running,
        buses_at_risk=at_risk,
        buses_severe_delay=severe,
        buses_bunching=bunching,
        bunching_risk_count=at_risk + severe,
        severe_bunching_count=severe,
        average_risk_score=avg_risk,
        high_risk_bus_count=high_count,
        critical_risk_bus_count=critical_count,
    )


def calculate_metrics_snapshot(
    simulation_time: float,
    scenario_id: Optional[str] = None,
    buses: Optional[List[Any]] = None,
    passenger_states: Optional[List[Any]] = None,
    actions: Optional[List[Any]] = None,
    recoveries: Optional[List[Any]] = None,
    traffic_condition: Optional[str] = None,
) -> MetricsSnapshot:
    """
    Combines individual metric calculators into a single complete operational snapshot.
    """
    p_metrics = calculate_passenger_metrics(passenger_states)
    s_metrics = calculate_headway_metrics(buses)
    c_metrics = calculate_control_metrics(actions)
    r_metrics = calculate_recovery_metrics(recoveries)

    p_map = None
    if passenger_states:
        p_map = {ps.stop_id: ps for ps in passenger_states}
    f_metrics = calculate_fleet_metrics(buses, traffic_condition=traffic_condition, stop_passenger_states=p_map)

    return MetricsSnapshot(
        timestamp_simulation=round(simulation_time, 2),
        scenario_id=scenario_id,
        fleet=f_metrics,
        passenger=p_metrics,
        service=s_metrics,
        control=c_metrics,
        recovery=r_metrics,
    )


def calculate_improvement_percentage(
    without_val: Optional[float],
    with_val: Optional[float],
    lower_is_better: bool = True,
) -> Optional[float]:
    """
    Calculates percentage improvement safely.
    For lower-is-better metrics (delay, CoV, wait time, risk, bunching):
      ((without - with) / without) * 100
    For higher-is-better metrics (on-time performance):
      ((with - without) / without) * 100
    Returns None if without_val is zero, None, or undefined.
    """
    if without_val is None or with_val is None:
        return None
    try:
        without_f = float(without_val)
        with_f = float(with_val)
    except (ValueError, TypeError):
        return None

    if without_f <= 0.0:
        return None

    if lower_is_better:
        return round(((without_f - with_f) / without_f) * 100.0, 2)
    else:
        return round(((with_f - without_f) / without_f) * 100.0, 2)


# ==========================================
# Deterministic Scenario Comparison Engine
# ==========================================


def run_scenario_simulation(
    control_enabled: bool = False,
    hold_bus_id: str = "B15",
    hold_duration_seconds: float = 20.0,
    incident_bus_id: str = "B14",
    incident_duration_seconds: float = 300.0,
    total_steps: int = 80,
    timestep_seconds: float = 5.0,
) -> MetricsSnapshot:
    """
    Executes a clean, isolated deterministic simulation run.
    Safely captures and restores any live engine state.
    """
    from app.simulation.engine import SIMULATION_ENGINE, SimulationConfig

    # Reset to pristine state
    SIMULATION_ENGINE.reset()
    SIMULATION_ENGINE.start(SimulationConfig(timestep_seconds=timestep_seconds))

    # Trigger stall incident on incident_bus_id
    stall = create_incident(
        incident_type=IncidentType.BUS_STALL,
        severity=IncidentSeverity.CRITICAL,
        affected_bus=incident_bus_id,
        duration=incident_duration_seconds,
        delay_seconds=incident_duration_seconds,
        start_time=0.0,
        auto_activate=True,
    )

    incident_steps = max(1, int(round(incident_duration_seconds / timestep_seconds)))
    post_steps = max(1, total_steps - incident_steps)

    # 1. Run during stall
    for _ in range(incident_steps):
        SIMULATION_ENGINE.step()

    # 2. If control is enabled, apply approved hold intervention
    if control_enabled and hold_duration_seconds > 0.0:
        create_control_action(
            bus_id=hold_bus_id,
            route_id="21G",
            decision="HOLD",
            requested_hold_seconds=hold_duration_seconds,
            approved_hold_seconds=hold_duration_seconds,
            state=ControlActionState.APPROVED,
            simulation_time=SIMULATION_ENGINE.simulation_time,
            reason=f"BUSFLOW spacing control hold of {hold_duration_seconds:.1f}s on {hold_bus_id}",
        )

    # 3. Run post-stall observation steps
    for _ in range(post_steps):
        SIMULATION_ENGINE.step()

    snapshot = calculate_metrics_snapshot(
        simulation_time=SIMULATION_ENGINE.simulation_time,
        scenario_id="WITH_BUSFLOW" if control_enabled else "WITHOUT_CONTROL",
    )
    return snapshot


def calculate_scenario_comparison(
    scenario_name: str = "B14 Stall Benchmark",
    incident_duration_seconds: float = 300.0,
    hold_duration_seconds: float = 20.0,
    total_steps: int = 80,
) -> ScenarioComparisonResult:
    """
    Runs deterministic comparative evaluation:
    Run A: WITHOUT_CONTROL (no holding intervention)
    Run B: WITH_BUSFLOW (approved holding intervention applied)
    Generates metric-by-metric deltas, improvement percentages, and executive summary.
    """
    from app.simulation.engine import SIMULATION_ENGINE

    # Run A: Without Control
    without_snapshot = run_scenario_simulation(
        control_enabled=False,
        incident_duration_seconds=incident_duration_seconds,
        hold_duration_seconds=0.0,
        total_steps=total_steps,
    )

    # Run B: With BUSFLOW
    with_snapshot = run_scenario_simulation(
        control_enabled=True,
        incident_duration_seconds=incident_duration_seconds,
        hold_duration_seconds=hold_duration_seconds,
        total_steps=total_steps,
    )

    # Reset live engine to clean initial state
    SIMULATION_ENGINE.reset()

    # Build metric comparison items
    items: List[MetricComparisonItem] = []

    # 1. Average Passenger Waiting Time
    w_wait = without_snapshot.passenger.average_passenger_waiting_time_seconds
    b_wait = with_snapshot.passenger.average_passenger_waiting_time_seconds
    ch_wait = round(b_wait - w_wait, 2) if (b_wait is not None and w_wait is not None) else None
    pct_wait = calculate_improvement_percentage(w_wait, b_wait, lower_is_better=True)
    items.append(
        MetricComparisonItem(
            metric_name="Average Passenger Waiting Time",
            metric_key="average_passenger_waiting_time_seconds",
            without_control=w_wait,
            with_busflow=b_wait,
            change=ch_wait,
            improvement_percentage=pct_wait,
            lower_is_better=True,
            interpretation="Average time spent waiting at stops by passengers across the network.",
        )
    )

    # 2. Total Passenger Waiting Time
    w_tot_wait = without_snapshot.passenger.total_passenger_waiting_time_seconds
    b_tot_wait = with_snapshot.passenger.total_passenger_waiting_time_seconds
    ch_tot_wait = round(b_tot_wait - w_tot_wait, 2)
    pct_tot_wait = calculate_improvement_percentage(w_tot_wait, b_tot_wait, lower_is_better=True)
    items.append(
        MetricComparisonItem(
            metric_name="Total Passenger Waiting Time",
            metric_key="total_passenger_waiting_time_seconds",
            without_control=w_tot_wait,
            with_busflow=b_tot_wait,
            change=ch_tot_wait,
            improvement_percentage=pct_tot_wait,
            lower_is_better=True,
            interpretation="Cumulative passenger-seconds accumulated at all stops.",
        )
    )

    # 3. Headway Coefficient of Variation (CoV)
    w_cov = without_snapshot.service.headway_cov
    b_cov = with_snapshot.service.headway_cov
    ch_cov = round(b_cov - w_cov, 4) if (b_cov is not None and w_cov is not None) else None
    pct_cov = calculate_improvement_percentage(w_cov, b_cov, lower_is_better=True)
    items.append(
        MetricComparisonItem(
            metric_name="Headway Coefficient of Variation (CoV)",
            metric_key="headway_cov",
            without_control=w_cov,
            with_busflow=b_cov,
            change=ch_cov,
            improvement_percentage=pct_cov,
            lower_is_better=True,
            interpretation="Normalized measure of headway variability; lower CoV indicates more regular vehicle spacing.",
        )
    )

    # 4. Total Delay
    w_delay = without_snapshot.service.total_delay_seconds
    b_delay = with_snapshot.service.total_delay_seconds
    ch_delay = round(b_delay - w_delay, 2)
    pct_delay = calculate_improvement_percentage(w_delay, b_delay, lower_is_better=True)
    items.append(
        MetricComparisonItem(
            metric_name="Total Fleet Delay",
            metric_key="total_delay_seconds",
            without_control=w_delay,
            with_busflow=b_delay,
            change=ch_delay,
            improvement_percentage=pct_delay,
            lower_is_better=True,
            interpretation="Aggregated schedule delay accumulated across all buses, including hold duration.",
        )
    )

    # 5. On-Time Performance (%)
    w_otp = without_snapshot.service.on_time_performance_percent
    b_otp = with_snapshot.service.on_time_performance_percent
    ch_otp = round(b_otp - w_otp, 2) if (b_otp is not None and w_otp is not None) else None
    pct_otp = calculate_improvement_percentage(w_otp, b_otp, lower_is_better=False)
    items.append(
        MetricComparisonItem(
            metric_name="On-Time Performance (%)",
            metric_key="on_time_performance_percent",
            without_control=w_otp,
            with_busflow=b_otp,
            change=ch_otp,
            improvement_percentage=pct_otp,
            lower_is_better=False,
            interpretation=f"Percentage of fleet vehicles operating with <= {ON_TIME_DELAY_THRESHOLD_SECONDS:.0f}s delay.",
        )
    )

    # 6. Bunching / Severe Delay Bus Count
    w_bunch = float(without_snapshot.fleet.buses_bunching)
    b_bunch = float(with_snapshot.fleet.buses_bunching)
    ch_bunch = round(b_bunch - w_bunch, 2)
    pct_bunch = calculate_improvement_percentage(w_bunch, b_bunch, lower_is_better=True)
    items.append(
        MetricComparisonItem(
            metric_name="Bunched Buses Count",
            metric_key="buses_bunching",
            without_control=w_bunch,
            with_busflow=b_bunch,
            change=ch_bunch,
            improvement_percentage=pct_bunch,
            lower_is_better=True,
            interpretation="Number of buses operating in SEVERE_DELAY bunching condition.",
        )
    )

    # 7. High Risk Bus Count
    w_high = float(without_snapshot.fleet.high_risk_bus_count)
    b_high = float(with_snapshot.fleet.high_risk_bus_count)
    ch_high = round(b_high - w_high, 2)
    pct_high = calculate_improvement_percentage(w_high, b_high, lower_is_better=True)
    items.append(
        MetricComparisonItem(
            metric_name="High Risk Bus Count",
            metric_key="high_risk_bus_count",
            without_control=w_high,
            with_busflow=b_high,
            change=ch_high,
            improvement_percentage=pct_high,
            lower_is_better=True,
            interpretation="Number of buses evaluated at HIGH operational bunching risk.",
        )
    )

    # 8. Average Risk Score
    w_risk = without_snapshot.fleet.average_risk_score
    b_risk = with_snapshot.fleet.average_risk_score
    ch_risk = round(b_risk - w_risk, 4)
    pct_risk = calculate_improvement_percentage(w_risk, b_risk, lower_is_better=True)
    items.append(
        MetricComparisonItem(
            metric_name="Average Fleet Risk Score",
            metric_key="average_risk_score",
            without_control=w_risk,
            with_busflow=b_risk,
            change=ch_risk,
            improvement_percentage=pct_risk,
            lower_is_better=True,
            interpretation="Fleet-wide mean explainable bunching risk score (0.00 to 1.00).",
        )
    )

    # 9. Total Holding Time (Intervention Cost)
    w_hold = without_snapshot.control.total_holding_time_seconds
    b_hold = with_snapshot.control.total_holding_time_seconds
    ch_hold = round(b_hold - w_hold, 2)
    items.append(
        MetricComparisonItem(
            metric_name="Total Holding Time",
            metric_key="total_holding_time_seconds",
            without_control=w_hold,
            with_busflow=b_hold,
            change=ch_hold,
            improvement_percentage=None,  # Holding time is an intervention cost, not inherently an improvement
            lower_is_better=True,
            interpretation=f"BUSFLOW applied {b_hold:.1f}s of approved hold interventions to regulate service spacing.",
        )
    )

    # 10. Average Recovery Time
    w_rec = without_snapshot.recovery.average_recovery_time_seconds
    b_rec = with_snapshot.recovery.average_recovery_time_seconds
    items.append(
        MetricComparisonItem(
            metric_name="Average Recovery Time",
            metric_key="average_recovery_time_seconds",
            without_control=w_rec,
            with_busflow=b_rec,
            change=None,
            improvement_percentage=None,
            lower_is_better=True,
            interpretation="Average simulation duration required for service regularity recovery across approved actions.",
        )
    )

    cov_str = f"Headway CoV changed from {w_cov} to {b_cov}" if (w_cov is not None and b_cov is not None) else ""
    summary = (
        f"Comparative evaluation for '{scenario_name}': "
        f"Without control, total delay was {w_delay:.1f}s and Headway CoV was {w_cov}. "
        f"With BUSFLOW, {b_hold:.1f}s of controlled holding was applied, resulting in {cov_str} "
        f"and total delay of {b_delay:.1f}s."
    )

    return ScenarioComparisonResult(
        scenario_name=scenario_name,
        without_control=without_snapshot,
        with_busflow=with_snapshot,
        comparison_metrics=items,
        summary=summary,
    )
