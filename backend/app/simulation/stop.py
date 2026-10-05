from dataclasses import dataclass, asdict
from typing import Any, Dict


@dataclass
class Stop:
    stop_id: str
    stop_name: str
    position: float

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
