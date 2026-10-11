"use client";
import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Check, FileUp, Loader2, X } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useEvents } from "@/lib/hooks";
import { fileSchema, guessKind, LOG_KINDS, parseLog, type LogKind, type Parsed } from "@/lib/upload";
import { Btn, Card, Chip, Empty, ErrorBox, Page, Q } from "@/components/ui";
import { EventDrawer } from "@/components/timeline";
import type { TelemetryEvent } from "@/lib/types";
import { fmtTime } from "@/lib/util";

interface Item { file: File; kind: LogKind; parsed?: Parsed; error?: string }
const STAGES = ["Parsing logs", "Normalizing events", "Correlating telemetry", "Building attack graph", "Mapping MITRE techniques", "Analyzing lateral movement", "Generating investigation"];

function LogsInner() {
  const router = useRouter(); const params = useSearchParams();
  const [items, setItems] = useState<Item[]>([]); const [drag, setDrag] = useState(false);
  const [stage, setStage] = useState(-1); const [err, setErr] = useState<unknown>(null);
  const input = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1); const [q, setQ] = useState(params.get("q") ?? ""); const [open, setOpen] = useState<TelemetryEvent | null>(null);
  const ev = useEvents(page, q);

  const add = async (files: FileList | File[]) => {
    for (const file of Array.from(files)) {
      const kind = guessKind(file.name); const check = fileSchema.safeParse({ name: file.name, size: file.size });
      if (!check.success) { setItems((s) => [...s, { file, kind, error: check.error.issues[0].message }]); continue; }
      try { const parsed = await parseLog(file, kind); setItems((s) => [...s, { file, kind, parsed }]); }
      catch (e) { setItems((s) => [...s, { file, kind, error: (e as Error).message }]); }
    }
  };
  const valid = items.filter((i) => i.parsed && i.parsed.missing.length === 0);
  const start = async () => {
    setErr(null);
    try {
      setStage(0); const { jobId } = await api.ingest(valid.map((v) => ({ file: v.file, kind: v.kind })));
      for (let s = 1; s < STAGES.length - 1; s++) { setStage(s); await new Promise((r) => setTimeout(r, 500)); }
      const res = await api.analyze(jobId); setStage(STAGES.length - 1); await new Promise((r) => setTimeout(r, 400));
      if (!res.incidentIds.length) { setStage(-1); setErr(new ApiError("Analysis finished but found no incidents. The logs may not overlap in time or hosts.")); return; }
      router.push("/incidents");
    } catch (e) { setStage(-1); setErr(e instanceof ApiError ? e : new ApiError("Analysis failed. Check the files and try again.")); }
  };
  return (
    <Page title="Log ingest" sub="Upload fragmented telemetry to correlate and reconstruct attack chains">
      <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
        className={`rounded-md border-2 border-dashed p-8 text-center ${drag ? "border-accent bg-accent/5" : "border-line"}`}>
        <FileUp className="mx-auto h-7 w-7 text-mute" />
        <p className="mt-2 text-sm">Drop authentication, DNS, process tree or network logs here</p>
        <p className="text-xs text-mute">CSV, JSON or NDJSON. Name files with auth, dns, proc or net so they can be typed automatically.</p>
        <Btn className="mt-3" onClick={() => input.current?.click()}>Browse files</Btn>
        <input ref={input} type="file" multiple hidden accept=".csv,.json,.ndjson" onChange={(e) => e.target.files && add(e.target.files)} />
      </div>
      {items.length > 0 && (
        <Card title="File preview">
          <ul className="space-y-3">{items.map((it, idx) => (
            <li key={idx} className="rounded border border-line p-3">
              <div className="flex items-center gap-3 text-sm">
                {it.error || it.parsed?.missing.length ? <AlertTriangle className="h-4 w-4 text-high" /> : <Check className="h-4 w-4 text-ok" />}
                <span className="font-mono">{it.file.name}</span>
                <select value={it.kind} onChange={(e) => setItems(items.map((x, j) => (j === idx ? { ...x, kind: e.target.value as LogKind } : x)))} className="rounded border border-line bg-bg px-1 py-0.5 text-xs" aria-label="Log type">{Object.entries(LOG_KINDS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
                {it.parsed && <span className="text-xs text-mute">{it.parsed.count.toLocaleString()} records{it.parsed.malformed ? `, ${it.parsed.malformed} malformed skipped` : ""}</span>}
                <button className="ml-auto text-mute hover:text-txt" aria-label="Remove file" onClick={() => setItems(items.filter((_, j) => j !== idx))}><X className="h-4 w-4" /></button>
              </div>
              {it.error && <p className="mt-2 text-xs text-high">{it.error}</p>}
              {it.parsed && (it.parsed.missing.length ? <p className="mt-2 text-xs text-high">Schema check failed for {LOG_KINDS[it.kind].label.toLowerCase()}. Missing columns: {it.parsed.missing.join(", ")}. Change the log type if this file was misdetected.</p>
                : <><p className="mt-2 text-xs text-ok">Valid schema</p><pre className="mt-2 overflow-x-auto rounded bg-bg p-2 font-mono text-[11px]">{JSON.stringify(it.parsed.preview.slice(0, 2), null, 1)}</pre></>)}
            </li>))}</ul>
          <div className="mt-4"><Btn variant="primary" disabled={!valid.length || stage >= 0} onClick={start}>Start Investigation</Btn></div>
        </Card>)}
      {stage >= 0 && (
        <Card title="Analysis in progress"><div className="h-1.5 rounded bg-raised"><div className="h-full rounded bg-accent transition-all" style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }} /></div>
          <ul className="mt-3 space-y-1 text-sm">{STAGES.map((s, i) => <li key={s} className={i <= stage ? "text-txt" : "text-mute"}>{i < stage ? <Check className="mr-2 inline h-3.5 w-3.5 text-ok" /> : i === stage ? <Loader2 className="mr-2 inline h-3.5 w-3.5 animate-spin" /> : <span className="mr-2 inline-block w-3.5" />}{s}…</li>)}</ul></Card>)}
      {err ? <ErrorBox error={err} /> : null}
      <Card title="Event explorer" action={<input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Filter events" aria-label="Filter events" className="rounded border border-line bg-bg px-2 py-1 text-xs" />}>
        <Q q={ev}>{(d) => d.items.length === 0 ? <Empty title="No events match" hint="Try a host, user, domain or event ID." /> : (
          <>
            <table className="w-full text-left text-xs"><thead className="text-mute"><tr><th className="py-1">Time</th><th>Type</th><th>Host</th><th>Summary</th></tr></thead>
              <tbody>{d.items.map((e) => <tr key={e.id} onClick={() => setOpen(e)} className="cursor-pointer border-t border-line hover:bg-raised/50"><td className="py-1.5 font-mono">{fmtTime(e.ts)}</td><td><Chip>{e.type}</Chip></td><td className="font-mono">{e.host}</td><td className={e.suspicious ? "text-high" : ""}>{e.summary}</td></tr>)}</tbody></table>
            <div className="mt-3 flex items-center justify-between text-xs text-mute"><span>{d.total.toLocaleString()} events</span>
              <span className="flex gap-2"><Btn disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Btn><Btn disabled={page * d.pageSize >= d.total} onClick={() => setPage(page + 1)}>Next</Btn></span></div>
          </>)}</Q>
      </Card>
      {open && <EventDrawer e={open} onClose={() => setOpen(null)} />}
    </Page>
  );
}
export default function Logs() { return <Suspense><LogsInner /></Suspense>; }
