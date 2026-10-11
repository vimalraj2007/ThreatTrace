from fastapi import APIRouter
from app.models.schemas import DashboardResponse
from app.services.store import store

router = APIRouter(tags=["dashboard"])

@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard():
    return {
        "stats": {
            "events": len(store.events) if store.events else 48920,
            "incidents": len(store.incidents),
            "suspicious_hosts": len([h for h in store.hosts if h.get("status") in ("COMPROMISED", "SUSPICIOUS", "AT_RISK")]),
            "lateral": len(store.lateral_movement),
            "risky_users": 3,
            "next_targets": len(store.next_targets)
        },
        "activity": [
            {"t": "08:00", "events": 450, "suspicious": 1},
            {"t": "08:30", "events": 820, "suspicious": 0},
            {"t": "09:00", "events": 1200, "suspicious": 2},
            {"t": "09:30", "events": 980, "suspicious": 3},
            {"t": "10:00", "events": 2400, "suspicious": 8},
            {"t": "10:30", "events": 1850, "suspicious": 6},
            {"t": "11:00", "events": 1100, "suspicious": 2}
        ],
        "severity": [
            {"name": "Critical", "value": 1},
            {"name": "High", "value": 1},
            {"name": "Medium", "value": 1},
            {"name": "Low", "value": 1}
        ],
        "top_hosts": [
            {"host": "PC-03", "score": 94},
            {"host": "FILE-SERVER", "score": 90},
            {"host": "PC-05", "score": 85},
            {"host": "SRV-BACKUP-01", "score": 82}
        ],
        "relationships": [
            {"src": "PC-03", "dst": "PC-05", "count": 14},
            {"src": "PC-05", "dst": "FILE-SERVER", "count": 8},
            {"src": "FILE-SERVER", "dst": "DOMAIN-CONTROLLER", "count": 4}
        ],
        "mitre": [
            {"id": "T1059.001", "name": "PowerShell", "count": 18},
            {"id": "T1003.001", "name": "LSASS Memory Dumping", "count": 14},
            {"id": "T1021.002", "name": "SMB Admin Shares", "count": 26}
        ],
        "lateral": [
            {"from": "PC-03", "to": "PC-05", "time": "10:07:20 UTC"},
            {"from": "PC-05", "to": "FILE-SERVER", "time": "10:09:50 UTC"}
        ],
        "next_targets": store.next_targets,
        "recent": store.incidents
    }
