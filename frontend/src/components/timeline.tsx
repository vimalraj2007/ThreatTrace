"use client";
import { useState } from "react";
import { Bookmark, ChevronLeft, ChevronRight, Globe, KeyRound, Network, Terminal, X } from "lucide-react";
import type { TelemetryEvent } from "@/lib/types";
import { fmtDate, fmtTime, cn } from "@/lib/util";
import { Chip, Empty, ErrorBox, Skeleton } from "./ui";
import { useLocal, useTimeline } from "@/lib/hooks";

const ICON = { dns: Globe, auth: KeyRound, process: Terminal, network: Network };

export function EventDrawer({ e, onClose }: { e: TelemetryEvent; onClose: () => void }) {
  const row = (k: string, v: string) => <div key={k} className="grid grid-cols-[110px_1fr] gap-2 border-b border-line py-1.5 text-xs"><dt className="text-mute">{k}</dt><dd className="break-all font-mono">{v}</dd></div>;
  return (
    <aside className="fixed right-0 top-0 z-40 h-full w-[420px] max-w-full overflow-y-auto border-l border-line bg-panel p-5 shadow-2xl">
      <button onClick={onClose} className="absolute right-3 top-3 text-mute hover:text-txt" aria-label="Close"><X className="h-4 w-4" /></button>
      <h3 className="text-sm font-semibold">{e.summary}</h3>
      <dl className="mt-3">{[["Event ID", e.id], ["Timestamp", fmtDate(e.ts)], ["Host", e.host], ["User", e.user], ["Source", e.src], ["Destination", e.dst], ["Event type", e.type], ["MITRE", e.technique ?? "None mapped"]].map(([k, v]) => row(k, v))}</dl>
      <p className="mt-4 text-xs text-mute">Detection reason</p><p className="mt-1 text-sm">{e.reason}</p>
      <p className="mt-4 text-xs text-mute">Normalized event</p><pre className="mt-1 overflow-x-auto rounded bg-bg p-3 font-mono text-[11px]">{JSON.stringify(e.normalized, null, 2)}</pre>
      <p className="mt-4 text-xs text-mute">Raw event</p><pre className="mt-1 overflow-x-auto rounded bg-bg p-3 font-mono text-[11px]">{JSON.stringify(e.raw, null, 2)}</pre>
    </aside>
  );
}

export function Timeline({ incidentId }: { incidentId: string }) {
  const [page, setPage] = useState(1);
  const [onlySus, setOnlySus] = useState(true);
  const [open, setOpen] = useState<TelemetryEvent | null>(null);
  const [marks, setMarks] = useLocal<string[]>(`tt_marks_${incidentId}`, []);
  const q = useTimeline(incidentId, page);
  if (q.isLoading) return <div className="space-y-2">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12" />)}</div>;
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  const d = q.data!; const items = onlySus ? d.items.filter((e) => e.suspicious) : d.items;
  const pages = Math.max(1, Math.ceil(d.total / d.pageSize));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-mute">
        <label className="flex items-center gap-2"><input type="checkbox" checked={onlySus} onChange={(e) => setOnlySus(e.target.checked)} />Only flagged events on this page</label>
        <span>{d.total.toLocaleString()} events · page {page} of {pages}</span>
      </div>
      {items.length === 0 ? <Empty title="No flagged events on this page" hint="Turn off the filter or go to another page." /> : (
        <ol className="relative ml-2 border-l border-line">
          {items.map((e) => { const I = ICON[e.type]; return (
            <li key={e.id} className="relative pb-3 pl-6">
              <span className={cn("absolute -left-[7px] top-2 h-3 w-3 rounded-full border-2 border-bg", e.suspicious ? "bg-crit" : "bg-mute")} />
              <button onClick={() => setOpen(e)} className="flex w-full items-center gap-3 rounded border border-line bg-panel px-3 py-2 text-left hover:bg-raised">
                <span className="font-mono text-xs text-mute">{fmtTime(e.ts)}</span><I className="h-4 w-4 shrink-0 text-accent" />
                <span className="flex-1 text-sm">{e.summary}</span>
                {e.technique && <Chip>{e.technique}</Chip>}
                <span role="button" aria-label="Bookmark" onClick={(ev) => { ev.stopPropagation(); setMarks(marks.includes(e.id) ? marks.filter((m) => m !== e.id) : [...marks, e.id]); }}>
                  <Bookmark className={cn("h-4 w-4", marks.includes(e.id) ? "fill-med text-med" : "text-mute")} /></span>
              </button>
            </li>); })}
        </ol>
      )}
      <div className="flex justify-end gap-2">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border border-line p-1.5 disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
        <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="rounded border border-line p-1.5 disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
      </div>
      {open && <EventDrawer e={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
