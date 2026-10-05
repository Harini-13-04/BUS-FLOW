# BUSFLOW Backend

Backend foundation and simulation engine for **BUSFLOW** — an explainable adaptive bus headway management system.

---

## 1. Overview

The BUSFLOW backend provides high-performance API services to power the real-time simulation, control, and recovery measurement engines for headway regularity and bunching prevention.

- **Phase 1**: Core FastAPI application, health checks, root endpoints, and CORS for local React development.
- **Phase 2**: Deterministic Route (`21G`), 12 ordered Stops (`S01`–`S12`), Bus models, in-memory fleet (`B14`–`B18`), and Bus REST APIs.
- **Phase 3**: Deterministic Passenger Demand (`S01`–`S12`), Queueing, Waiting Time accumulation, Bus Boarding with capacity constraints, and Passenger REST APIs.
- **Phase 4**: Traffic Conditions (`NORMAL`, `MODERATE`, `HEAVY`), Incident Engine (creation, activation, resolution, 5-minute B14 bus stall demo), and Traffic/Incident REST APIs.
- **Phase 5**: Core Simulation Engine (`SimulationEngine`), continuous bus loop kinematics, stop detection & boarding integration, traffic speed scaling, active incident stall execution, and Simulation REST APIs (`start`, `step`, `state`, `reset`, `run`).
- **Phase 6**: Two-Sided Headway Calculation Engine (`app.control.headway`), circular distance wrapping, time headway conversions, target `desired_headway`, and live headway updates across simulation lifecycles.
- **Phase 7**: Bunching Detection Engine (`app.control.bunching`), transparent threshold classifications (`NORMAL`, `AT_RISK`, `SEVERE_DELAY`), two-sided headway context, explainability strings, and Bunching REST APIs.
- **Phase 8**: Explainable Risk Score Engine (`app.control.risk`), deterministic 6-component operational risk model, weighted scoring, categorical risk levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), dynamic human-readable reasoning strings, and Risk REST APIs.
- **Phase 9**: Explainable Control Decision Engine (`app.control.controller`), two-sided headway control rules, bounded corrective hold durations ($0\text{s} - 60\text{s}$), safety discounting (late bus, passenger crowding, rear gap buffer, traffic, demand), and Control Recommendation REST APIs.
- **Phase 10**: Human-in-the-Loop Operator Approval & Actual Hold Application (`app.control.action`, `app.simulation.engine`), complete action lifecycle (`RECOMMENDED` $\rightarrow$ `APPROVED`/`REJECTED` $\rightarrow$ `APPLIED` $\rightarrow$ `COMPLETED`), continuous hold timer kinematics, exact partial timestep handling, manual intervention, and Control Action History REST APIs.
- **Phase 11**: Recovery Measurement Engine (`app.control.recovery`), service regularity recovery tracking, deterministic `BEFORE_CONTROL` vs `AFTER_CONTROL` operational snapshots, actual recovery duration computation, observation window timeouts, multi-action isolation, and Recovery REST APIs.
- **Phase 12**: Operational Metrics Engine (`app.metrics.metrics`, `app.schemas.metrics`, `app.api.analytics`), public-transport operational KPIs (Passenger Waiting Time, Headway CoV, OTP, Delay, Holding Cost, Recovery Statistics), deterministic `WITHOUT_CONTROL` vs `WITH_BUSFLOW` comparison engine, and Analytics REST APIs.
- **Phase 13**: Final Backend Integration & API Stabilization (`backend/API_CONTRACT.md`, `backend/test_phase13_integration.py`), end-to-end simulation-to-metrics pipeline validation, strict error handling (400, 404, 409, 422), reset determinism, CORS preflight verification, and full cross-phase regression.

> **BACKEND IMPLEMENTATION COMPLETE**  
> The BUSFLOW backend is frozen as a stable, deterministic integration contract for the frontend team. See [`API_CONTRACT.md`](./API_CONTRACT.md) for full frontend handoff specifications.

---

## 2. Complete Architecture & Simulation Pipeline

```
PASSENGER DEMAND (Phase 3)
      ↓
SIMULATION ENGINE (Phase 5)
      ↓
BUS MOVEMENT (Phase 2 & 5)
      ↓
TRAFFIC & INCIDENTS (Phase 4)
      ↓
HEADWAY CALCULATION (Phase 6)
      ↓
BUNCHING DETECTION (Phase 7)
      ↓
EXPLAINABLE RISK SCORING (Phase 8)
      ↓
CONTROLLER RECOMMENDATIONS (Phase 9)
      ↓
OPERATOR APPROVAL (Phase 10)
      ↓
PHYSICAL HOLD APPLICATION (Phase 10)
      ↓
RECOVERY MEASUREMENT (Phase 11)
      ↓
OPERATIONAL METRICS (Phase 12)
      ↓
WITHOUT CONTROL vs BUSFLOW COMPARISON (Phase 12 & 13)
```

Phase 10 connects explainable controller recommendations to the physical simulation through explicit human operator approval.

```
RECOMMENDED (Phase 9)
     ↓
┌───────────────┐
│   OPERATOR    │
└───────┬───────┘
        ↓
   ┌────┴────┐
   ↓         ↓
APPROVED   REJECTED (No simulation effect)
   ↓
 APPLIED (Bus stops moving; position frozen)
   ↓
 BUS ACTUALLY HOLDS (Hold timer counts down; delay accumulates)
   ↓
 COMPLETED (Hold expires; bus resumes normal movement)
```

---

## 3. Phase 11: Recovery Measurement Engine

Phase 11 measures what actually happened AFTER an approved control intervention. It deterministically compares the operational baseline captured at hold application against the post-control state.

```
APPROVED
   ↓
APPLIED (Recovery Tracking Initiated — Before Snapshot Captured)
   ↓
RECOVERY TRACKING (Monitors simulation step-by-step)
   ↓
┌───────────────────────────────┴───────────────────────────────┐
↓                                                               ↓
Criteria Met within Observation Window:                Exceeds 900s Observation Window:
RECOVERED                                              TIMEOUT
(Calculates exact recovery_time_seconds)               (recovery_time_seconds = null)
```

### Recovery Lifecycle States
- `NOT_STARTED`: Control action has not yet been applied to the simulation.
- `TRACKING`: Hold applied; baseline snapshot captured; observing subsequent simulation steps.
- `RECOVERED`: All deterministic recovery criteria are satisfied simultaneously.
- `TIMEOUT`: Observation window ($900.0\text{s}$ / 15 minutes) expired without meeting criteria.

### Deterministic Recovery Criteria
A bus service is considered **RECOVERED** when all 3 explicit conditions are met:
1. **Headway Recovery**: $\text{headway\_ahead} \ge 0.75 \times \text{desired\_headway}$ (i.e. $\ge 259.2\text{s}$ for desired $345.6\text{s}$).
2. **Bunching Recovery**: $\text{bunching\_status} == \text{NORMAL}$ ($\text{is\_bunching} == \text{False}$).
3. **Risk Recovery**: $\text{risk\_level} \in [\text{LOW}, \text{MEDIUM}]$ ($\text{risk\_score} < 0.50$).

---

## 4. Phase 12: Operational Metrics & Comparison Engine

Phase 12 converts raw simulation, passenger queueing, fleet kinematics, control actions, and recovery measurements into authoritative public-transport operational metrics and deterministic baseline comparisons.

### Core Metrics & Formulas

1. **Average Passenger Waiting Time**:
   $$\text{average\_waiting\_time\_seconds} = \frac{\sum_{\text{all stops}} \text{total\_waiting\_time}}{\sum_{\text{all stops}} \text{total\_arrivals}}$$
   *(Safely returns `null` if total arrivals is zero).*

2. **Headway Coefficient of Variation (CoV)**:
   Normalized measure of headway variability and service regularity across active buses:
   $$\text{mean\_headway} = \mu = \frac{1}{N} \sum_{i=1}^N h_i$$
   $$\text{standard\_deviation} = \sigma = \sqrt{\frac{1}{N} \sum_{i=1}^N (h_i - \mu)^2}$$
   $$\text{headway\_cov} = \frac{\sigma}{\mu}$$
   *(Safely returns `null` if mean headway is zero or fleet size $< 2$).*

3. **On-Time Performance (OTP)**:
   Explicit deterministic punctuality threshold ($\text{ON\_TIME\_DELAY\_THRESHOLD\_SECONDS} = 60.0\text{s}$):
   $$\text{on\_time\_buses} = \sum [\text{delay\_seconds} \le 60.0]$$
   $$\text{on\_time\_performance} = \left(\frac{\text{on\_time\_buses}}{\text{total\_buses}}\right) \times 100.0$$

4. **Total Fleet Delay**:
   Authoritative cumulative schedule delay across all active buses:
   $$\text{total\_delay\_seconds} = \sum_{\text{bus} \in \text{fleet}} \text{bus.delay\_seconds}$$

5. **Total Holding Time (Control Cost)**:
   Sum of actual approved hold durations for executed interventions (`APPLIED` and `COMPLETED`):
   $$\text{total\_holding\_time\_seconds} = \sum \text{approved\_hold\_seconds}$$

6. **Average Recovery Time**:
   Calculated strictly across `RECOVERED` measurements (timeouts are excluded, not counted as zero):
   $$\text{average\_recovery\_time\_seconds} = \frac{1}{K} \sum_{k=1}^K \text{recovery\_time\_seconds}_k$$

### Deterministic Baseline Comparison (`WITHOUT_CONTROL` vs `WITH_BUSFLOW`)

- **Baseline Run (`WITHOUT_CONTROL`)**: Executes the exact scenario with identical initial state and incident disturbances, but with automated/manual control interventions disabled (zero holding applied).
- **Control Run (`WITH_BUSFLOW`)**: Executes the identical scenario with BUSFLOW controller recommendations evaluated and approved.
- **Improvement Percentage Calculation**:
  - **Lower is Better** (Wait Time, Headway CoV, Total Delay, Bunched Buses, Risk):
    $$\text{improvement\_percentage} = \frac{\text{without\_control} - \text{with\_busflow}}{\text{without\_control}} \times 100.0$$
  - **Higher is Better** (On-Time Performance):
    $$\text{improvement\_percentage} = \frac{\text{with\_busflow} - \text{without\_control}}{\text{without\_control}} \times 100.0$$
  - **Intervention Cost** (Holding Time): Reported honestly as control cost without labeling increased holding as "better".

---

## 5. Virtual Environment Setup

From the `backend/` directory, create and activate a Python virtual environment:

### Windows (PowerShell)
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### macOS / Linux (Bash)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

---

## 6. Install Dependencies

With the virtual environment activated, install the required packages:

```bash
pip install -r requirements.txt
```

---

## 7. Run the FastAPI Server

Start the development server with hot reload:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

---

## 8. API Documentation & Endpoints

- **Interactive Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc UI**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **OpenAPI Schema**: [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json)

### Complete Endpoint Map:
- `GET /` : Root status check and verification message
- `GET /health` : Application health check status
- `GET /api/buses` : Retrieve all current buses with kinematic, headway, and hold status metrics
- `GET /api/buses/{bus_id}` : Retrieve details of a specific bus by ID (`B14`–`B18`)
- `GET /api/passengers` : Retrieve passenger demand, waiting queues, and boarding statistics for all stops
- `GET /api/passengers/{stop_id}` : Retrieve passenger status for a specific stop (`S01`–`S12`)
- `GET /api/traffic` : Inspect network traffic state and speed/delay multipliers
- `POST /api/traffic` : Update active network traffic condition (`NORMAL`, `MODERATE`, `HEAVY`)
- `POST /api/incidents` : Create a new incident (`TRAFFIC_CONGESTION`, `BUS_STALL`, `ROAD_BLOCKAGE`, etc.)
- `GET /api/incidents` : List all incidents
- `GET /api/incidents/{incident_id}` : Retrieve specific incident details
- `POST /api/incidents/{incident_id}/activate` : Transition an incident to `ACTIVE`
- `POST /api/incidents/{incident_id}/resolve` : Transition an incident to `RESOLVED`
- `POST /api/simulation/start` : Start/reinitialize simulation with configuration
- `POST /api/simulation/step` : Advance simulation clock and physics by one discrete timestep
- `GET /api/simulation/state` : Retrieve complete snapshot of simulation state, fleet kinematics, headways, and passenger stats
- `POST /api/simulation/reset` : Reset simulation to deterministic initial state
- `POST /api/simulation/run` : Run simulation continuously for $N$ steps or duration
- `GET /api/control/bunching` : Inspect bunching classification and explanations for all buses in the fleet
- `GET /api/control/bunching/{bus_id}` : Inspect bunching classification and explanation for a single bus
- `GET /api/control/risk` : Inspect explainable bunching and operational risk scores across the entire fleet
- `GET /api/control/risk/{bus_id}` : Inspect explainable bunching risk score and component breakdown for a single bus
- `GET /api/control/recommendations` : Inspect explainable control recommendations (`HOLD` / `NO_HOLD`), hold durations, and justifications across the fleet
- `GET /api/control/recommendations/{bus_id}` : Inspect control recommendation, duration, and justification for a single bus
- `POST /api/control/{bus_id}/approve` : Operator approves a `HOLD` recommendation, creating an `APPROVED` control action
- `POST /api/control/{bus_id}/reject` : Operator rejects a recommendation, recording a `REJECTED` action with zero simulation effect
- `POST /api/control/{bus_id}/manual` : Operator issues a direct manual hold intervention ($1\text{s} - 60\text{s}$)
- `GET /api/control/actions` : Retrieve full historical log of control actions, approvals, and execution states
- `GET /api/control/actions/{action_id}` : Retrieve details and timestamps of a specific control action
- `GET /api/control/recovery` : Retrieve all service regularity recovery measurements across all control interventions
- `GET /api/control/recovery/{action_id}` : Retrieve the recovery measurement for a specific control action
- `GET /api/control/recovery/bus/{bus_id}` : Retrieve all recovery records associated with a specific bus
- `GET /api/analytics/summary` : Retrieve comprehensive real-time operational metrics snapshot (fleet, passenger, service, control, recovery)
- `GET /api/analytics/comparison` : Retrieve deterministic side-by-side comparison between `WITHOUT_CONTROL` and `WITH_BUSFLOW` with exact metric deltas and improvement percentages

---

## 9. Automated Test Suites

Execute test suites from the `backend/` directory:

```powershell
.\.venv\Scripts\python.exe test_phase8_risk.py
.\.venv\Scripts\python.exe test_phase9_control.py
.\.venv\Scripts\python.exe test_phase10_control.py
.\.venv\Scripts\python.exe test_phase11_recovery.py
.\.venv\Scripts\python.exe test_phase12_metrics.py
.\.venv\Scripts\python.exe test_phase13_integration.py
```
