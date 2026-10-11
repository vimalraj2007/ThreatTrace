from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
    timestamp: str

class IngestResponse(BaseModel):
    batch_id: str
    job_id: str
    total_records: int
    valid_records: int
    invalid_records: int
    parsing_errors: List[str]

class AnalyzeRequest(BaseModel):
    job_id: Optional[str] = "demo-job"
    jobId: Optional[str] = None

class AnalyzeResponse(BaseModel):
    analysis_id: str
    incident_count: int
    event_count: int
    affected_hosts: List[str]
    processing_time: float
    incident_ids: List[str]

class TelemetryEventResponse(BaseModel):
    id: str
    ts: str
    host: str
    user: str
    src: str
    dst: str
    type: str # "dns" | "auth" | "process" | "network"
    summary: str
    raw: Dict[str, Any]
    normalized: Dict[str, Any]
    reason: str
    technique: Optional[str] = None
    suspicious: bool

class IncidentResponse(BaseModel):
    id: str
    title: str
    severity: str # "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO"
    status: str # "New" | "Investigating" | "Contained" | "Resolved" | "False Positive"
    confidence: float # 0.0 to 1.0 (or 0-100)
    initial_host: str
    affected_hosts: List[str]
    stage: str
    has_lateral_movement: bool
    first_seen: str
    last_seen: str
    risk_score: int
    users: List[str]
    techniques: List[str]
    assignee: Optional[str] = None

class GraphNodeResponse(BaseModel):
    id: str
    label: str
    type: str # "HOST" | "SERVER" | "USER" | "IP" | "DOMAIN" | "PROCESS"
    status: str # "COMPROMISED" | "SUSPICIOUS" | "AT_RISK" | "NORMAL"
    risk: str # "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
    evidence: List[str]
    on_path: bool = False

class GraphEdgeResponse(BaseModel):
    id: str
    source: str
    target: str
    rel: str # "AUTHENTICATED_TO" | "CONNECTED_TO" | "RESOLVED" | "EXECUTED" | "ACCESSED" | "MOVED_TO"
    on_path: bool = False

class GraphDataResponse(BaseModel):
    nodes: List[GraphNodeResponse]
    edges: List[GraphEdgeResponse]

class MitreTechniqueResponse(BaseModel):
    id: str
    name: str
    tactic: str
    evidence: List[str]
    event_ids: List[str]
    hosts: List[str]
    confidence: float

class LateralMoveResponse(BaseModel):
    id: str
    src: str
    dst: str
    ts: str
    user: str
    auth_type: str
    evidence: str
    risk: str
    confidence: float

class NextTargetResponse(BaseModel):
    asset: str
    priority: str
    score: float
    reasons: List[str]
    evidence: List[str]

class HostInfoResponse(BaseModel):
    name: str
    ip: str
    os: str
    status: str
    risk: str
    users: List[str]
    processes: List[str]
    inbound: List[str]
    outbound: List[str]
    dns: List[str]
    auth: List[str]
    techniques: List[str]
    incidents: List[str]

class DashboardStatsResponse(BaseModel):
    events: int
    incidents: int
    suspicious_hosts: int
    lateral: int
    risky_users: int
    next_targets: int

class DashboardResponse(BaseModel):
    stats: DashboardStatsResponse
    activity: List[Dict[str, Any]]
    severity: List[Dict[str, Any]]
    top_hosts: List[Dict[str, Any]]
    relationships: List[Dict[str, Any]]
    mitre: List[Dict[str, Any]]
    lateral: List[Dict[str, Any]]
    next_targets: List[NextTargetResponse]
    recent: List[IncidentResponse]

class PagedResponse(BaseModel):
    items: List[Any]
    page: int
    page_size: int
    total: int

class NoteRequest(BaseModel):
    content: str
    author: Optional[str] = "SOC Analyst"

class NoteResponse(BaseModel):
    id: str
    author: str
    timestamp: str
    content: str

class IncidentUpdatePatch(BaseModel):
    status: Optional[str] = None
    assignee: Optional[str] = None

class ReportResponse(BaseModel):
    id: str
    incident_id: str
    generated_at: str
    summary: str
    actions: List[str]
    incident: IncidentResponse
    lateral_movement: List[LateralMoveResponse]
    mitre: List[MitreTechniqueResponse]
    next_targets: List[NextTargetResponse]
