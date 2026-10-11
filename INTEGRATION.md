# ThreatTrace Frontend-Backend Integration & Architecture Specification

## Overview

**ThreatTrace** is an enterprise AI-assisted multi-stage cyberattack reconstruction and lateral movement detection platform. This document specifies the full integration contract between the **Next.js 15+ Frontend** and the **FastAPI Python Backend**.

---

## 1. Endpoint Contract Table

| Frontend Call | Backend Endpoint | HTTP Method | Request Shape | Response Shape & Adapter Transformations |
| :--- | :--- | :--- | :--- | :--- |
| `api.health()` | `/api/v1/health` | `GET` | None | `{"status": "ok", "version": "1.0.0", "timestamp": "..."}` |
| `api.login(user, pass)` | `/api/v1/auth/login` | `POST` | `application/x-www-form-urlencoded` | `{"access_token": "...", "token_type": "bearer", "user": {...}}` |
| `api.dashboard()` | `/api/v1/dashboard` | `GET` | None | Adapted via `adaptDashboard()` (snake_case -> camelCase) |
| `api.incidents()` | `/api/v1/incidents` | `GET` | None | Array of `IncidentResponse` mapped via `adaptIncident()` |
| `api.incident(id)` | `/api/v1/incidents/{id}` | `GET` | None | `IncidentResponse` mapped via `adaptIncident()` |
| `api.timeline(id, page, size)` | `/api/v1/incidents/{id}/timeline` | `GET` | Query `page`, `pageSize` | `{"items": [...], "page": 1, "pageSize": 25, "total": 6}` |
| `api.graph(id)` | `/api/v1/incidents/{id}/graph` | `GET` | None | Node types & edges adapted via `adaptGraphData()` |
| `api.mitre(id)` | `/api/v1/incidents/{id}/mitre` | `GET` | None | Array of `MitreTechniqueResponse` mapped via `adaptMitreTechnique()` |
| `api.lateral(id)` | `/api/v1/incidents/{id}/lateral-movement` | `GET` | None | Array of `LateralMoveResponse` mapped via `adaptLateralMove()` |
| `api.nextTargets(id)` | `/api/v1/incidents/{id}/next-targets` | `GET` | None | Array of `NextTargetResponse` mapped via `adaptNextTarget()` |
| `api.hosts()` | `/api/v1/hosts` | `GET` | None | Array of `HostInfoResponse` |
| `api.events(page, size, q)` | `/api/v1/events` | `GET` | Query `page`, `pageSize`, `q` | `{"items": [...], "page": 1, "pageSize": 25, "total": N}` |
| `api.ingest(files)` | `/api/v1/ingest` | `POST` | Multipart `files[]`, `kinds[]` | `{"jobId": "...", "totalRecords": 10690, "validRecords": 10690, "invalidRecords": 0}` |
| `api.analyze(jobId)` | `/api/v1/analyze` | `POST` | `{"jobId": "..."}` | `{"incidentIds": ["INC-001"], "incidentCount": 1}` |
| `api.generateReport(id)` | `/api/v1/reports/{id}/generate` | `POST` | None | Report JSON document |
| `api.report(id)` | `/api/v1/reports/{id}` | `GET` | None | Report JSON document |
| `api.addNote(id, text)` | `/api/v1/investigations/{id}/notes` | `POST` | `{"content": "...", "author": "..."}` | Note object with timestamp |
| `api.patchIncident(id, patch)`| `/api/v1/investigations/{id}` | `PATCH` | `{"status": "...", "assignee": "..."}` | Updated `IncidentResponse` |

---

## 2. Resolved Mismatches & Adapter Layer (`src/lib/adapters.ts`)

1. **Field Naming (snake_case -> camelCase)**:
   - Backend returns `initial_host`, `affected_hosts`, `first_seen`, `last_seen`, `risk_score`, `has_lateral_movement`.
   - The adapter module `src/lib/adapters.ts` transforms all fields into `initialHost`, `affectedHosts`, `firstSeen`, `lastSeen`, `risk`, `lateral` before components consume them.

2. **Severity & Priority Normalization**:
   - Backend uppercase strings (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) are normalized to lowercase (`critical`, `high`, `medium`, `low`).

3. **Confidence Scores**:
   - Backend float confidence values (`0.96`, `0.92`) are automatically converted to percentage integer values (`96%`, `92%`).

4. **Cytoscape Graph Nodes & Edges**:
   - Backend node types (`HOST`, `SERVER`, `USER`, `IP`, `DOMAIN`, `PROCESS`) are mapped to lowercase.
   - Suspicious attack path flags `on_path` are mapped to `onPath: true` to trigger high-visibility glowing critical paths.

5. **Predictive Next Targets**:
   - Non-certainty terminology enforced across UI and backend API responses ("Potential Next Target", "Investigation Priority", "Evidence Supporting This Assessment").

6. **Log Ingestion & Parsing Errors**:
   - `POST /api/v1/ingest` reports `total_records`, `valid_records`, `invalid_records`, and `parsing_errors` lists to surface detailed preview feedback in the upload interface.

---

## 3. How to Run & Verify

### Running with Docker Compose
```bash
docker compose up --build
```
- Frontend: http://localhost:3000
- Backend API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/v1/health

### Running Pytest Contract Suite
```bash
cd backend
pytest
```

### Seeding Synthetic Demo Logs via CLI
```bash
cd backend
python -m app.scripts.load_demo
```
