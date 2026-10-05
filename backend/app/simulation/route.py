from dataclasses import dataclass, field, asdict
from typing import List, Dict, Any, Optional
from app.simulation.stop import Stop


@dataclass
class Route:
    route_id: str
    route_name: str
    stops: List[Stop] = field(default_factory=list)
    route_length: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def create_demo_route() -> Route:
    """
    Creates deterministic demo route 21G with 12 ordered stops (S01 to S12).
    Total route length is 12,000 meters with stops placed every 1,000 meters.
    """
    stops_data = [
        ("S01", "Central Station", 0.0),
        ("S02", "Market Square", 1000.0),
        ("S03", "University Ave", 2000.0),
        ("S04", "Tech Park", 3000.0),
        ("S05", "City Hospital", 4000.0),
        ("S06", "Greenfield Park", 5000.0),
        ("S07", "Riverfront", 6000.0),
        ("S08", "Commercial Street", 7000.0),
        ("S09", "North Hub", 8000.0),
        ("S10", "Civic Center", 9000.0),
        ("S11", "Harbor Point", 10000.0),
        ("S12", "South Terminal", 11000.0),
    ]
    stops = [Stop(stop_id=sid, stop_name=sname, position=pos) for sid, sname, pos in stops_data]
    return Route(
        route_id="21G",
        route_name="Route 21G - Central Loop",
        stops=stops,
        route_length=12000.0,
    )


DEMO_ROUTE: Route = create_demo_route()
