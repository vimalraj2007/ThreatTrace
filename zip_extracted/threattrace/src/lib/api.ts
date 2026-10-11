import * as demo from "./demo";
import type * as T from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
export class ApiError extends Error {}
export const isDemo = () =>
  process.env.NEXT_PUBLIC_DEMO === "true" || (typeof window !== "undefined" && localStorage.getItem("tt_demo") === "1");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function req<T>(path: string, fallback: () => T, init?: RequestInit): Promise<T> {
  if (isDemo()) { await sleep(200); return fallback(); }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(`${BASE}/api/v1${path}`, { ...init, signal: ctrl.signal });
    if (!res.ok) throw new ApiError(res.status === 404 ? "That record was not found." : "The server could not complete this request. Try again in a moment.");
    return (await res.json()) as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof DOMException && e.name === "AbortError") throw new ApiError("The server took too long to respond. Try again or narrow the time range.");
    throw new ApiError("ThreatTrace can't reach the analysis API. Check the API URL in Settings, or continue with the demo investigation.");
  } finally { clearTimeout(timer); }
}

const paginate = <X,>(items: X[], page: number, pageSize: number): T.Paged<X> => ({ items: items.slice((page - 1) * pageSize, page * pageSize), page, pageSize, total: items.length });

export const api = {
  dashboard: () => req<T.Dashboard>("/dashboard", demo.dashboard),
  incidents: () => req<T.Incident[]>("/incidents", () => demo.incidents),
  incident: (id: string) => req<T.Incident>(`/incidents/${id}`, () => {
    const i = demo.incidents.find((x) => x.id === id); if (!i) throw new ApiError("That incident was not found."); return i;
  }),
  timeline: (id: string, page: number, size = 25) => req<T.Paged<T.TelemetryEvent>>(`/incidents/${id}/timeline?page=${page}&pageSize=${size}`, () => paginate(demo.events, page, size)),
  graph: (id: string) => req<T.GraphData>(`/incidents/${id}/graph`, () => demo.graph),
  mitre: (id: string) => req<T.MitreTechnique[]>(`/incidents/${id}/mitre`, () => demo.mitre),
  lateral: (id: string) => req<T.LateralMove[]>(`/incidents/${id}/lateral-movement`, () => demo.lateral),
  nextTargets: (id: string) => req<T.NextTarget[]>(`/incidents/${id}/next-targets`, () => demo.nextTargets),
  hosts: () => req<T.HostInfo[]>("/hosts", () => demo.hosts),
  events: (page = 1, size = 25, q = "") => req<T.Paged<T.TelemetryEvent>>(`/events?page=${page}&pageSize=${size}&q=${encodeURIComponent(q)}`, () =>
    paginate(demo.events.filter((e) => !q || JSON.stringify(e).toLowerCase().includes(q.toLowerCase())), page, size)),
  ingest: (files: { file: File; kind: string }[]) => {
    const fd = new FormData(); files.forEach((f) => fd.append(f.kind, f.file));
    return req<{ jobId: string }>("/ingest", () => ({ jobId: "demo-job" }), { method: "POST", body: fd });
  },
  analyze: (jobId: string) => req<{ incidentIds: string[] }>("/analyze", () => ({ incidentIds: demo.incidents.map((i) => i.id) }), {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId }) }),
  generateReport: (id: string) => req<T.IncidentReport>(`/reports/${id}/generate`, () => reportFor(id), { method: "POST" }),
  report: (id: string) => req<T.IncidentReport>(`/reports/${id}`, () => reportFor(id)),
};

function reportFor(id: string): T.IncidentReport {
  const incident = demo.incidents.find((i) => i.id === id) ?? demo.incidents[0];
  return { incident, generatedAt: new Date().toISOString(), summary: `Telemetry indicates ${incident.title.toLowerCase()} beginning on ${incident.initialHost}. ${incident.affectedHosts.length} host(s) show related activity. Findings are correlation-based and should be validated by an analyst.`,
    actions: ["Isolate affected hosts pending validation", "Reset credentials for accounts observed in the attack path", "Review authentication logs for the highest-priority next-target assets", "Preserve memory and disk images from initial-access host"] };
}
