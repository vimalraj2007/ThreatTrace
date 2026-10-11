import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from app.models.schemas import NoteRequest, NoteResponse, IncidentUpdatePatch, IncidentResponse
from app.services.store import store

router = APIRouter(prefix="/investigations", tags=["investigations"])

@router.post("/{id}/notes", response_model=NoteResponse)
def add_note(id: str, req: NoteRequest):
    note = {
        "id": f"note-{uuid.uuid4().hex[:6]}",
        "author": req.author or "SOC Analyst",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "content": req.content
    }
    if id not in store.notes:
        store.notes[id] = []
    store.notes[id].append(note)
    return note

@router.patch("/{id}", response_model=IncidentResponse)
def update_incident(id: str, patch: IncidentUpdatePatch):
    inc = next((i for i in store.incidents if i["id"].lower() == id.lower()), None)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    if patch.status:
        inc["status"] = patch.status
    if patch.assignee:
        inc["assignee"] = patch.assignee
    return inc
