from typing import List, Dict, Any

class StateStore:
    def __init__(self):
        self.ingested_files: List[Dict[str, Any]] = []
        self.raw_records: List[Dict[str, Any]] = []
        self.events: List[Dict[str, Any]] = []
        self.incidents: List[Dict[str, Any]] = []
        self.graph_data: Dict[str, Any] = {"nodes": [], "edges": []}
        self.mitre_techniques: List[Dict[str, Any]] = []
        self.lateral_movement: List[Dict[str, Any]] = []
        self.next_targets: List[Dict[str, Any]] = []
        self.hosts: List[Dict[str, Any]] = []
        self.notes: Dict[str, List[Dict[str, Any]]] = {}

    def reset_with_demo_data(self):
        # Demo dataset seeded by default
        self.events = [
            {
                "id": "EVT-1001",
                "ts": "2026-09-30T10:01:22Z",
                "host": "PC-03",
                "user": "domain_user_alpha",
                "src": "192.168.1.103:54210",
                "dst": "suspicious-domain.com:53",
                "type": "dns",
                "summary": "DNS lookup for high-risk external C2 domain suspicious-domain.com",
                "raw": {"EventID": 22, "QueryName": "suspicious-domain.com", "ClientIP": "192.168.1.103"},
                "normalized": {"query_name": "suspicious-domain.com", "resolved_ip": "185.220.101.5"},
                "reason": "Domain categorized as active C2 infrastructure in threat intel feeds",
                "technique": "T1071.001",
                "suspicious": True
            },
            {
                "id": "EVT-1002",
                "ts": "2026-09-30T10:03:11Z",
                "host": "PC-03",
                "user": "domain_user_alpha",
                "src": "PC-03 (winword.exe)",
                "dst": "PC-03 (powershell.exe)",
                "type": "process",
                "summary": "Microsoft Word spawned obfuscated base64 PowerShell command",
                "raw": {"EventID": 1, "Image": "powershell.exe", "CommandLine": "powershell.exe -enc ..."},
                "normalized": {"parent": "winword.exe", "child": "powershell.exe"},
                "reason": "Suspicious child process spawned by Office application executing base64 payload",
                "technique": "T1059.001",
                "suspicious": True
            },
            {
                "id": "EVT-1003",
                "ts": "2026-09-30T10:05:43Z",
                "host": "PC-03",
                "user": "domain_user_alpha",
                "src": "powershell.exe (PID 4920)",
                "dst": "lsass.exe (PID 672)",
                "type": "process",
                "summary": "PowerShell requested PROCESS_VM_READ access right against LSASS process memory",
                "raw": {"EventID": 10, "TargetImage": "lsass.exe", "GrantedAccess": "0x1010"},
                "normalized": {"source": "powershell.exe", "target": "lsass.exe"},
                "reason": "Unusual process memory read attempt against Local Security Authority Subsystem Service",
                "technique": "T1003.001",
                "suspicious": True
            },
            {
                "id": "EVT-1004",
                "ts": "2026-09-30T10:07:20Z",
                "host": "PC-05",
                "user": "domain_user_alpha",
                "src": "192.168.1.103 (PC-03)",
                "dst": "192.168.1.105 (PC-05)",
                "type": "auth",
                "summary": "Network Logon (Type 3) from PC-03 to PC-05 using NTLM authentication",
                "raw": {"EventID": 4624, "LogonType": 3, "WorkstationName": "PC-03"},
                "normalized": {"source_ip": "192.168.1.103", "dest_ip": "192.168.1.105"},
                "reason": "Anomalous workstation-to-workstation NTLM authentication across distinct VLANs",
                "technique": "T1021.002",
                "suspicious": True
            },
            {
                "id": "EVT-1005",
                "ts": "2026-09-30T10:09:50Z",
                "host": "FILE-SERVER",
                "user": "svc_backup",
                "src": "192.168.1.105 (PC-05)",
                "dst": "192.168.1.200 (FILE-SERVER)",
                "type": "network",
                "summary": "Remote admin share ADMIN$ write access and service registration from PC-05 to FILE-SERVER",
                "raw": {"EventID": 5145, "ShareName": "\\\\FILE-SERVER\\ADMIN$"},
                "normalized": {"share": "ADMIN$", "target": "PSEXESVC.exe"},
                "reason": "Privileged administrator share write activity from compromised workstation",
                "technique": "T1021.002",
                "suspicious": True
            },
            {
                "id": "EVT-1006",
                "ts": "2026-09-30T10:14:05Z",
                "host": "DOMAIN-CONTROLLER",
                "user": "svc_backup",
                "src": "192.168.1.200 (FILE-SERVER)",
                "dst": "192.168.1.10 (DOMAIN-CONTROLLER)",
                "type": "network",
                "summary": "High-volume LDAP search query inspecting Domain Admin group memberships",
                "raw": {"EventID": 1644, "LDAPFilter": "(&(objectCategory=person)(adminCount=1))"},
                "normalized": {"query": "adminCount=1"},
                "reason": "Reconnaissance query identifying domain privileged accounts executed from FILE-SERVER",
                "technique": "T1087.002",
                "suspicious": True
            }
        ]

        self.incidents = [
            {
                "id": "INC-001",
                "title": "Multi-stage lateral movement & privilege escalation",
                "severity": "CRITICAL",
                "status": "Investigating",
                "confidence": 0.96,
                "initial_host": "PC-03",
                "affected_hosts": ["PC-03", "PC-05", "FILE-SERVER"],
                "stage": "Server Access",
                "has_lateral_movement": True,
                "first_seen": "2026-09-30T10:01:22Z",
                "last_seen": "2026-09-30T10:14:05Z",
                "risk_score": 94,
                "users": ["domain_user_alpha", "svc_backup"],
                "techniques": ["T1059.001", "T1003.001", "T1021.002", "T1071.001", "T1087.002"],
                "assignee": "Analyst Sarah Connor (Tier 3)"
            },
            {
                "id": "INC-002",
                "title": "Ransomware staging on backup server",
                "severity": "HIGH",
                "status": "New",
                "confidence": 0.89,
                "initial_host": "SRV-BACKUP-01",
                "affected_hosts": ["SRV-BACKUP-01"],
                "stage": "Execution",
                "has_lateral_movement": False,
                "first_seen": "2026-09-30T09:45:10Z",
                "last_seen": "2026-09-30T09:52:33Z",
                "risk_score": 82,
                "users": ["svc_backup"],
                "techniques": ["T1490"],
                "assignee": None
            }
        ]

        self.graph_data = {
            "nodes": [
                {
                    "id": "PC-03",
                    "label": "PC-03 (Workstation)",
                    "type": "HOST",
                    "status": "COMPROMISED",
                    "risk": "CRITICAL",
                    "evidence": ["DNS query to suspicious-domain.com", "Encoded PowerShell execution", "LSASS memory read"],
                    "on_path": True
                },
                {
                    "id": "PC-05",
                    "label": "PC-05 (Workstation)",
                    "type": "HOST",
                    "status": "COMPROMISED",
                    "risk": "HIGH",
                    "evidence": ["Inbound NTLM auth from PC-03", "Outbound SMB ADMIN$ connection to FILE-SERVER"],
                    "on_path": True
                },
                {
                    "id": "FILE-SERVER",
                    "label": "FILE-SERVER (Storage)",
                    "type": "SERVER",
                    "status": "COMPROMISED",
                    "risk": "CRITICAL",
                    "evidence": ["PSEXESVC.exe written to ADMIN$", "Outbound LDAP queries to DOMAIN-CONTROLLER"],
                    "on_path": True
                },
                {
                    "id": "DOMAIN-CONTROLLER",
                    "label": "DOMAIN-CONTROLLER (Active Directory)",
                    "type": "SERVER",
                    "status": "AT_RISK",
                    "risk": "CRITICAL",
                    "evidence": ["LDAP directory audit for adminCount=1 from FILE-SERVER"],
                    "on_path": False
                },
                {
                    "id": "suspicious-domain.com",
                    "label": "suspicious-domain.com",
                    "type": "DOMAIN",
                    "status": "SUSPICIOUS",
                    "risk": "HIGH",
                    "evidence": ["Queried by PC-03"],
                    "on_path": True
                },
                {
                    "id": "powershell.exe",
                    "label": "powershell.exe (PID 4920)",
                    "type": "PROCESS",
                    "status": "COMPROMISED",
                    "risk": "CRITICAL",
                    "evidence": ["Base64 encoded execution"],
                    "on_path": True
                },
                {
                    "id": "domain_user_alpha",
                    "label": "domain_user_alpha",
                    "type": "USER",
                    "status": "COMPROMISED",
                    "risk": "HIGH",
                    "evidence": ["Account credentials dumped from LSASS"],
                    "on_path": True
                }
            ],
            "edges": [
                {
                    "id": "edge-1",
                    "source": "PC-03",
                    "target": "suspicious-domain.com",
                    "rel": "RESOLVED",
                    "on_path": True
                },
                {
                    "id": "edge-2",
                    "source": "PC-03",
                    "target": "powershell.exe",
                    "rel": "EXECUTED",
                    "on_path": True
                },
                {
                    "id": "edge-3",
                    "source": "powershell.exe",
                    "target": "domain_user_alpha",
                    "rel": "ACCESSED",
                    "on_path": True
                },
                {
                    "id": "edge-4",
                    "source": "PC-03",
                    "target": "PC-05",
                    "rel": "AUTHENTICATED_TO",
                    "on_path": True
                },
                {
                    "id": "edge-5",
                    "source": "PC-05",
                    "target": "FILE-SERVER",
                    "rel": "MOVED_TO",
                    "on_path": True
                },
                {
                    "id": "edge-6",
                    "source": "FILE-SERVER",
                    "target": "DOMAIN-CONTROLLER",
                    "rel": "CONNECTED_TO",
                    "on_path": False
                }
            ]
        }

        self.mitre_techniques = [
            {
                "id": "T1059.001",
                "name": "PowerShell",
                "tactic": "Execution",
                "evidence": ["winword.exe -> powershell.exe -EncodedCommand payload execution"],
                "event_ids": ["EVT-1002"],
                "hosts": ["PC-03"],
                "confidence": 0.98
            },
            {
                "id": "T1003.001",
                "name": "OS Credential Dumping: LSASS Memory",
                "tactic": "Credential Access",
                "evidence": ["PROCESS_VM_READ access handle requested on lsass.exe by PID 4920"],
                "event_ids": ["EVT-1003"],
                "hosts": ["PC-03"],
                "confidence": 0.94
            },
            {
                "id": "T1021.002",
                "name": "Remote Services: SMB/Windows Admin Shares",
                "tactic": "Lateral Movement",
                "evidence": ["NTLM logon (PC-03 -> PC-05) and ADMIN$ share write (PC-05 -> FILE-SERVER)"],
                "event_ids": ["EVT-1004", "EVT-1005"],
                "hosts": ["PC-03", "PC-05", "FILE-SERVER"],
                "confidence": 0.96
            },
            {
                "id": "T1071.001",
                "name": "Application Layer Protocol: Web Protocols",
                "tactic": "Command and Control",
                "evidence": ["Periodic beaconing queries to C2 domain suspicious-domain.com"],
                "event_ids": ["EVT-1001"],
                "hosts": ["PC-03"],
                "confidence": 0.88
            },
            {
                "id": "T1087.002",
                "name": "Account Discovery: Domain Account",
                "tactic": "Discovery",
                "evidence": ["LDAP filter query for adminCount=1 from FILE-SERVER to DOMAIN-CONTROLLER"],
                "event_ids": ["EVT-1006"],
                "hosts": ["FILE-SERVER", "DOMAIN-CONTROLLER"],
                "confidence": 0.90
            }
        ]

        self.lateral_movement = [
            {
                "id": "lm-1",
                "src": "PC-03 (192.168.1.103)",
                "dst": "PC-05 (192.168.1.105)",
                "ts": "2026-09-30 10:07:20",
                "user": "domain_user_alpha",
                "auth_type": "NTLM Remote Network Logon (Type 3)",
                "evidence": "Anomalous lateral logon across desktop VLAN subnets; credential harvested via LSASS memory read on PC-03.",
                "risk": "CRITICAL",
                "confidence": 0.95
            },
            {
                "id": "lm-2",
                "src": "PC-05 (192.168.1.105)",
                "dst": "FILE-SERVER (192.168.1.200)",
                "ts": "2026-09-30 10:09:50",
                "user": "svc_backup",
                "auth_type": "WinRM / SMB Admin Share Access (ADMIN$)",
                "evidence": "Remote service payload creation (PSEXESVC.exe) written to ADMIN$ share using stolen service account privileges.",
                "risk": "CRITICAL",
                "confidence": 0.98
            }
        ]

        self.next_targets = [
            {
                "asset": "DOMAIN-CONTROLLER (192.168.1.10)",
                "priority": "HIGH",
                "score": 0.92,
                "reasons": [
                    "Active LDAP domain administrative account enumeration observed from compromised FILE-SERVER",
                    "Recent Kerberos ticket requests (TGS) for krbtgt service principal from FILE-SERVER",
                    "High-value asset holding central Active Directory NTDS.dit password database",
                    "Correlated path matches historic Golden Ticket / DCSync attack patterns"
                ],
                "evidence": [
                    "Connected to compromised host FILE-SERVER",
                    "Recent LDAP query relationship for adminCount=1",
                    "High-value Domain Controller asset",
                    "Suspicious activity nearby"
                ]
            },
            {
                "asset": "SRV-BACKUP-VAULT (192.168.1.210)",
                "priority": "HIGH",
                "score": 0.81,
                "reasons": [
                    "Compromised credential 'svc_backup' has administrative backup operator rights on storage array",
                    "Network routing path verified open from FILE-SERVER to backup storage subnet"
                ],
                "evidence": [
                    "Stolen service account svc_backup has backup operator rights",
                    "Network routing open from FILE-SERVER"
                ]
            }
        ]

        self.hosts = [
            {
                "name": "PC-03",
                "ip": "192.168.1.103",
                "os": "Windows 11 Enterprise",
                "status": "COMPROMISED",
                "risk": "CRITICAL",
                "users": ["domain_user_alpha"],
                "processes": ["winword.exe", "powershell.exe", "svchost.exe", "lsass.exe"],
                "inbound": ["185.220.101.5:443"],
                "outbound": ["192.168.1.105:445"],
                "dns": ["suspicious-domain.com"],
                "auth": ["NTLM Auth outgoing to PC-05"],
                "techniques": ["T1059.001", "T1003.001", "T1071.001"],
                "incidents": ["INC-001"]
            },
            {
                "name": "PC-05",
                "ip": "192.168.1.105",
                "os": "Windows 11 Enterprise",
                "status": "COMPROMISED",
                "risk": "HIGH",
                "users": ["domain_user_alpha", "svc_backup"],
                "processes": ["cmd.exe", "psexec.exe", "wmic.exe"],
                "inbound": ["192.168.1.103:445"],
                "outbound": ["192.168.1.200:445"],
                "dns": ["file-server.corp.local"],
                "auth": ["Network Logon from PC-03"],
                "techniques": ["T1021.002"],
                "incidents": ["INC-001"]
            },
            {
                "name": "FILE-SERVER",
                "ip": "192.168.1.200",
                "os": "Windows Server 2022",
                "status": "COMPROMISED",
                "risk": "CRITICAL",
                "users": ["svc_backup"],
                "processes": ["PSEXESVC.exe", "cmd.exe"],
                "inbound": ["192.168.1.105:445"],
                "outbound": ["192.168.1.10:389"],
                "dns": ["dc01.corp.local"],
                "auth": ["Remote ADMIN$ Share Access"],
                "techniques": ["T1021.002", "T1087.002"],
                "incidents": ["INC-001"]
            },
            {
                "name": "DOMAIN-CONTROLLER",
                "ip": "192.168.1.10",
                "os": "Windows Server 2022 Datacenter",
                "status": "AT_RISK",
                "risk": "CRITICAL",
                "users": ["Administrator", "krbtgt"],
                "processes": ["lsass.exe", "ntds.exe"],
                "inbound": ["192.168.1.200:389"],
                "outbound": [],
                "dns": ["Internal AD Root"],
                "auth": ["Kerberos TGT issuances"],
                "techniques": ["T1087.002"],
                "incidents": ["INC-001"]
            }
        ]

store = StateStore()
store.reset_with_demo_data()
