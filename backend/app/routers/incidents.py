from typing import List
from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import (
    IncidentResponse,
    GraphDataResponse,
    MitreTechniqueResponse,
    LateralMoveResponse,
    NextTargetResponse,
    PagedResponse
)
from app.services.store import store

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.get("", response_model=List[IncidentResponse])
def get_incidents():
    return store.incidents

@router.get("/{id}", response_model=IncidentResponse)
def get_incident(id: str):
    inc = next((i for i in store.incidents if i["id"].lower() == id.lower()), None)
    if not inc:
        raise HTTPException(status_code=404, detail="That incident was not found.")
    return inc

@router.get("/{id}/timeline", response_model=PagedResponse)
def get_incident_timeline(id: str, page: int = Query(1, ge=1), pageSize: int = Query(25, ge=1)):
    events = store.events
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

@router.get("/{id}/graph", response_model=GraphDataResponse)
def get_incident_graph(id: str):
    return store.graph_data

@router.get("/{id}/mitre", response_model=List[MitreTechniqueResponse])
def get_incident_mitre(id: str):
    return store.mitre_techniques

@router.get("/{id}/lateral-movement", response_model=List[LateralMoveResponse])
def get_incident_lateral_movement(id: str):
    return store.lateral_movement

@router.get("/{id}/next-targets", response_model=List[NextTargetResponse])
def get_incident_next_targets(id: str):
    return store.next_targets
