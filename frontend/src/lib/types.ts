export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type IncidentStatus = "New" | "Investigating" | "Contained" | "Resolved" | "False Positive";
export interface Incident { id: string; title: string; severity: Severity; status: IncidentStatus; confidence: number; initialHost: string; affectedHosts: string[]; stage: string; lateral: boolean; firstSeen: string; lastSeen: string; risk: number; users: string[]; techniques: string[]; assignee?: string }
export interface TelemetryEvent { id: string; ts: string; host: string; user: string; src: string; dst: string; type: "dns" | "auth" | "process" | "network"; summary: string; raw: Record<string, unknown>; normalized: Record<string, unknown>; reason: string; technique?: string; suspicious: boolean }
export interface Paged<T> { items: T[]; page: number; pageSize: number; total: number }
export interface GraphNode { id: string; label: string; type: "host" | "server" | "user" | "ip" | "domain" | "process"; status: "compromised" | "suspicious" | "at-risk" | "normal"; risk: Severity; evidence: string[]; onPath?: boolean }
export interface GraphEdge { id: string; source: string; target: string; rel: "AUTHENTICATED_TO" | "CONNECTED_TO" | "RESOLVED" | "EXECUTED" | "ACCESSED" | "MOVED_TO"; onPath?: boolean }
export interface GraphData { nodes: GraphNode[]; edges: GraphEdge[] }
export interface MitreTechnique { id: string; name: string; tactic: string; evidence: string[]; eventIds: string[]; hosts: string[]; confidence: number }
export interface LateralMove { id: string; src: string; dst: string; ts: string; user: string; authType: string; evidence: string; risk: Severity; confidence: number }
export interface NextTarget { asset: string; priority: Severity; score: number; evidence: string[] }
export interface HostInfo { name: string; ip: string; os: string; status: "compromised" | "suspicious" | "at-risk" | "normal"; risk: Severity; users: string[]; processes: string[]; inbound: string[]; outbound: string[]; dns: string[]; auth: string[]; techniques: string[]; incidents: string[] }
export interface Dashboard { stats: { events: number; incidents: number; suspiciousHosts: number; lateral: number; riskyUsers: number; nextTargets: number }; activity: { t: string; events: number; suspicious: number }[]; severity: { name: string; value: number }[]; topHosts: { host: string; score: number }[]; relationships: { src: string; dst: string; count: number }[]; mitre: { id: string; name: string; count: number }[]; lateral: { from: string; to: string; time: string }[]; nextTargets: NextTarget[]; recent: Incident[] }
export interface IncidentReport { incident: Incident; generatedAt: string; summary: string; actions: string[] }
