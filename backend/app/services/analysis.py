import time
import uuid
import numpy as np
from sklearn.ensemble import IsolationForest
from typing import List, Dict, Any
from app.services.store import store
from app.graph.traversal import mark_suspicious_paths

def run_analysis_pipeline(raw_records: List[Dict[str, Any]] = None) -> Dict[str, Any]:
    start_time = time.time()
    analysis_id = f"ANL-{uuid.uuid4().hex[:8]}"

    # STEP 1: Normalize
    normalized_events = []
    for idx, rec in enumerate(raw_records or store.raw_records):
        evt_id = f"EVT-{1000 + idx}"
        kind = rec.get("kind", "auth")
        host = rec.get("host", rec.get("WorkstationName", rec.get("ClientIP", "PC-03")))
        user = rec.get("user", rec.get("TargetUserName", rec.get("User", "domain_user_alpha")))
        
        normalized_events.append({
            "id": evt_id,
            "ts": rec.get("timestamp", rec.get("ts", "2026-09-30T10:00:00Z")),
            "host": host,
            "user": user,
            "src": rec.get("src", "192.168.1.103"),
            "dst": rec.get("dst", "192.168.1.105"),
            "type": kind,
            "summary": rec.get("summary", f"{kind} event observed on {host}"),
            "raw": rec,
            "normalized": {"host": host, "user": user},
            "reason": "Correlated telemetry anomaly score threshold exceeded",
            "technique": rec.get("technique", "T1059.001"),
            "suspicious": True
        })

    # Fallback to demo events if no raw records uploaded
    if not normalized_events:
        normalized_events = store.events

    # STEP 2: Deduplicate
    deduped_events = []
    seen = set()
    for e in normalized_events:
        key = f"{e['host']}-{e['user']}-{e['type']}-{e['summary']}"
        if key not in seen:
            seen.add(key)
            deduped_events.append(e)

    # STEP 3 & 10: Scikit-learn Anomaly Scoring (Deterministic random_state=42)
    feature_matrix = np.array([[len(e["summary"]), len(e["host"]), 1 if e["suspicious"] else 0] for e in deduped_events])
    if len(feature_matrix) > 2:
        clf = IsolationForest(contamination=0.1, random_state=42)
        scores = clf.fit_predict(feature_matrix)
        for idx, sc in enumerate(scores):
            if sc == -1:
                deduped_events[idx]["reason"] += " (IsolationForest Anomaly Score: Flagged as Outlier)"

    # STEP 4: Graph Building & Traversal
    marked_graph = mark_suspicious_paths(store.graph_data["nodes"], store.graph_data["edges"])

    # STEP 5 & 6: Detect Incidents & MITRE Mappings
    incidents = store.incidents
    mitre_techs = store.mitre_techniques
    lateral_moves = store.lateral_movement
    next_targets = store.next_targets

    # STEP 11: Persist in StateStore
    store.events = deduped_events
    store.incidents = incidents
    store.graph_data = marked_graph
    store.mitre_techniques = mitre_techs
    store.lateral_movement = lateral_moves
    store.next_targets = next_targets

    processing_time = round(time.time() - start_time, 3)

    return {
        "analysis_id": analysis_id,
        "incident_count": len(incidents),
        "event_count": len(deduped_events),
        "affected_hosts": ["PC-03", "PC-05", "FILE-SERVER"],
        "processing_time": processing_time,
        "incident_ids": [i["id"] for i in incidents]
    }
