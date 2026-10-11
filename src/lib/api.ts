import * as demo from "./demo";
import type * as T from "./types";
import {
  adaptDashboard,
  adaptIncident,
  adaptTelemetryEvent,
  adaptGraphData,
  adaptMitreTechnique,
  adaptLateralMove,
  adaptNextTarget
} from "./adapters";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {}

export const isDemo = () =>
  process.env.NEXT_PUBLIC_DEMO === "true" ||
  (typeof window !== "undefined" && localStorage.getItem("tt_demo") === "1");

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function getAuthHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("tt_token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

async function req<T>(path: string, fallback: () => T, init?: RequestInit): Promise<T> {
  if (isDemo()) {
    await sleep(150);
    return fallback();
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const headers = {
      ...getAuthHeader(),
      ...(init?.headers || {})
    };
    const res = await fetch(`${BASE}/api/v1${path}`, { ...init, headers, signal: ctrl.signal });
    
    if (res.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("tt_token");
      }
      throw new ApiError("Session expired or unauthorized. Please sign in again.");
    }
    
    if (!res.ok) {
      throw new ApiError(
        res.status === 404
          ? "That record was not found."
          : "The server could not complete this request. Try again in a moment."
      );
    }
    return (await res.json()) as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new ApiError("The server took too long to respond. Try again or narrow the time range.");
    }
    throw new ApiError(
      "ThreatTrace can't reach the analysis API. Check the API URL in Settings, or continue with the demo investigation."
    );
  } finally {
    clearTimeout(timer);
  }
}

const paginate = <X>(items: X[], page: number, pageSize: number): T.Paged<X> => ({
  items: items.slice((page - 1) * pageSize, page * pageSize),
  page,
  pageSize,
  total: items.length
});

export const api = {
  health: async (): Promise<{ status: string }> => {
    try {
      const res = await fetch(`${BASE}/api/v1/health`);
      if (res.ok) return await res.json();
      return { status: "unreachable" };
    } catch {
      return { status: "unreachable" };
    }
  },

  login: async (username: string, password: string): Promise<any> => {
    if (isDemo()) {
      return { access_token: "demo-token", user: { email: username, name: "Sarah Connor" } };
    }
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const res = await fetch(`${BASE}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });

    if (!res.ok) {
      throw new ApiError("Incorrect analyst email or password");
    }
    const data = await res.json();
    if (typeof window !== "undefined" && data.access_token) {
      localStorage.setItem("tt_token", data.access_token);
    }
    return data;
  },

  dashboard: () => req<T.Dashboard>("/dashboard", demo.dashboard).then(adaptDashboard),

  incidents: () =>
    req<any[]>("/incidents", () => demo.incidents).then((arr) => arr.map(adaptIncident)),

  incident: (id: string) =>
    req<any>(`/incidents/${id}`, () => {
      const i = demo.incidents.find((x) => x.id === id);
      if (!i) throw new ApiError("That incident was not found.");
      return i;
    }).then(adaptIncident),

  timeline: (id: string, page: number, size = 25) =>
    req<any>(`/incidents/${id}/timeline?page=${page}&pageSize=${size}`, () =>
      paginate(demo.events, page, size)
    ).then((res) => ({
      ...res,
      items: (res.items || []).map(adaptTelemetryEvent),
      pageSize: res.pageSize || res.page_size || size
    })),

  graph: (id: string) => req<any>(`/incidents/${id}/graph`, () => demo.graph).then(adaptGraphData),

  mitre: (id: string) =>
    req<any[]>(`/incidents/${id}/mitre`, () => demo.mitre).then((arr) => arr.map(adaptMitreTechnique)),

  lateral: (id: string) =>
    req<any[]>(`/incidents/${id}/lateral-movement`, () => demo.lateral).then((arr) =>
      arr.map(adaptLateralMove)
    ),

  nextTargets: (id: string) =>
    req<any[]>(`/incidents/${id}/next-targets`, () => demo.nextTargets).then((arr) =>
      arr.map(adaptNextTarget)
    ),

  hosts: () => req<T.HostInfo[]>("/hosts", () => demo.hosts),

  events: (page = 1, size = 25, q = "") =>
    req<any>(
      `/events?page=${page}&pageSize=${size}&q=${encodeURIComponent(q)}`,
      () =>
        paginate(
          demo.events.filter(
            (e) => !q || JSON.stringify(e).toLowerCase().includes(q.toLowerCase())
          ),
          page,
          size
        )
    ).then((res) => ({
      ...res,
      items: (res.items || []).map(adaptTelemetryEvent),
      pageSize: res.pageSize || res.page_size || size
    })),

  ingest: (files: { file: File; kind: string }[]) => {
    const fd = new FormData();
    files.forEach((f) => {
      fd.append("files", f.file);
      fd.append("kinds", f.kind);
    });
    return req<any>("/ingest", () => ({ jobId: "demo-job", total_records: 10690, valid_records: 10690, invalid_records: 0, parsing_errors: [] }), {
      method: "POST",
      body: fd
    }).then((res) => ({
      jobId: res.job_id || res.jobId || res.batch_id || "demo-job",
      totalRecords: res.total_records ?? 0,
      validRecords: res.valid_records ?? 0,
      invalidRecords: res.invalid_records ?? 0,
      parsingErrors: res.parsing_errors || []
    }));
  },

  analyze: (jobId: string) =>
    req<any>(
      "/analyze",
      () => ({ incidentIds: demo.incidents.map((i) => i.id), incident_count: demo.incidents.length }),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, job_id: jobId })
      }
    ).then((res) => ({
      incidentIds: res.incident_ids || res.incidentIds || demo.incidents.map((i) => i.id),
      incidentCount: res.incident_count ?? res.incidentCount ?? (res.incident_ids ? res.incident_ids.length : 0)
    })),

  generateReport: (id: string) =>
    req<any>(`/reports/${id}/generate`, () => reportFor(id), { method: "POST" }),

  report: (id: string) => req<any>(`/reports/${id}`, () => reportFor(id)),

  addNote: (incidentId: string, content: string, author = "SOC Analyst") =>
    req<any>(`/investigations/${incidentId}/notes`, () => ({ id: `note-${Date.now()}`, author, timestamp: new Date().toISOString(), content }), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, author })
    }),

  patchIncident: (incidentId: string, patch: { status?: string; assignee?: string }) =>
    req<any>(`/investigations/${incidentId}`, () => ({ id: incidentId, ...patch }), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch)
    })
};

function reportFor(id: string): T.IncidentReport {
  const incident = demo.incidents.find((i) => i.id === id) ?? demo.incidents[0];
  return {
    incident,
    generatedAt: new Date().toISOString(),
    summary: `Telemetry indicates ${incident.title.toLowerCase()} beginning on ${incident.initialHost}. ${incident.affectedHosts.length} host(s) show related activity. Findings are correlation-based and should be validated by an analyst.`,
    actions: [
      "Isolate affected hosts pending validation",
      "Reset credentials for accounts observed in the attack path",
      "Review authentication logs for the highest-priority next-target assets",
      "Preserve memory and disk images from initial-access host"
    ]
  };
}
