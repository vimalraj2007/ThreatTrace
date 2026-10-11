import clsx, { type ClassValue } from "clsx";
import type { Severity } from "./types";
export const cn = (...a: ClassValue[]) => clsx(a);
export const fmtTime = (iso: string) => new Date(iso).toISOString().slice(11, 19);
export const fmtDate = (iso: string) => new Date(iso).toISOString().slice(0, 19).replace("T", " ") + " UTC";
export const sevColor: Record<Severity, string> = { critical: "text-crit border-crit/40 bg-crit/10", high: "text-high border-high/40 bg-high/10", medium: "text-med border-med/40 bg-med/10", low: "text-low border-low/40 bg-low/10", info: "text-ok border-ok/30 bg-ok/10" };
export const sevHex: Record<Severity, string> = { critical: "#e5484d", high: "#ee7d3a", medium: "#e2b23a", low: "#4c93e8", info: "#3fb37f" };
export function download(name: string, mime: string, data: string) {
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([data], { type: mime })); a.download = name; a.click();
}
