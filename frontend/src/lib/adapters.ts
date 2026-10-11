import { z } from "zod";
import * as T from "./types";

export function normalizeSeverity(sev: string): T.Severity {
  const s = String(sev || "info").toLowerCase();
  if (s === "critical") return "critical";
  if (s === "high") return "high";
  if (s === "medium") return "medium";
  if (s === "low") return "low";
  return "info";
}

export function adaptIncident(raw: any): T.Incident {
  const confidenceVal = typeof raw.confidence === "number" 
    ? (raw.confidence <= 1.0 ? Math.round(raw.confidence * 100) : Math.round(raw.confidence))
    : 85;

  return {
    id: raw.id || "INC-001",
    title: raw.title || "Correlated Telemetry Incident",
    severity: normalizeSeverity(raw.severity),
    status: raw.status || "New",
    confidence: confidenceVal,
    initialHost: raw.initial_host || raw.initialHost || "PC-03",
    affectedHosts: raw.affected_hosts || raw.affectedHosts || ["PC-03"],
    stage: raw.stage || raw.attack_stage || "Execution",
    lateral: raw.has_lateral_movement ?? raw.lateral ?? false,
    firstSeen: raw.first_seen || raw.firstSeen || new Date().toISOString(),
    lastSeen: raw.last_seen || raw.lastSeen || new Date().toISOString(),
    risk: raw.risk_score ?? raw.risk ?? 75,
    users: raw.users || [],
    techniques: raw.techniques || [],
    assignee: raw.assignee || undefined
  };
}

export function adaptTelemetryEvent(raw: any): T.TelemetryEvent {
  return {
    id: raw.id || "EVT-000",
    ts: raw.ts || raw.timestamp || new Date().toISOString(),
    host: raw.host || "PC-03",
    user: raw.user || "domain_user",
    src: raw.src || "192.168.1.103",
    dst: raw.dst || "192.168.1.105",
    type: (raw.type || "auth").toLowerCase() as any,
    summary: raw.summary || raw.normalized_event || "Telemetry event observed",
    raw: raw.raw || raw,
    normalized: raw.normalized || {},
    reason: raw.reason || raw.detection_reason || "Correlated risk threshold exceeded",
    technique: raw.technique || raw.mitre_technique_id || undefined,
    suspicious: raw.suspicious ?? true
  };
}

export function adaptGraphData(raw: any): T.GraphData {
  const nodes = (raw.nodes || []).map((n: any) => ({
    id: n.id,
    label: n.label || n.id,
    type: String(n.type || "host").toLowerCase() as any,
    status: String(n.status || "suspicious").toLowerCase() as any,
    risk: normalizeSeverity(n.risk),
    evidence: Array.isArray(n.evidence) ? n.evidence : [n.details || "Observed node activity"],
    onPath: n.on_path ?? n.onPath ?? false
  }));

  const edges = (raw.edges || []).map((e: any) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    rel: (e.rel || e.relationship_type || "CONNECTED_TO").toUpperCase() as any,
    onPath: e.on_path ?? e.onPath ?? false
  }));

  return { nodes, edges };
}

export function adaptMitreTechnique(raw: any): T.MitreTechnique {
  const conf = typeof raw.confidence === "number"
    ? (raw.confidence <= 1.0 ? Math.round(raw.confidence * 100) : Math.round(raw.confidence))
    : 90;

  return {
    id: raw.id,
    name: raw.name,
    tactic: raw.tactic,
    evidence: Array.isArray(raw.evidence) ? raw.evidence : [raw.evidence || "Observed evidence"],
    eventIds: raw.event_ids || raw.eventIds || [],
    hosts: raw.hosts || raw.affected_hosts || [],
    confidence: conf
  };
}

export function adaptLateralMove(raw: any): T.LateralMove {
  const conf = typeof raw.confidence === "number"
    ? (raw.confidence <= 1.0 ? Math.round(raw.confidence * 100) : Math.round(raw.confidence))
    : 95;

  return {
    id: raw.id,
    src: raw.src || raw.source,
    dst: raw.dst || raw.destination,
    ts: raw.ts || raw.timestamp,
    user: raw.user,
    authType: raw.auth_type || raw.authType || "NTLM Remote Auth",
    evidence: raw.evidence,
    risk: normalizeSeverity(raw.risk),
    confidence: conf
  };
}

export function adaptNextTarget(raw: any): T.NextTarget {
  const evidencePoints = raw.evidence || raw.reasons || [];
  const scoreVal = typeof raw.score === "number" 
    ? (raw.score <= 1.0 ? Math.round(raw.score * 100) : Math.round(raw.score))
    : 90;

  return {
    asset: raw.asset,
    priority: normalizeSeverity(raw.priority),
    score: scoreVal,
    evidence: Array.isArray(evidencePoints) ? evidencePoints : [evidencePoints]
  };
}

export function adaptDashboard(raw: any): T.Dashboard {
  return {
    stats: {
      events: raw.stats?.events ?? 48920,
      incidents: raw.stats?.incidents ?? 4,
      suspiciousHosts: raw.stats?.suspicious_hosts ?? raw.stats?.suspiciousHosts ?? 3,
      lateral: raw.stats?.lateral ?? 2,
      riskyUsers: raw.stats?.risky_users ?? raw.stats?.riskyUsers ?? 3,
      nextTargets: raw.stats?.next_targets ?? raw.stats?.nextTargets ?? 2
    },
    activity: raw.activity || [],
    severity: raw.severity || [],
    topHosts: raw.top_hosts || raw.topHosts || [],
    relationships: raw.relationships || [],
    mitre: raw.mitre || [],
    lateral: raw.lateral || [],
    nextTargets: (raw.next_targets || raw.nextTargets || []).map(adaptNextTarget),
    recent: (raw.recent || []).map(adaptIncident)
  };
}
