import { NextResponse } from "next/server";
import { 
  mockIncidents, 
  mockLateralMovementSteps, 
  mockMitreTechniques, 
  mockNextTargets 
} from "@/data/mockData";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const incident = mockIncidents.find((i) => i.id.toLowerCase() === id.toLowerCase()) || mockIncidents[0];

  return NextResponse.json({
    success: true,
    data: {
      id: `REP-${incident.id}`,
      title: `Executive Investigation Report: ${incident.title}`,
      incident,
      executiveSummary: "ThreatTrace AI correlation identified an active multi-stage intrusion spanning 3 internal hosts. Initial entry via PC-03 with credential theft leading to SMB lateral movement into FILE-SERVER. Active reconnaissance against DOMAIN-CONTROLLER indicates imminent Active Directory compromise vector.",
      lateralMovement: mockLateralMovementSteps,
      mitreTechniques: mockMitreTechniques,
      nextTargets: mockNextTargets,
      notes: incident.notes || [],
      recommendedActions: [
        "Immediately isolate PC-03, PC-05, and FILE-SERVER network interfaces via EDR agent.",
        "Revoke Kerberos TGT and reset passwords for compromised service account 'svc_backup' and 'domain_user_alpha'.",
        "Block C2 IP 185.220.101.5 and domain 'suspicious-domain.com' at perimeter firewall/DNS sinkhole.",
        "Perform memory analysis on DOMAIN-CONTROLLER to ensure no active LDAP injection or Golden Ticket persistence has occurred."
      ],
      generatedAt: new Date().toISOString()
    }
  });
}
