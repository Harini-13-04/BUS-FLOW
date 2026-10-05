from typing import List
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.schemas.bus import BusResponse
from app.schemas.passenger import StopPassengerResponse
from app.schemas.traffic import TrafficResponse, TrafficUpdateRequest
from app.simulation.bus import get_all_buses, get_bus_by_id
from app.simulation.passenger import get_all_passenger_states, get_passenger_state
from app.simulation.traffic import get_current_traffic, set_traffic_condition
from app.api.incidents import router as incidents_router
from app.api.simulation import router as simulation_router
from app.api.bunching import router as bunching_router
from app.api.risk import router as risk_router
from app.api.control import router as control_router
from app.api.analytics import router as analytics_router

app = FastAPI(
    title="BUSFLOW API",
    description="Backend and simulation engine for BUSFLOW — an explainable adaptive bus headway management system.",
    version="0.13.0",
)

# Configure CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
def read_root():
    return {
        "name": "BUSFLOW",
        "status": "running",
        "message": "BUSFLOW backend is ready",
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
    }


# ==========================================
# Buses Endpoints
# ==========================================


@app.get("/api/buses", response_model=List[BusResponse], tags=["Buses"])
def get_buses():
    """Retrieve all current buses operating on the network."""
    return get_all_buses()


@app.get("/api/buses/{bus_id}", response_model=BusResponse, tags=["Buses"])
def get_bus(bus_id: str):
    """Retrieve details of a single bus by its ID."""
    bus = get_bus_by_id(bus_id)
    if not bus:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bus '{bus_id}' not found",
        )
    return bus


# ==========================================
# Passenger Demand Endpoints
# ==========================================


@app.get("/api/passengers", response_model=List[StopPassengerResponse], tags=["Passengers"])
def get_passengers():
    """Retrieve passenger demand, waiting counts, and boarding stats across all stops."""
    return get_all_passenger_states()


@app.get("/api/passengers/{stop_id}", response_model=StopPassengerResponse, tags=["Passengers"])
def get_stop_passengers(stop_id: str):
    """Retrieve passenger demand and waiting status for a specific stop."""
    passenger_state = get_passenger_state(stop_id)
    if not passenger_state:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stop '{stop_id}' not found",
        )
    return passenger_state


# ==========================================
# Traffic Endpoints
# ==========================================


@app.get("/api/traffic", response_model=TrafficResponse, tags=["Traffic"])
def get_traffic():
    """Inspect current network traffic condition and its speed/delay parameters."""
    return get_current_traffic()


@app.post("/api/traffic", response_model=TrafficResponse, tags=["Traffic"])
def update_traffic(payload: TrafficUpdateRequest):
    """Update network traffic condition (NORMAL, MODERATE, HEAVY)."""
    try:
        return set_traffic_condition(payload.condition)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))


# ==========================================
# Incidents Router
# ==========================================

app.include_router(incidents_router)


# ==========================================
# Simulation Router
# ==========================================

app.include_router(simulation_router)


# ==========================================
# Bunching Control Router
# ==========================================

app.include_router(bunching_router)


# ==========================================
# Risk Score Router
# ==========================================

app.include_router(risk_router)


# ==========================================
# Control Recommendation & Recovery Router
# ==========================================

app.include_router(control_router)


# ==========================================
# Operational Analytics & Metrics Router
# ==========================================

app.include_router(analytics_router)
