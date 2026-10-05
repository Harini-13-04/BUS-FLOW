# BUSFLOW API Contract & Frontend Integration Specification

> **Status**: STABLE / FROZEN (Phase 13 Final Integration)  
> **API Version**: `0.13.0`  
> **Base URL**: `http://127.0.0.1:8000` (or `http://localhost:8000`)  
> **Interactive Swagger UI**: `http://127.0.0.1:8000/docs`  
> **ReDoc**: `http://127.0.0.1:8000/redoc`  
> **OpenAPI JSON**: `http://127.0.0.1:8000/openapi.json`  

---

## 1. Overview for Frontend Engineers

The **BUSFLOW** backend is a deterministic public-transit simulation, explainable headway management, risk assessment, and recovery measurement engine.

All endpoints return JSON. Every endpoint has strict Pydantic schemas, explicit HTTP status codes, and deterministic behavior.

### Key Architectural Lifecycles

1. **Simulation Loop**:
   - `POST /api/simulation/start` $\rightarrow$ `POST /api/simulation/step` (or `/run`) $\rightarrow$ `GET /api/simulation/state`
2. **Control Decision Lifecycle**:
   - `RECOMMENDED` (Phase 9 via `GET /api/control/recommendations`)
   - $\rightarrow$ Operator Approval (`POST /api/control/{bus_id}/approve`) $\rightarrow$ State: `APPROVED`
   - $\rightarrow$ Next simulation step $\rightarrow$ State: `APPLIED` (Bus holds physically in simulation)
   - $\rightarrow$ Hold duration elapses $\rightarrow$ State: `COMPLETED` (Bus resumes movement)
3. **Recovery Measurement Lifecycle**:
   - Starts upon `APPLIED` $\rightarrow$ State: `TRACKING` (Baseline snapshot captured)
   - Step-by-step evaluation $\rightarrow$ State: `RECOVERED` or `TIMEOUT`
4. **Analytics & Comparison**:
   - `GET /api/analytics/summary` (Real-time KPI snapshot)
   - `GET /api/analytics/comparison` (Deterministic `WITHOUT_CONTROL` vs `WITH_BUSFLOW` comparison)

---

## 2. API Inventory

| Method | Path | Summary / Purpose | Response Model / Status |
|---|---|---|---|
| `GET` | `/` | Root server status check | `200 OK` |
| `GET` | `/health` | Application health check | `200 OK` |
| `GET` | `/api/buses` | List all buses in fleet with live kinematics & headways | `List[BusResponse]` |
| `GET` | `/api/buses/{bus_id}` | Get specific bus details (`B14`–`B18`) | `BusResponse` (404 if missing) |
| `GET` | `/api/passengers` | List passenger demand & queues across all stops (`S01`–`S12`) | `List[StopPassengerResponse]` |
| `GET` | `/api/passengers/{stop_id}` | Get passenger demand & queue for a single stop | `StopPassengerResponse` (404 if missing) |
| `GET` | `/api/traffic` | Inspect network traffic condition and multipliers | `TrafficResponse` |
| `POST` | `/api/traffic` | Update network traffic condition (`NORMAL`, `MODERATE`, `HEAVY`) | `TrafficResponse` (422 if invalid) |
| `GET` | `/api/incidents` | List all created, active, and resolved incidents | `List[IncidentResponse]` |
| `POST` | `/api/incidents` | Create a new deterministic incident | `IncidentResponse` (`201 Created`) |
| `GET` | `/api/incidents/{incident_id}` | Retrieve specific incident details | `IncidentResponse` (404 if missing) |
| `POST` | `/api/incidents/{incident_id}/activate`| Activate an existing incident | `IncidentResponse` (404 if missing) |
| `POST` | `/api/incidents/{incident_id}/resolve` | Resolve an incident | `IncidentResponse` (404 if missing) |
| `POST` | `/api/simulation/start` | Start or reconfigure simulation | `SimulationStateResponse` |
| `POST` | `/api/simulation/step` | Advance simulation by 1 discrete timestep | `SimulationStateResponse` |
| `GET` | `/api/simulation/state` | Current complete simulation state snapshot | `SimulationStateResponse` |
| `POST` | `/api/simulation/reset` | Reset simulation, fleet, passengers, incidents, actions | `SimulationStateResponse` |
| `POST` | `/api/simulation/run` | Advance simulation by $N$ steps or duration | `SimulationStateResponse` |
| `GET` | `/api/control/bunching` | Bunching classifications for entire fleet | `List[BunchingResponse]` |
| `GET` | `/api/control/bunching/{bus_id}`| Bunching classification for a single bus | `BunchingResponse` (404 if missing) |
| `GET` | `/api/control/risk` | Explainable risk scores ($0.0 \rightarrow 1.0$) for fleet | `List[RiskResponse]` |
| `GET` | `/api/control/risk/{bus_id}` | Explainable risk score & factors for a single bus | `RiskResponse` (404 if missing) |
| `GET` | `/api/control/recommendations` | Explainable control recommendations (`HOLD` / `NO_HOLD`) | `List[ControlRecommendationResponse]` |
| `GET` | `/api/control/recommendations/{bus_id}` | Control recommendation for a single bus | `ControlRecommendationResponse` |
| `POST` | `/api/control/{bus_id}/approve` | Operator approves a `HOLD` recommendation | `ControlActionResponse` (400 if NO_HOLD, 409 if holding) |
| `POST` | `/api/control/{bus_id}/reject` | Operator rejects a recommendation (no simulation effect) | `ControlActionResponse` |
| `POST` | `/api/control/{bus_id}/manual` | Operator issues direct manual hold ($1\text{s}-60\text{s}$) | `ControlActionResponse` (422 if <=0 or >60, 409 if holding) |
| `GET` | `/api/control/actions` | Historical log of control actions | `List[ControlActionResponse]` |
| `GET` | `/api/control/actions/{action_id}` | Retrieve specific control action by ID | `ControlActionResponse` (404 if missing) |
| `GET` | `/api/control/recovery` | List all service regularity recovery records | `List[RecoveryMeasurementResponse]` |
| `GET` | `/api/control/recovery/{action_id}` | Retrieve recovery record for a specific control action | `RecoveryMeasurementResponse` (404 if missing) |
| `GET` | `/api/control/recovery/bus/{bus_id}` | Retrieve all recovery records for a specific bus | `List[RecoveryMeasurementResponse]` |
| `GET` | `/api/analytics/summary` | Real-time unified operational metrics snapshot | `MetricsSnapshotResponse` |
| `GET` | `/api/analytics/comparison` | Deterministic `WITHOUT_CONTROL` vs `WITH_BUSFLOW` comparison | `ScenarioComparisonResponse` |

---

## 3. Data Types & Enums

```typescript
// Bus Operational Status
type BusStatus = "NORMAL" | "HOLDING" | "DWELLING" | "SEVERE_DELAY";

// Traffic Conditions
type TrafficCondition = "NORMAL" | "MODERATE" | "HEAVY";

// Incident Types
type IncidentType = 
  | "TRAFFIC_CONGESTION"
  | "BUS_BREAKDOWN"
  | "ROAD_BLOCKAGE"
  | "PASSENGER_SURGE"
  | "BUS_STALL";

// Incident Severity
type IncidentSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// Incident Lifecycle Status
type IncidentStatus = "CREATED" | "ACTIVE" | "RESOLVED";

// Bunching Categorization
type BunchingStatus = "NORMAL" | "AT_RISK" | "SEVERE_DELAY";

// Explainable Risk Tier
type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// Control Decision
type ControlDecision = "HOLD" | "NO_HOLD";

// Control Action Lifecycle State
type ControlActionState = "RECOMMENDED" | "APPROVED" | "REJECTED" | "APPLIED" | "COMPLETED";

// Operator Action Type
type OperatorActionType = "RECOMMENDATION_APPROVAL" | "RECOMMENDATION_REJECTION" | "MANUAL";

// Recovery Lifecycle State
type RecoveryState = "NOT_STARTED" | "TRACKING" | "RECOVERED" | "TIMEOUT";
```

---

## 4. Key Endpoint Contracts & Example Responses

### 4.1 Simulation State (`GET /api/simulation/state`)
```json
{
  "running": true,
  "simulation_time": 25.0,
  "timestep_seconds": 5.0,
  "route_id": "21G",
  "traffic_condition": "NORMAL",
  "active_incidents": [],
  "buses": [
    {
      "bus_id": "B14",
      "route_id": "21G",
      "position": 500.0,
      "speed": 25.0,
      "passengers": 32,
      "capacity": 70,
      "status": "NORMAL",
      "delay_seconds": 15.0,
      "headway_ahead": 345.6,
      "headway_behind": 345.6,
      "desired_headway": 345.6,
      "current_stop": "S01",
      "is_holding": false,
      "hold_remaining_seconds": 0.0,
      "dwell_time_remaining": 0.0
    }
  ],
  "passenger_summary": {
    "total_waiting": 45,
    "total_boarded": 120,
    "total_waiting_time": 2540.0
  }
}
```

### 4.2 Control Recommendations (`GET /api/control/recommendations`)
```json
[
  {
    "bus_id": "B15",
    "route_id": "21G",
    "decision": "HOLD",
    "recommended_hold_seconds": 15.1,
    "headway_ahead": 140.2,
    "headway_behind": 650.0,
    "desired_headway": 345.6,
    "passenger_load": 32,
    "capacity": 70,
    "delay_seconds": 5.0,
    "risk_score": 0.52,
    "risk_level": "HIGH",
    "bunching_status": "SEVERE_DELAY",
    "predicted_demand": 0.45,
    "traffic_condition": "NORMAL",
    "reason": "HOLD recommended for 15.1s. Forward headway is compressed (140.2s vs desired 345.6s, deficit 205.4s) with bunching status SEVERE_DELAY and risk score 0.52 (HIGH). Rear gap of 650.0s provides sufficient trailing buffer."
  }
]
```

### 4.3 Operator Approval (`POST /api/control/{bus_id}/approve`)
- **Success (`200 OK`)**:
```json
{
  "action_id": "ACT_B15_0_1",
  "bus_id": "B15",
  "route_id": "21G",
  "decision": "HOLD",
  "requested_hold_seconds": 15.1,
  "approved_hold_seconds": 15.1,
  "state": "APPROVED",
  "created_at_simulation_time": 25.0,
  "approved_at_simulation_time": 25.0,
  "applied_at_simulation_time": null,
  "completed_at_simulation_time": null,
  "reason": "Operator approved recommendation: HOLD recommended for 15.1s...",
  "operator_action": "RECOMMENDATION_APPROVAL"
}
```
- **Error Codes**:
  - `400 Bad Request`: When current recommendation for the bus is `NO_HOLD`.
  - `404 Not Found`: When `bus_id` is invalid.
  - `409 Conflict`: When bus is already executing a hold or has an active action pending.

### 4.4 Recovery Measurement (`GET /api/control/recovery/{action_id}`)
```json
{
  "recovery_id": "REC_ACT_B15_0_1",
  "action_id": "ACT_B15_0_1",
  "bus_id": "B15",
  "state": "RECOVERED",
  "started_at_simulation_time": 30.0,
  "observation_window_seconds": 900.0,
  "recovered_at_simulation_time": 65.0,
  "recovery_time_seconds": 35.0,
  "hold_duration_seconds": 15.1,
  "headway_change_seconds": 120.5,
  "risk_change": -0.28,
  "delay_change_seconds": 15.1,
  "control_delay_added": 15.1,
  "risk_reduction_percentage": 53.85,
  "summary": "Service regularity successfully recovered in 35.0s. Forward headway improved from 140.2s to 260.7s (target: 259.2s). Risk score reduced from 0.52 (HIGH) to 0.24 (LOW)."
}
```

### 4.5 Operational Analytics Summary (`GET /api/analytics/summary`)
```json
{
  "timestamp_simulation": 120.0,
  "scenario_id": "LIVE_SIMULATION",
  "fleet": {
    "total_buses": 5,
    "buses_running": 5,
    "buses_at_risk": 0,
    "buses_severe_delay": 0,
    "buses_bunching": 0,
    "bunching_risk_count": 0,
    "severe_bunching_count": 0,
    "average_risk_score": 0.18,
    "high_risk_bus_count": 0,
    "critical_risk_bus_count": 0
  },
  "passenger": {
    "total_passenger_arrivals": 240,
    "total_passengers_boarded": 195,
    "total_passenger_waiting_time_seconds": 4560.0,
    "average_passenger_waiting_time_seconds": 19.0
  },
  "service": {
    "headway_values": [345.6, 345.6, 345.6, 345.6, 345.6],
    "average_headway_seconds": 345.6,
    "headway_standard_deviation": 0.0,
    "headway_cov": 0.0,
    "total_delay_seconds": 15.1,
    "average_delay_seconds": 3.02,
    "on_time_buses": 5,
    "on_time_performance_percent": 100.0
  },
  "control": {
    "total_control_actions": 1,
    "approved_control_actions": 1,
    "rejected_control_actions": 0,
    "completed_control_actions": 1,
    "active_control_actions": 0,
    "total_holding_time_seconds": 15.1,
    "average_hold_duration_seconds": 15.1
  },
  "recovery": {
    "total_recovery_measurements": 1,
    "recovered_control_actions": 1,
    "timed_out_control_actions": 0,
    "average_recovery_time_seconds": 35.0,
    "fastest_recovery_time_seconds": 35.0,
    "slowest_recovery_time_seconds": 35.0
  }
}
```

### 4.6 Deterministic Comparison (`GET /api/analytics/comparison`)
- **Query Params**:
  - `scenario_name` (string, optional, default: `"B14 Stall Benchmark"`)
  - `incident_duration` (float, optional, default: `300.0`)
  - `hold_duration` (float, optional, default: `20.0`)
  - `total_steps` (int, optional, default: `80`)
- **Response**:
```json
{
  "scenario_name": "B14 Stall Benchmark",
  "without_control": { "...": "MetricsSnapshotResponse" },
  "with_busflow": { "...": "MetricsSnapshotResponse" },
  "comparison_metrics": [
    {
      "metric_name": "Headway Coefficient of Variation (CoV)",
      "metric_key": "headway_cov",
      "without_control": 0.8233,
      "with_busflow": 0.8132,
      "change": -0.0101,
      "improvement_percentage": 1.23,
      "lower_is_better": true,
      "interpretation": "Lower CoV represents more regular vehicle spacing."
    },
    {
      "metric_name": "Total Fleet Delay",
      "metric_key": "total_delay_seconds",
      "without_control": 570.5,
      "with_busflow": 590.5,
      "change": 20.0,
      "improvement_percentage": -3.51,
      "lower_is_better": true,
      "interpretation": "Total accumulated schedule delay across active fleet."
    },
    {
      "metric_name": "Total Holding Time",
      "metric_key": "total_holding_time_seconds",
      "without_control": 0.0,
      "with_busflow": 20.0,
      "change": 20.0,
      "improvement_percentage": null,
      "lower_is_better": false,
      "interpretation": "Total controlled holding applied (operational intervention cost)."
    }
  ],
  "summary": "Comparative evaluation for 'B14 Stall Benchmark': Without control, total delay was 570.5s and Headway CoV was 0.8233. With BUSFLOW, 20.0s of controlled holding was applied, resulting in Headway CoV changed from 0.8233 to 0.8132 and total delay of 590.5s."
}
```

---

## 5. Standard Error Format

All error responses strictly adhere to FastAPI HTTP exception formatting:

```json
{
  "detail": "Descriptive human-readable error explanation"
}
```

| HTTP Status | Trigger Conditions |
|---|---|
| `400 Bad Request` | Operator attempts to approve a recommendation that is `NO_HOLD`. |
| `404 Not Found` | Bus, stop, incident, action, or recovery record ID not found. |
| `409 Conflict` | Bus is already holding or has an active action pending. |
| `422 Unprocessable Entity` | Invalid body payload (e.g. invalid traffic condition or manual hold $> 60\text{s}$ / $\le 0\text{s}$). |

---

## 6. Frontend UI Module Mapping Guide

1. **Operations Dashboard**:
   - `GET /api/buses` (fleet status, delay, passenger load)
   - `GET /api/control/bunching` (spacing cards)
   - `GET /api/control/risk` (risk gauge & contributing factors)
   - `GET /api/control/recommendations` (intervention prompt list)
   - `GET /api/analytics/summary` (high-level KPI widgets)

2. **Live Map**:
   - `GET /api/simulation/state` (poll or periodic refresh for bus positions, dwell timers, active incidents)

3. **Human-in-the-Loop Control Modal**:
   - `POST /api/control/{bus_id}/approve` (approve button)
   - `POST /api/control/{bus_id}/reject` (dismiss button)
   - `POST /api/control/{bus_id}/manual` (manual slider $1\text{s}-60\text{s}$)
   - `GET /api/control/actions` (audit log table)

4. **Incident Management**:
   - `GET /api/incidents` (list active & past incidents)
   - `POST /api/incidents` (create stall / congestion)
   - `POST /api/incidents/{id}/activate` & `POST /api/incidents/{id}/resolve`

5. **Recovery & Analytics**:
   - `GET /api/control/recovery` (recovery cards & before/after delta visualization)
   - `GET /api/analytics/comparison` (side-by-side Without Control vs With BUSFLOW delta bars)
