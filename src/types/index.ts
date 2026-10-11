export type Severity = "critical" | "high" | "medium" | "low" | "normal";

export type IncidentStatus = "New" | "Investigating" | "Contained" | "Resolved" | "False Positive";

export type AttackStage = 
  | "Initial Activity" 
  | "Execution" 
  | "Credential Access" 
  | "Discovery" 
  | "Lateral Movement" 
  | "Server Access" 
  | "Exfiltration";

export interface InvestigationNote {
  id: string;
  author: string;
  timestamp: string;
  content: string;
}

export interface EvidenceBookmark {
  id: string;
  eventId: string;
  description: string;
  addedBy: string;
  timestamp: string;
  severity: Severity;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  confidence: number; // 0-100
  initialHost: string;
  affectedHosts: string[];
  attackStage: AttackStage;
  hasLateralMovement: boolean;
  firstSeen: string;
  lastSeen: string;
  status: IncidentStatus;
  riskScore: number;
  assignedTo?: string;
  notes?: InvestigationNote[];
  evidenceBookmarks?: EvidenceBookmark[];
}

export type NodeType = "host" | "server" | "user" | "ip" | "domain" | "process";

export type RelationshipType = 
  | "AUTHENTICATED_TO" 
  | "CONNECTED_TO" 
  | "RESOLVED" 
  | "EXECUTED" 
  | "ACCESSED" 
  | "MOVED_TO";

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  status: "Compromised" | "Potentially Compromised" | "Suspicious" | "Normal" | "Target";
  risk: Severity;
  ip?: string;
  user?: string;
  os?: string;
  details?: string;
  isLateralPath?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationshipType: RelationshipType;
  timestamp: string;
  severity: Severity;
  isLateralPath?: boolean;
  label?: string;
}

export interface AttackGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  host: string;
  user: string;
  source: string;
  destination: string;
  eventType: string;
  rawEvent: string;
  normalizedEvent: string;
  detectionReason: string;
  mitreTechniqueId: string;
  mitreTechniqueName: string;
  severity: Severity;
}

export interface MitreTechniqueItem {
  id: string; // e.g. T1059.001
  name: string; // e.g. PowerShell
  tactic: string; // e.g. Execution
  evidence: string;
  affectedHosts: string[];
  confidence: number;
  eventsCount: number;
}

export interface LateralMovementStep {
  id: string;
  source: string;
  destination: string;
  timestamp: string;
  user: string;
  authType: string;
  evidence: string;
  risk: Severity;
  confidence: number;
}

export interface NextTarget {
  id: string;
  asset: string;
  priority: Severity;
  confidence: number;
  evidencePoints: string[];
  reasoning: string;
  riskScore: number;
  ip: string;
  role: string;
}

export interface HostDetails {
  hostname: string;
  ip: string;
  os: string;
  status: "Compromised" | "Potentially Compromised" | "Suspicious" | "Normal";
  risk: Severity;
  users: string[];
  processes: string[];
  inboundConnections: string[];
  outboundConnections: string[];
  dnsActivity: string[];
  authActivity: string[];
  mitreTechniques: string[];
  incidentInvolvement: string[];
}

export interface DashboardStats {
  totalEvents: number;
  activeIncidents: number;
  suspiciousHosts: number;
  lateralMovements: number;
  highRiskUsers: number;
  potentialNextTargets: number;
}

export interface IngestionLogFile {
  name: string;
  type: "authentication" | "dns" | "process" | "network";
  recordsCount: number;
  validSchema: boolean;
  sizeMb: number;
}
