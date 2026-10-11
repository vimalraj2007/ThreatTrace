import io
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_pdf_report(report_data: Dict[str, Any]) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    story = []
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        textColor=colors.HexColor("#0284c7"),
        spaceAfter=12
    )

    h2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=10,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#334155")
    )

    incident = report_data.get("incident", {})

    story.append(Paragraph(f"ThreatTrace Executive DFIR Report: {incident.get('id', 'INC-001')}", title_style))
    story.append(Paragraph(f"<b>Title:</b> {incident.get('title', 'Multi-stage lateral movement')}", body_style))
    story.append(Paragraph(f"<b>Severity:</b> {incident.get('severity', 'CRITICAL')} | <b>Risk Score:</b> {incident.get('risk_score', 94)}/100", body_style))
    story.append(Spacer(1, 12))

    story.append(Paragraph("1. Executive Summary", h2_style))
    story.append(Paragraph(report_data.get("summary", "Correlation engine identified multi-stage intrusion."), body_style))
    story.append(Spacer(1, 12))

    story.append(Paragraph("2. Recommended Remediation Actions", h2_style))
    for action in report_data.get("actions", []):
        story.append(Paragraph(f"• {action}", body_style))
    story.append(Spacer(1, 12))

    story.append(Paragraph("3. Lateral Movement Vectors", h2_style))
    for lm in report_data.get("lateral_movement", []):
        story.append(Paragraph(f"<b>{lm.get('src')} &rarr; {lm.get('dst')}</b> ({lm.get('auth_type')})", body_style))
        story.append(Paragraph(f"Evidence: {lm.get('evidence')}", body_style))
        story.append(Spacer(1, 6))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
