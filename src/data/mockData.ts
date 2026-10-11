import { 
  Incident, 
  AttackGraphData, 
  TimelineEvent, 
  MitreTechniqueItem, 
  LateralMovementStep, 
  NextTarget, 
  HostDetails, 
  DashboardStats 
} from "@/types";

export const initialStats: DashboardStats = {
  totalEvents: 48920,
  activeIncidents: 4,
  suspiciousHosts: 3,
  lateralMovements: 2,
  highRiskUsers: 3,
  potentialNextTargets: 2,
};

export const mockIncidents: Incident[] = [
  {
    id: "INC-001",
    title: "Multi-stage lateral movement & privilege escalation",
    description: "Correlated telemetry indicates initial DNS beaconing on PC-03 followed by encoded PowerShell execution, LSASS memory dumping, remote NTLM authentication to PC-05, and lateral SMB access to FILE-SERVER.",
    severity: "critical",
    confidence: 96,
    initialHost: "PC-03",
    affectedHosts: ["PC-03", "PC-05", "FILE-SERVER"],
    attackStage: "Server Access",
    hasLateralMovement: true,
    firstSeen: "2026-09-30T10:01:22Z",
    lastSeen: "2026-09-30T10:14:05Z",
    status: "Investigating",
    riskScore: 94,
    assignedTo: "Analyst Sarah Connor (Tier 3)",
    notes: [
      {
        id: "note-1",
        author: "Sarah Connor",
        timestamp: "2026-09-30T10:25:00Z",
        content: "Isolated PC-03 network interface. Verified suspicious DNS queries to suspicious-domain.com resolving to C2 IP 185.220.101.5."
      },
      {
        id: "note-2",
        author: "Alex Rivera",
        timestamp: "2026-09-30T10:32:00Z",
        content: "FILE-SERVER SMB sessions audited. Active SMB connection established from PC-05 using compromised domain_user_alpha credential."
      }
    ],
    evidenceBookmarks: [
      {
        id: "ev-1",
        eventId: "EVT-1002",
        description: "Encoded PowerShell string with WebClient download payload",
        addedBy: "Sarah Connor",
        timestamp: "2026-09-30T10:03:11Z",
        severity: "critical"
      },
      {
        id: "ev-2",
        eventId: "EVT-1003",
        description: "LSASS Process Memory Read (Event ID 10 / Sysmon)",
        addedBy: "Alex Rivera",
        timestamp: "2026-09-30T10:05:43Z",
        severity: "high"
      }
    ]
  },
  {
    id: "INC-002",
    title: "Ransomware staging on backup server",
    description: "Suspicious shadow copy deletion commands (vssadmin delete shadows) and bulk file rename patterns detected on SRV-BACKUP-01.",
    severity: "high",
    confidence: 89,
    initialHost: "SRV-BACKUP-01",
    affectedHosts: ["SRV-BACKUP-01"],
    attackStage: "Execution",
    hasLateralMovement: false,
    firstSeen: "2026-09-30T09:45:10Z",
    lastSeen: "2026-09-30T09:52:33Z",
    status: "New",
    riskScore: 82,
    assignedTo: "Unassigned"
  },
  {
    id: "INC-003",
    title: "DNS Tunneling & Data Exfiltration",
    description: "Abnormal volume of high-entropy TXT record DNS requests originating from FIN-LAPTOP-12 to external domain exfil-data-cloud.net.",
    severity: "medium",
    confidence: 84,
    initialHost: "FIN-LAPTOP-12",
    affectedHosts: ["FIN-LAPTOP-12"],
    attackStage: "Exfiltration",
    hasLateralMovement: false,
    firstSeen: "2026-09-30T08:12:00Z",
    lastSeen: "2026-09-30T09:15:00Z",
    status: "Investigating",
    riskScore: 68,
    assignedTo: "Analyst Mark Vance"
  },
  {
    id: "INC-004",
    title: "Suspicious Privilege Escalation via Token Manipulation",
    description: "SeDebugPrivilege assignment and process injection into winlogon.exe observed on DEV-WORKSTATION-09.",
    severity: "low",
    confidence: 72,
    initialHost: "DEV-WORKSTATION-09",
    affectedHosts: ["DEV-WORKSTATION-09"],
    attackStage: "Credential Access",
    hasLateralMovement: false,
    firstSeen: "2026-09-30T07:30:15Z",
    lastSeen: "2026-09-30T07:45:20Z",
    status: "Resolved",
    riskScore: 45,
    assignedTo: "Analyst Sarah Connor"
  }
];

export const mockGraphData: AttackGraphData = {
  nodes: [
    {
      id: "PC-03",
      label: "PC-03 (Workstation)",
      type: "host",
      status: "Compromised",
      risk: "critical",
      ip: "192.168.1.103",
      user: "domain_user_alpha",
      os: "Windows 11 Enterprise",
      details: "Initial infection host via malicious document execution",
      isLateralPath: true
    },
    {
      id: "PC-05",
      label: "PC-05 (Workstation)",
      type: "host",
      status: "Compromised",
      risk: "high",
      ip: "192.168.1.105",
      user: "domain_user_alpha",
      os: "Windows 11 Enterprise",
      details: "Secondary host accessed via remote NTLM authentication",
      isLateralPath: true
    },
    {
      id: "FILE-SERVER",
      label: "FILE-SERVER (Storage)",
      type: "server",
      status: "Compromised",
      risk: "critical",
      ip: "192.168.1.200",
      user: "svc_backup",
      os: "Windows Server 2022",
      details: "Enterprise File Server accessed via SMB admin shares",
      isLateralPath: true
    },
    {
      id: "DOMAIN-CONTROLLER",
      label: "DOMAIN-CONTROLLER (Active Directory)",
      type: "server",
      status: "Target",
      risk: "critical",
      ip: "192.168.1.10",
      user: "SYSTEM / Domain Admin",
      os: "Windows Server 2022 Datacenter",
      details: "Primary Domain Controller - Anticipated Next Attack Target",
      isLateralPath: false
    },
    {
      id: "suspicious-domain.com",
      label: "suspicious-domain.com",
      type: "domain",
      status: "Suspicious",
      risk: "high",
      details: "C2 Infrastructure domain queried during initial beacon",
      isLateralPath: true
    },
    {
      id: "powershell.exe",
      label: "powershell.exe (PID 4920)",
      type: "process",
      status: "Compromised",
      risk: "critical",
      details: "Encoded powershell execution payload launched by winword.exe",
      isLateralPath: true
    },
    {
      id: "domain_user_alpha",
      label: "domain_user_alpha",
      type: "user",
      status: "Compromised",
      risk: "high",
      details: "Compromised domain user credentials used for lateral movement",
      isLateralPath: true
    },
    {
      id: "185.220.101.5",
      label: "185.220.101.5 (External C2 IP)",
      type: "ip",
      status: "Suspicious",
      risk: "high",
      details: "External Command & Control IP address",
      isLateralPath: false
    },
    {
      id: "SRV-BACKUP-01",
      label: "SRV-BACKUP-01",
      type: "server",
      status: "Suspicious",
      risk: "high",
      ip: "192.168.1.250",
      user: "svc_backup",
      os: "Windows Server 2019",
      details: "Backup server with shadow copy deletion alerts",
      isLateralPath: false
    }
  ],
  edges: [
    {
      id: "edge-1",
      source: "PC-03",
      target: "suspicious-domain.com",
      relationshipType: "RESOLVED",
      timestamp: "2026-09-30T10:01:22Z",
      severity: "high",
      isLateralPath: true,
      label: "DNS Query (UDP 53)"
    },
    {
      id: "edge-2",
      source: "suspicious-domain.com",
      target: "185.220.101.5",
      relationshipType: "CONNECTED_TO",
      timestamp: "2026-09-30T10:01:25Z",
      severity: "high",
      isLateralPath: false,
      label: "HTTPS Beacon (TCP 443)"
    },
    {
      id: "edge-3",
      source: "PC-03",
      target: "powershell.exe",
      relationshipType: "EXECUTED",
      timestamp: "2026-09-30T10:03:11Z",
      severity: "critical",
      isLateralPath: true,
      label: "Spawned Process (PID 4920)"
    },
    {
      id: "edge-4",
      source: "powershell.exe",
      target: "domain_user_alpha",
      relationshipType: "ACCESSED",
      timestamp: "2026-09-30T10:05:43Z",
      severity: "critical",
      isLateralPath: true,
      label: "LSASS Credential Harvest"
    },
    {
      id: "edge-5",
      source: "PC-03",
      target: "PC-05",
      relationshipType: "AUTHENTICATED_TO",
      timestamp: "2026-09-30T10:07:20Z",
      severity: "critical",
      isLateralPath: true,
      label: "NTLM Remote Auth (Port 445)"
    },
    {
      id: "edge-6",
      source: "PC-05",
      target: "FILE-SERVER",
      relationshipType: "MOVED_TO",
      timestamp: "2026-09-30T10:09:50Z",
      severity: "critical",
      isLateralPath: true,
      label: "SMB/WinRM Remote Admin"
    },
    {
      id: "edge-7",
      source: "FILE-SERVER",
      target: "DOMAIN-CONTROLLER",
      relationshipType: "CONNECTED_TO",
      timestamp: "2026-09-30T10:14:05Z",
      severity: "high",
      isLateralPath: false,
      label: "LDAP Recon Query (Port 389)"
    }
  ]
};

export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: "EVT-1001",
    timestamp: "2026-09-30T10:01:22Z",
    host: "PC-03",
    user: "domain_user_alpha",
    source: "192.168.1.103:54210",
    destination: "suspicious-domain.com:53",
    eventType: "DNS Query",
    rawEvent: '{"EventID": 22, "QueryName": "suspicious-domain.com", "QueryType": "A", "ClientIP": "192.168.1.103", "ProcessPath": "C:\\\\Windows\\\\System32\\\\svchost.exe"}',
    normalizedEvent: "DNS lookup for high-risk external C2 domain suspicious-domain.com",
    detectionReason: "Domain categorized as active C2 infrastructure in threat intel feeds",
    mitreTechniqueId: "T1071.001",
    mitreTechniqueName: "Web Protocols / C2",
    severity: "high"
  },
  {
    id: "EVT-1002",
    timestamp: "2026-09-30T10:03:11Z",
    host: "PC-03",
    user: "domain_user_alpha",
    source: "PC-03 (winword.exe)",
    destination: "PC-03 (powershell.exe)",
    eventType: "Process Spawn",
    rawEvent: '{"EventID": 1, "ParentImage": "C:\\\\Program Files\\\\Microsoft Office\\\\root\\\\Office16\\\\WINWORD.EXE", "Image": "C:\\\\Windows\\\\System32\\\\WindowsPowerShell\\\\v1.0\\\\powershell.exe", "CommandLine": "powershell.exe -e SGVsbG8gV29ybGQ..."}',
    normalizedEvent: "Microsoft Word spawned obfuscated base64 PowerShell command",
    detectionReason: "Suspicious child process spawned by Office application executing base64 payload",
    mitreTechniqueId: "T1059.001",
    mitreTechniqueName: "PowerShell",
    severity: "critical"
  },
  {
    id: "EVT-1003",
    timestamp: "2026-09-30T10:05:43Z",
    host: "PC-03",
    user: "domain_user_alpha",
    source: "powershell.exe (PID 4920)",
    destination: "lsass.exe (PID 672)",
    eventType: "Process Memory Access",
    rawEvent: '{"EventID": 10, "SourceImage": "C:\\\\Windows\\\\System32\\\\WindowsPowerShell\\\\v1.0\\\\powershell.exe", "TargetImage": "C:\\\\Windows\\\\System32\\\\lsass.exe", "GrantedAccess": "0x1010"}',
    normalizedEvent: "PowerShell requested PROCESS_VM_READ access right against LSASS process memory",
    detectionReason: "Unusual process memory read attempt against Local Security Authority Subsystem Service",
    mitreTechniqueId: "T1003.001",
    mitreTechniqueName: "LSASS Memory Dumping",
    severity: "critical"
  },
  {
    id: "EVT-1004",
    timestamp: "2026-09-30T10:07:20Z",
    host: "PC-05",
    user: "domain_user_alpha",
    source: "192.168.1.103 (PC-03)",
    destination: "192.168.1.105 (PC-05)",
    eventType: "Network Authentication",
    rawEvent: '{"EventID": 4624, "LogonType": 3, "AuthenticationPackage": "NTLM", "WorkstationName": "PC-03", "IpAddress": "192.168.1.103", "TargetUserName": "domain_user_alpha"}',
    normalizedEvent: "Network Logon (Type 3) from PC-03 to PC-05 using NTLM authentication",
    detectionReason: "Anomalous workstation-to-workstation NTLM authentication across distinct VLANs",
    mitreTechniqueId: "T1021.002",
    mitreTechniqueName: "SMB/Windows Admin Shares",
    severity: "critical"
  },
  {
    id: "EVT-1005",
    timestamp: "2026-09-30T10:09:50Z",
    host: "FILE-SERVER",
    user: "svc_backup",
    source: "192.168.1.105 (PC-05)",
    destination: "192.168.1.200 (FILE-SERVER)",
    eventType: "Remote Service Execution",
    rawEvent: '{"EventID": 5145, "ShareName": "\\\\\\\\FILE-SERVER\\\\ADMIN$", "RelativeTargetName": "PSEXESVC.exe", "AccessMask": "0x2", "IpAddress": "192.168.1.105"}',
    normalizedEvent: "Remote admin share ADMIN$ write access and service registration from PC-05 to FILE-SERVER",
    detectionReason: "Privileged administrator share write activity from compromised workstation",
    mitreTechniqueId: "T1021.002",
    mitreTechniqueName: "Lateral Movement via Remote Administrative Share",
    severity: "critical"
  },
  {
    id: "EVT-1006",
    timestamp: "2026-09-30T10:14:05Z",
    host: "DOMAIN-CONTROLLER",
    user: "svc_backup",
    source: "192.168.1.200 (FILE-SERVER)",
    destination: "192.168.1.10 (DOMAIN-CONTROLLER)",
    eventType: "Active Directory LDAP Query",
    rawEvent: '{"EventID": 1644, "LDAPFilter": "(&(objectCategory=person)(objectClass=user)(adminCount=1))", "ClientIP": "192.168.1.200", "AttributeList": "sAMAccountName,memberOf"}',
    normalizedEvent: "High-volume LDAP search query inspecting Domain Admin group memberships",
    detectionReason: "Reconnaissance query identifying domain privileged accounts executed from FILE-SERVER",
    mitreTechniqueId: "T1087.002",
    mitreTechniqueName: "Domain Account Discovery",
    severity: "high"
  }
];

export const mockMitreTechniques: MitreTechniqueItem[] = [
  {
    id: "T1059.001",
    name: "PowerShell",
    tactic: "Execution",
    evidence: "winword.exe → powershell.exe -EncodedCommand payload execution",
    affectedHosts: ["PC-03"],
    confidence: 98,
    eventsCount: 3
  },
  {
    id: "T1003.001",
    name: "OS Credential Dumping: LSASS Memory",
    tactic: "Credential Access",
    evidence: "PROCESS_VM_READ access handle requested on lsass.exe by PID 4920",
    affectedHosts: ["PC-03"],
    confidence: 94,
    eventsCount: 2
  },
  {
    id: "T1021.002",
    name: "Remote Services: SMB/Windows Admin Shares",
    tactic: "Lateral Movement",
    evidence: "Workstation-to-workstation NTLM auth (PC-03 → PC-05) and ADMIN$ share write (PC-05 → FILE-SERVER)",
    affectedHosts: ["PC-03", "PC-05", "FILE-SERVER"],
    confidence: 96,
    eventsCount: 5
  },
  {
    id: "T1071.001",
    name: "Application Layer Protocol: Web Protocols",
    tactic: "Command and Control",
    evidence: "Periodic beaconing queries to C2 domain suspicious-domain.com",
    affectedHosts: ["PC-03"],
    confidence: 88,
    eventsCount: 12
  },
  {
    id: "T1087.002",
    name: "Account Discovery: Domain Account",
    tactic: "Discovery",
    evidence: "LDAP filter query for adminCount=1 from FILE-SERVER to DOMAIN-CONTROLLER",
    affectedHosts: ["FILE-SERVER", "DOMAIN-CONTROLLER"],
    confidence: 90,
    eventsCount: 4
  }
];

export const mockLateralMovementSteps: LateralMovementStep[] = [
  {
    id: "lm-1",
    source: "PC-03 (192.168.1.103)",
    destination: "PC-05 (192.168.1.105)",
    timestamp: "2026-09-30 10:07:20",
    user: "domain_user_alpha",
    authType: "NTLM Remote Network Logon (Type 3)",
    evidence: "Anomalous lateral logon across desktop VLAN subnets; credential harvested via LSASS memory read on PC-03.",
    risk: "critical",
    confidence: 95
  },
  {
    id: "lm-2",
    source: "PC-05 (192.168.1.105)",
    destination: "FILE-SERVER (192.168.1.200)",
    timestamp: "2026-09-30 10:09:50",
    user: "svc_backup",
    authType: "WinRM / SMB Admin Share Access (ADMIN$)",
    evidence: "Remote service payload creation (PSEXESVC.exe) written to ADMIN$ share using stolen service account privileges.",
    risk: "critical",
    confidence: 98
  }
];

export const mockNextTargets: NextTarget[] = [
  {
    id: "nt-1",
    asset: "DOMAIN-CONTROLLER",
    priority: "critical",
    confidence: 92,
    ip: "192.168.1.10",
    role: "Primary Active Directory Domain Controller",
    riskScore: 98,
    evidencePoints: [
      "Active LDAP domain administrative account enumeration observed from compromised FILE-SERVER",
      "Recent Kerberos ticket requests (TGS) for krbtgt service principal from FILE-SERVER",
      "High-value asset holding central Active Directory NTDS.dit password database",
      "Correlated path matches historic Golden Ticket / DCSync attack patterns",
      "Direct network connectivity open between FILE-SERVER and DOMAIN-CONTROLLER on ports 389/88/445"
    ],
    reasoning: "Having established administrative control over FILE-SERVER using service account credentials, the adversary is performing LDAP reconnaissance specifically targeting domain administrative rights to execute DCSync against DOMAIN-CONTROLLER."
  },
  {
    id: "nt-2",
    asset: "SRV-BACKUP-VAULT",
    priority: "high",
    confidence: 81,
    ip: "192.168.1.210",
    role: "Immutable Storage / Backup Repository",
    riskScore: 85,
    evidencePoints: [
      "Compromised credential 'svc_backup' has administrative backup operator rights on storage array",
      "Network routing path verified open from FILE-SERVER to backup storage subnet",
      "Standard ransomware tactic sequence: compromise backup infrastructure prior to mass encryption"
    ],
    reasoning: "The stolen service account 'svc_backup' possesses elevated rights on the central backup repository, rendering it a prime target for encryption or deletion to prevent recovery."
  }
];

export const mockHostsList: HostDetails[] = [
  {
    hostname: "PC-03",
    ip: "192.168.1.103",
    os: "Windows 11 Enterprise (22H2)",
    status: "Compromised",
    risk: "critical",
    users: ["domain_user_alpha", "LOCAL_SYSTEM"],
    processes: ["winword.exe", "powershell.exe (PID 4920)", "svchost.exe", "lsass.exe"],
    inboundConnections: ["185.220.101.5:443 (C2 Callback)"],
    outboundConnections: ["192.168.1.105:445 (NTLM Auth to PC-05)"],
    dnsActivity: ["suspicious-domain.com (Resolved to 185.220.101.5)", "internal-share.corp.local"],
    authActivity: ["NTLM Auth outgoing to PC-05", "Interactive User Logon (domain_user_alpha)"],
    mitreTechniques: ["T1059.001", "T1003.001", "T1071.001"],
    incidentInvolvement: ["INC-001"]
  },
  {
    hostname: "PC-05",
    ip: "192.168.1.105",
    os: "Windows 11 Enterprise (22H2)",
    status: "Compromised",
    risk: "high",
    users: ["domain_user_alpha", "svc_backup"],
    processes: ["cmd.exe", "psexec.exe", "wmic.exe"],
    inboundConnections: ["192.168.1.103:445 (Inbound NTLM from PC-03)"],
    outboundConnections: ["192.168.1.200:445 (Outbound SMB to FILE-SERVER)"],
    dnsActivity: ["file-server.corp.local", "dc01.corp.local"],
    authActivity: ["Network Logon from PC-03", "Service Token Impersonation"],
    mitreTechniques: ["T1021.002"],
    incidentInvolvement: ["INC-001"]
  },
  {
    hostname: "FILE-SERVER",
    ip: "192.168.1.200",
    os: "Windows Server 2022 Datacenter",
    status: "Compromised",
    risk: "critical",
    users: ["svc_backup", "SYSTEM"],
    processes: ["PSEXESVC.exe", "cmd.exe", "lsass.exe"],
    inboundConnections: ["192.168.1.105:445 (SMB Admin Share connection)"],
    outboundConnections: ["192.168.1.10:389 (LDAP query to DOMAIN-CONTROLLER)"],
    dnsActivity: ["dc01.corp.local", "backup-vault.corp.local"],
    authActivity: ["Remote ADMIN$ Share Access", "LDAP Admin Query Session"],
    mitreTechniques: ["T1021.002", "T1087.002"],
    incidentInvolvement: ["INC-001"]
  },
  {
    hostname: "DOMAIN-CONTROLLER",
    ip: "192.168.1.10",
    os: "Windows Server 2022 Datacenter",
    status: "Target",
    risk: "critical",
    users: ["Administrator", "SYSTEM", "krbtgt"],
    processes: ["lsass.exe", "ntds.exe", "dns.exe"],
    inboundConnections: ["192.168.1.200:389 (LDAP session from FILE-SERVER)"],
    outboundConnections: [],
    dnsActivity: ["Internal Active Directory DNS Root"],
    authActivity: ["Kerberos TGT issuances", "LDAP Directory Audits"],
    mitreTechniques: ["T1087.002"],
    incidentInvolvement: ["INC-001"]
  },
  {
    hostname: "SRV-BACKUP-01",
    ip: "192.168.1.250",
    os: "Windows Server 2019",
    status: "Suspicious",
    risk: "high",
    users: ["svc_backup", "LOCAL_ADMIN"],
    processes: ["vssadmin.exe", "wbadmin.exe"],
    inboundConnections: [],
    outboundConnections: [],
    dnsActivity: [],
    authActivity: ["Local Elevated Auth"],
    mitreTechniques: ["T1490 (Inhibit System Recovery)"],
    incidentInvolvement: ["INC-002"]
  },
  {
    hostname: "FIN-LAPTOP-12",
    ip: "192.168.1.112",
    os: "macOS Sequoia 15.1",
    status: "Suspicious",
    risk: "medium",
    users: ["finance_mgr"],
    processes: ["Terminal", "python3"],
    inboundConnections: [],
    outboundConnections: ["8.8.8.8:53"],
    dnsActivity: ["exfil-data-cloud.net (High TXT volume)"],
    authActivity: ["Local User SSH Key Session"],
    mitreTechniques: ["T1071.004 (DNS Tunneling)"],
    incidentInvolvement: ["INC-003"]
  },
  {
    hostname: "DEV-WORKSTATION-09",
    ip: "192.168.1.109",
    os: "Ubuntu 24.04 LTS",
    status: "Normal",
    risk: "low",
    users: ["dev_user"],
    processes: ["node", "docker", "gdb"],
    inboundConnections: [],
    outboundConnections: ["github.com:443"],
    dnsActivity: ["github.com", "registry.npmjs.org"],
    authActivity: ["Sudo Elevation Session"],
    mitreTechniques: ["T1134 (Access Token Manipulation)"],
    incidentInvolvement: ["INC-004"]
  }
];

export const mockSourceDestRelationships = [
  { source: "PC-03", target: "PC-05", events: 14, type: "NTLM Auth", risk: "critical" },
  { source: "PC-05", target: "FILE-SERVER", events: 8, type: "SMB ADMIN$", risk: "critical" },
  { source: "FILE-SERVER", target: "DOMAIN-CONTROLLER", events: 4, type: "LDAP Recon", risk: "high" },
  { source: "PC-03", target: "185.220.101.5", events: 42, type: "C2 HTTPS", risk: "high" },
  { source: "FIN-LAPTOP-12", target: "exfil-data-cloud.net", events: 128, type: "DNS Tunneling", risk: "medium" }
];

export const mockActivityTimelineData = [
  { time: "08:00", events: 450, anomalies: 1, severityScore: 12 },
  { time: "08:30", events: 820, anomalies: 0, severityScore: 5 },
  { time: "09:00", events: 1200, anomalies: 2, severityScore: 24 },
  { time: "09:30", events: 980, anomalies: 3, severityScore: 40 },
  { time: "10:00", events: 2400, anomalies: 8, severityScore: 95 },
  { time: "10:30", events: 1850, anomalies: 6, severityScore: 82 },
  { time: "11:00", events: 1100, anomalies: 2, severityScore: 30 },
];
