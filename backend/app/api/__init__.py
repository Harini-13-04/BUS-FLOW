from app.api.incidents import router as incidents_router
from app.api.simulation import router as simulation_router
from app.api.bunching import router as bunching_router
from app.api.risk import router as risk_router
from app.api.control import router as control_router
from app.api.analytics import router as analytics_router

__all__ = [
    "incidents_router",
    "simulation_router",
    "bunching_router",
    "risk_router",
    "control_router",
    "analytics_router",
]
