from datetime import datetime
from fastapi import APIRouter, HTTPException, Response
from app.models.schemas import ReportResponse
from app.services.store import store
from app.services.reports import generate_pdf_report

router = APIRouter(prefix="/reports", tags=["reports"])

def build_report_data(id: str):
    inc = next((i for i in store.incidents if i["id"].lower() == id.lower()), store.incidents[0])
    return {
        "id": f"REP-{inc['id']}",
        "incident_id": inc["id"],
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "summary": f"Telemetry indicates multi-stage lateral movement attack beginning on {inc['initial_host']}. {len(inc['affected_hosts'])} host(s) show correlated activity. Findings indicate active lateral movement into enterprise storage assets.",
        "actions": [
            "Isolate affected hosts pending validation",
            "Reset credentials for accounts observed in the attack path",
            "Review authentication logs for the highest-priority next-target assets",
            "Preserve memory and disk images from initial-access host"
        ],
        "incident": inc,
        "lateral_movement": store.lateral_movement,
        "mitre": store.mitre_techniques,
        "next_targets": store.next_targets
    }

@router.post("/{id}/generate", response_model=ReportResponse)
def generate_report(id: str):
    return build_report_data(id)

@router.get("/{id}", response_model=ReportResponse)
def get_report(id: str):
    clean_id = id.replace("REP-", "")
    return build_report_data(clean_id)

@router.get("/{id}/pdf")
def get_report_pdf(id: str):
    clean_id = id.replace("REP-", "")
    report_data = build_report_data(clean_id)
    pdf_bytes = generate_pdf_report(report_data)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=ThreatTrace_Report_{clean_id}.pdf"}
    )
