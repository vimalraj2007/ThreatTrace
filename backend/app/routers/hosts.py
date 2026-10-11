from typing import List
from fastapi import APIRouter
from app.models.schemas import HostInfoResponse
from app.services.store import store

router = APIRouter(tags=["hosts"])

@router.get("/hosts", response_model=List[HostInfoResponse])
def get_hosts():
    return store.hosts
