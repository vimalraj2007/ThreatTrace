import type * as T from "./types";
const D = "2026-09-29T";
const at = (t: string) => `${D}${t}Z`;
export const incidents: T.Incident[] = [
  { id: "INC-001", title: "Multi-stage lateral movement detected", severity: "critical", status: "Investigating", confidence: 92, initialHost: "PC-03", affectedHosts: ["PC-03", "PC-05", "FILE-SERVER"], stage: "Server Access", lateral: true, firstSeen: at("10:01:22"), lastSeen: at("10:09:50"), risk: 94, users: ["j.doe", "svc-backup"], techniques: ["T1566.001", "T1059.001", "T1003.001", "T1021.002"], assignee: "R. Menon" },
  { id: "INC-002", title: "Suspicious DNS beaconing from workstation", severity: "high", status: "New", confidence: 71, initialHost: "WS-11", affectedHosts: ["WS-11"], stage: "Command & Control", lateral: false, firstSeen: at("08:12:04"), lastSeen: at("08:58:31"), risk: 68, users: ["a.khan"], techniques: ["T1071.004"] },
  { id: "INC-003", title: "Repeated failed logons followed by success", severity: "medium", status: "Contained", confidence: 63, initialHost: "WS-14", affectedHosts: ["WS-14", "PRINT-01"], stage: "Credential Access", lateral: false, firstSeen: at("06:40:10"), lastSeen: at("06:55:02"), risk: 47, users: ["m.rao"], techniques: ["T1110.003"] },
  { id: "INC-004", title: "Unsigned binary spawned from Office", severity: "low", status: "False Positive", confidence: 38, initialHost: "WS-14", affectedHosts: ["WS-14"], stage: "Execution", lateral: false, firstSeen: at("05:02:44"), lastSeen: at("05:02:59"), risk: 21, users: ["m.rao"], techniques: ["T1204.002"] },
];
const key: [string, string, string, string, T.TelemetryEvent["type"], string, string, string, string?][] = [
  ["10:01:22", "PC-03", "j.doe", "10.0.3.13", "dns", "DNS request PC-03 → update-cdn-sync.com", "Newly registered domain with high-entropy subdomain", "T1071.004"],
  ["10:03:11", "PC-03", "j.doe", "PC-03", "process", "winword.exe → powershell.exe -enc …", "Office application spawned encoded PowerShell", "T1059.001"],
  ["10:05:43", "PC-03", "j.doe", "PC-03", "process", "rundll32.exe accessed lsass.exe memory", "Process opened LSASS with read access (credential dumping pattern)", "T1003.001"],
  ["10:07:20", "PC-05", "svc-backup", "PC-03", "auth", "Network logon PC-03 → PC-05 (svc-backup)", "Service account logon from workstation never seen before", "T1021.002"],
  ["10:09:50", "FILE-SERVER", "svc-backup", "PC-05", "auth", "SMB remote access PC-05 → FILE-SERVER", "Same account chained to second host within 3 minutes", "T1021.002"],
];
const hostsPool = ["WS-11", "WS-14", "PRINT-01", "PC-01", "PC-02", "PC-04", "APP-02", "DB-01"];
const filler: T.TelemetryEvent[] = Array.from({ length: 240 }, (_, i) => {
  const h = hostsPool[i % hostsPool.length]; const m = String(i % 60).padStart(2, "0"); const type = (["dns", "auth", "process", "network"] as const)[i % 4];
  const s = { dns: `DNS request ${h} → microsoft.com`, auth: `Interactive logon on ${h}`, process: `chrome.exe started on ${h}`, network: `${h} → 10.0.9.4:443` }[type];
  return { id: `EVT-${String(1000 + i)}`, ts: at(`09:${m}:${String((i * 7) % 60).padStart(2, "0")}`), host: h, user: "u" + (i % 9), src: h, dst: "10.0.9.4", type, summary: s, raw: { line: s, seq: i }, normalized: { type, host: h }, reason: "Baseline activity", suspicious: false };
});
export const events: T.TelemetryEvent[] = [
  ...key.map((k, i) => ({ id: `EVT-${String(4001 + i)}`, ts: at(k[0]), host: k[1], user: k[2], src: k[3], dst: k[1], type: k[4], summary: k[5], raw: { EventTime: at(k[0]), Computer: k[1], Account: k[2], Message: k[5] }, normalized: { type: k[4], host: k[1], user: k[2], src: k[3], technique: k[7] }, reason: k[6], technique: k[7], suspicious: true })),
  ...filler,
].sort((a, b) => a.ts.localeCompare(b.ts));
const N = (id: string, label: string, type: T.GraphNode["type"], status: T.GraphNode["status"], risk: T.Severity, evidence: string[], onPath = false): T.GraphNode => ({ id, label, type, status, risk, evidence, onPath });
const E = (s: string, r: T.GraphEdge["rel"], t: string, onPath = false): T.GraphEdge => ({ id: `${s}-${r}-${t}`, source: s, target: t, rel: r, onPath });
export const graph: T.GraphData = {
  nodes: [
    N("PC-03", "PC-03", "host", "compromised", "critical", ["Contacted suspicious domain", "Encoded PowerShell from winword.exe", "LSASS memory access"], true),
    N("PC-05", "PC-05", "host", "compromised", "high", ["Remote authentication", "Suspicious PowerShell", "Credential-related event", "Connection from PC-03"], true),
    N("FILE-SERVER", "FILE-SERVER", "server", "compromised", "high", ["SMB access from PC-05 using svc-backup"], true),
    N("DOMAIN-CONTROLLER", "DOMAIN-CONTROLLER", "server", "at-risk", "medium", ["High-value asset", "Auth relationship with FILE-SERVER"]),
    N("WS-11", "WS-11", "host", "normal", "low", []), N("PRINT-01", "PRINT-01", "host", "normal", "low", []),
    N("j.doe", "j.doe", "user", "suspicious", "high", ["Owner of session on PC-03"]),
    N("svc-backup", "svc-backup", "user", "suspicious", "high", ["Used for logon to PC-05 and FILE-SERVER"], true),
    N("10.0.3.13", "10.0.3.13", "ip", "normal", "low", []),
    N("update-cdn-sync.com", "update-cdn-sync.com", "domain", "suspicious", "high", ["Registered 3 days ago", "High-entropy subdomains"]),
    N("microsoft.com", "microsoft.com", "domain", "normal", "info", []),
    N("powershell.exe", "powershell.exe", "process", "suspicious", "high", ["Parent: winword.exe", "Encoded command line"]),
    N("winword.exe", "winword.exe", "process", "normal", "low", []),
  ],
  edges: [
    E("PC-03", "RESOLVED", "update-cdn-sync.com"), E("PC-03", "RESOLVED", "microsoft.com"), E("PC-03", "CONNECTED_TO", "10.0.3.13"),
    E("winword.exe", "EXECUTED", "powershell.exe"), E("PC-03", "EXECUTED", "winword.exe"), E("j.doe", "AUTHENTICATED_TO", "PC-03"),
    E("PC-03", "MOVED_TO", "PC-05", true), E("PC-05", "MOVED_TO", "FILE-SERVER", true), E("svc-backup", "AUTHENTICATED_TO", "PC-05", true),
    E("svc-backup", "ACCESSED", "FILE-SERVER", true), E("FILE-SERVER", "CONNECTED_TO", "DOMAIN-CONTROLLER"), E("WS-11", "CONNECTED_TO", "FILE-SERVER"), E("PRINT-01", "CONNECTED_TO", "FILE-SERVER"),
  ],
};
export const mitre: T.MitreTechnique[] = [
  { id: "T1071.004", name: "Application Layer Protocol: DNS", tactic: "Command and Control", evidence: ["PC-03 → update-cdn-sync.com (high-entropy subdomains)"], eventIds: ["EVT-4001"], hosts: ["PC-03"], confidence: 78 },
  { id: "T1059.001", name: "PowerShell", tactic: "Execution", evidence: ["winword.exe → powershell.exe -enc"], eventIds: ["EVT-4002"], hosts: ["PC-03"], confidence: 91 },
  { id: "T1003.001", name: "OS Credential Dumping: LSASS Memory", tactic: "Credential Access", evidence: ["rundll32.exe opened lsass.exe"], eventIds: ["EVT-4003"], hosts: ["PC-03"], confidence: 84 },
  { id: "T1021.002", name: "Remote Services: SMB/Windows Admin Shares", tactic: "Lateral Movement", evidence: ["svc-backup logon PC-03 → PC-05", "SMB PC-05 → FILE-SERVER"], eventIds: ["EVT-4004", "EVT-4005"], hosts: ["PC-05", "FILE-SERVER"], confidence: 88 },
];
export const lateral: T.LateralMove[] = [
  { id: "LM-1", src: "PC-03", dst: "PC-05", ts: at("10:07:20"), user: "svc-backup", authType: "Network logon (NTLM)", evidence: "First logon by this account from PC-03; follows LSASS access", risk: "high", confidence: 89 },
  { id: "LM-2", src: "PC-05", dst: "FILE-SERVER", ts: at("10:09:50"), user: "svc-backup", authType: "SMB session (Kerberos)", evidence: "Same account, 2m30s later, admin share access", risk: "high", confidence: 86 },
];
export const nextTargets: T.NextTarget[] = [
  { asset: "DOMAIN-CONTROLLER", priority: "high", score: 82, evidence: ["Connected to compromised host", "Recent authentication relationship", "High-value asset", "Similar movement path", "Suspicious activity nearby"] },
  { asset: "DB-01", priority: "medium", score: 54, evidence: ["Shares service account with FILE-SERVER", "High-value data asset"] },
  { asset: "APP-02", priority: "low", score: 31, evidence: ["Same subnet as PC-05"] },
];
export const hosts: T.HostInfo[] = [
  { name: "PC-03", ip: "10.0.3.13", os: "Windows 11 Enterprise", status: "compromised", risk: "critical", users: ["j.doe"], processes: ["winword.exe", "powershell.exe", "rundll32.exe"], inbound: [], outbound: ["update-cdn-sync.com", "PC-05"], dns: ["update-cdn-sync.com", "microsoft.com"], auth: ["j.doe interactive"], techniques: ["T1071.004", "T1059.001", "T1003.001"], incidents: ["INC-001"] },
  { name: "PC-05", ip: "10.0.3.15", os: "Windows 11 Enterprise", status: "compromised", risk: "high", users: ["svc-backup"], processes: ["powershell.exe"], inbound: ["PC-03"], outbound: ["FILE-SERVER"], dns: ["microsoft.com"], auth: ["svc-backup network logon"], techniques: ["T1021.002"], incidents: ["INC-001"] },
  { name: "FILE-SERVER", ip: "10.0.1.20", os: "Windows Server 2022", status: "compromised", risk: "high", users: ["svc-backup"], processes: ["svchost.exe"], inbound: ["PC-05", "WS-11", "PRINT-01"], outbound: ["DOMAIN-CONTROLLER"], dns: [], auth: ["svc-backup SMB"], techniques: ["T1021.002"], incidents: ["INC-001"] },
  { name: "DOMAIN-CONTROLLER", ip: "10.0.1.5", os: "Windows Server 2022", status: "at-risk", risk: "medium", users: ["Administrator"], processes: ["lsass.exe"], inbound: ["FILE-SERVER"], outbound: [], dns: [], auth: ["Kerberos TGS"], techniques: [], incidents: ["INC-001"] },
  { name: "WS-11", ip: "10.0.4.11", os: "Windows 10", status: "suspicious", risk: "high", users: ["a.khan"], processes: ["chrome.exe"], inbound: [], outbound: ["FILE-SERVER"], dns: ["cdn-metrics-x.net"], auth: [], techniques: ["T1071.004"], incidents: ["INC-002"] },
  { name: "WS-14", ip: "10.0.4.14", os: "Windows 10", status: "normal", risk: "low", users: ["m.rao"], processes: ["excel.exe"], inbound: [], outbound: [], dns: [], auth: [], techniques: [], incidents: ["INC-003", "INC-004"] },
  { name: "PRINT-01", ip: "10.0.2.9", os: "Windows Server 2019", status: "normal", risk: "low", users: [], processes: [], inbound: [], outbound: ["FILE-SERVER"], dns: [], auth: [], techniques: [], incidents: ["INC-003"] },
];
export const dashboard = (): T.Dashboard => ({
  stats: { events: 10690, incidents: incidents.length, suspiciousHosts: 5, lateral: 2, riskyUsers: 3, nextTargets: nextTargets.length },
  activity: Array.from({ length: 12 }, (_, i) => ({ t: `${String(i + 1).padStart(2, "0")}:00`, events: 300 + ((i * 137) % 400), suspicious: i === 5 ? 9 : i === 9 ? 38 : (i * 3) % 7 })),
  severity: [{ name: "Critical", value: 1 }, { name: "High", value: 1 }, { name: "Medium", value: 1 }, { name: "Low", value: 1 }],
  topHosts: hosts.filter((h) => h.status !== "normal").map((h, i) => ({ host: h.name, score: 96 - i * 14 })),
  relationships: [{ src: "PC-03", dst: "PC-05", count: 14 }, { src: "PC-05", dst: "FILE-SERVER", count: 9 }, { src: "FILE-SERVER", dst: "DOMAIN-CONTROLLER", count: 6 }],
  mitre: mitre.map((m, i) => ({ id: m.id, name: m.name.split(":")[0], count: 12 - i * 3 })),
  lateral: lateral.map((l) => ({ from: l.src, to: l.dst, time: l.ts })),
  nextTargets, recent: incidents,
});
export const attackProgress = ["Initial Activity", "Execution", "Credential Access", "Discovery", "Lateral Movement", "Server Access"];
