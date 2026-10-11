from fastapi import APIRouter, Query
from app.models.schemas import PagedResponse
from app.services.store import store

router = APIRouter(tags=["events"])

@router.get("/events", response_model=PagedResponse)
def get_events(page: int = Query(1, ge=1), pageSize: int = Query(25, ge=1), q: str = Query("", alias="q")):
    events = store.events
    if q.strip():
        q_lower = q.strip().lower()
        events = [
            e for e in events
            if q_lower in e.get("id", "").lower()
            or q_lower in e.get("host", "").lower()
            or q_lower in e.get("user", "").lower()
            or q_lower in e.get("summary", "").lower()
            or q_lower in str(e.get("raw", "")).lower()
        ]
    total = len(events)
    start = (page - 1) * pageSize
    end = start + pageSize
    paged_items = events[start:end]
    return {
        "items": paged_items,
        "page": page,
        "page_size": pageSize,
        "total": total
    }
