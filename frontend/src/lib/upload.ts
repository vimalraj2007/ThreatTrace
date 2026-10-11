import { z } from "zod";
export const LOG_KINDS = {
  auth: { label: "Authentication logs", required: ["timestamp", "user", "source", "destination"] },
  dns: { label: "DNS logs", required: ["timestamp", "host", "query"] },
  process: { label: "Process tree logs", required: ["timestamp", "host", "process", "parent"] },
  network: { label: "Network connections (optional)", required: ["timestamp", "source", "destination"] },
} as const;
export type LogKind = keyof typeof LOG_KINDS;
export const fileSchema = z.object({ name: z.string().regex(/\.(csv|json|ndjson)$/i, "Use a CSV, JSON or NDJSON file."), size: z.number().min(1, "This file is empty.").max(200 * 1024 * 1024, "Files over 200 MB should be split first.") });
export interface Parsed { count: number; malformed: number; columns: string[]; preview: Record<string, unknown>[]; missing: string[] }

export function guessKind(name: string): LogKind {
  const n = name.toLowerCase();
  return n.includes("dns") ? "dns" : n.includes("proc") ? "process" : n.includes("net") ? "network" : "auth";
}
function splitCsv(line: string) { return line.split(",").map((c) => c.trim().replace(/^"|"$/g, "")); }

export async function parseLog(file: File, kind: LogKind): Promise<Parsed> {
  const text = await file.text();
  let rows: Record<string, unknown>[] = []; let malformed = 0;
  if (!text.trim()) throw new Error("This file has no records.");
  if (/\.csv$/i.test(file.name)) {
    const [head, ...lines] = text.split(/\r?\n/).filter(Boolean); const cols = splitCsv(head);
    lines.forEach((l) => { const c = splitCsv(l); if (c.length !== cols.length) malformed++; else rows.push(Object.fromEntries(cols.map((k, i) => [k, c[i]]))); });
  } else if (/\.ndjson$/i.test(file.name)) {
    text.split(/\r?\n/).filter(Boolean).forEach((l) => { try { rows.push(JSON.parse(l)); } catch { malformed++; } });
  } else {
    try { const j = JSON.parse(text); rows = Array.isArray(j) ? j : j.records ?? []; } catch { throw new Error("This JSON file could not be read. Check for a missing bracket or trailing comma."); }
  }
  if (!rows.length) throw new Error("No valid records were found in this file.");
  const columns = Object.keys(rows[0]); const lower = columns.map((c) => c.toLowerCase());
  const missing = LOG_KINDS[kind].required.filter((r) => !lower.includes(r));
  return { count: rows.length, malformed, columns, preview: rows.slice(0, 4), missing };
}
