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
import { 
  initialStats, 
  mockIncidents, 
  mockGraphData, 
  mockTimelineEvents, 
  mockMitreTechniques, 
  mockLateralMovementSteps, 
  mockNextTargets, 
  mockHostsList 
} from "@/data/mockData";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.error || errJson.message) {
        errorMsg = errJson.error || errJson.message;
      }
    } catch {
      // Use fallback errorMsg
    }
    throw new ApiError(response.status, errorMsg);
  }
  const result = await response.json();
  return result.data !== undefined ? result.data : result;
}

export const api = {
  // Ingest logs
  ingest: async (fileData: FormData): Promise<{ status: string; recordsParsed: number; incidentId: string }> => {
    try {
      const res = await fetch("/api/v1/ingest", {
        method: "POST",
        body: fileData,
      });
      return await handleResponse(res);
    } catch (e) {
      console.warn("API Ingest fallback trigger", e);
      // Fallback for client side preview / demo
      await new Promise(r => setTimeout(r, 1200));
      return {
        status: "success",
        recordsParsed: 10690,
        incidentId: "INC-001"
      };
    }
  },

  // Trigger analysis pipeline
  analyze: async (incidentId: string): Promise<{ incident: Incident; graph: AttackGraphData }> => {
    try {
      const res = await fetch("/api/v1/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incidentId }),
      });
      return await handleResponse(res);
    } catch {
      await new Promise(r => setTimeout(r, 1500));
      return {
        incident: mockIncidents[0],
        graph: mockGraphData
      };
    }
  },

  // Dashboard stats
  getDashboard: async (): Promise<DashboardStats> => {
    try {
      const res = await fetch("/api/v1/dashboard");
      return await handleResponse(res);
    } catch {
      return initialStats;
    }
  },

  // Incident list
  getIncidents: async (): Promise<Incident[]> => {
    try {
      const res = await fetch("/api/v1/incidents");
      return await handleResponse(res);
    } catch {
      return mockIncidents;
    }
  },

  // Single Incident details
  getIncidentById: async (id: string): Promise<Incident | null> => {
    try {
      const res = await fetch(`/api/v1/incidents/${id}`);
      return await handleResponse(res);
    } catch {
      return mockIncidents.find(i => i.id === id) || mockIncidents[0];
    }
  },

  // Incident Timeline
  getIncidentTimeline: async (id: string): Promise<TimelineEvent[]> => {
    try {
      const res = await fetch(`/api/v1/incidents/${id}/timeline`);
      return await handleResponse(res);
    } catch {
      return mockTimelineEvents;
    }
  },

  // Incident Attack Graph
  getIncidentGraph: async (id: string): Promise<AttackGraphData> => {
    try {
      const res = await fetch(`/api/v1/incidents/${id}/graph`);
      return await handleResponse(res);
    } catch {
      return mockGraphData;
    }
  },

  // Incident MITRE mapping
  getIncidentMitre: async (id: string): Promise<MitreTechniqueItem[]> => {
    try {
      const res = await fetch(`/api/v1/incidents/${id}/mitre`);
      return await handleResponse(res);
    } catch {
      return mockMitreTechniques;
    }
  },

  // Incident Lateral Movement
  getIncidentLateralMovement: async (id: string): Promise<LateralMovementStep[]> => {
    try {
      const res = await fetch(`/api/v1/incidents/${id}/lateral-movement`);
      return await handleResponse(res);
    } catch {
      return mockLateralMovementSteps;
    }
  },

  // Incident Next Targets
  getIncidentNextTargets: async (id: string): Promise<NextTarget[]> => {
    try {
      const res = await fetch(`/api/v1/incidents/${id}/next-targets`);
      return await handleResponse(res);
    } catch {
      return mockNextTargets;
    }
  },

  // Hosts list
  getHosts: async (): Promise<HostDetails[]> => {
    try {
      const res = await fetch("/api/v1/hosts");
      return await handleResponse(res);
    } catch {
      return mockHostsList;
    }
  },

  // Events list
  getEvents: async (): Promise<TimelineEvent[]> => {
    try {
      const res = await fetch("/api/v1/events");
      return await handleResponse(res);
    } catch {
      return mockTimelineEvents;
    }
  },

  // Generate & Get Report
  generateReport: async (id: string): Promise<{ reportId: string; generatedAt: string }> => {
    try {
      const res = await fetch(`/api/v1/reports/${id}/generate`, { method: "POST" });
      return await handleResponse(res);
    } catch {
      return { reportId: `REP-${id}`, generatedAt: new Date().toISOString() };
    }
  },

  getReport: async (id: string): Promise<any> => {
    try {
      const res = await fetch(`/api/v1/reports/${id}`);
      return await handleResponse(res);
    } catch {
      return {
        id: `REP-${id}`,
        incident: mockIncidents[0],
        executiveSummary: "ThreatTrace AI correlation identified an active multi-stage intrusion spanning 3 internal hosts. Initial entry via PC-03 with credential theft leading to SMB lateral movement into FILE-SERVER. Active reconnaissance against DOMAIN-CONTROLLER indicates imminent Active Directory compromise vector.",
        lateralMovement: mockLateralMovementSteps,
        mitreTechniques: mockMitreTechniques,
        nextTargets: mockNextTargets,
        notes: mockIncidents[0].notes || [],
        generatedAt: new Date().toISOString()
      };
    }
  }
};
