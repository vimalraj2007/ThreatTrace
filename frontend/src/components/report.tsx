"use client";
import { useQuery } from "@tanstack/react-query";
import { Download, Printer } from "lucide-react";
import { api } from "@/lib/api";
import { useGraph, useLateral, useMitre, useNextTargets, useTimeline } from "@/lib/hooks";
import { download, fmtDate, fmtTime } from "@/lib/util";
import { Btn, Card, Q, SevBadge } from "./ui";
import { useNotes } from "./workspace";
import { AttackGraph } from "./attack-graph";

export function Report({ id }: { id: string }) {
  const rep = useQuery({ queryKey: ["report", id], queryFn: () => api.generateReport(id) });
  const tl = useTimeline(id, 1), mitre = useMitre(id), lat = useLateral(id), nt = useNextTargets(id), gr = useGraph(id);
  const [notes] = useNotes(id);
  const flagged = (tl.data?.items ?? []).filter((e) => e.suspicious);
  const bundle = () => ({ report: rep.data, timeline: flagged, mitre: mitre.data, lateral: lat.data, nextTargets: nt.data, notes });
  const csv = () => ["id,timestamp,host,user,type,technique,summary", ...flagged.map((e) => [e.id, e.ts, e.host, e.user, e.type, e.technique ?? "", `"${e.summary.replace(/"/g, '""')}"`].join(","))].join("\n");
  const S = ({ t, children }: { t: string; children: React.ReactNode }) => <Card title={t}>{children}</Card>;
  return (
    <Q q={rep} skeleton={<div className="h-64 animate-pulse rounded bg-raised" />}>
      {(r) => (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 print:hidden">
            <Btn variant="primary" onClick={() => window.print()}><Printer className="h-3.5 w-3.5" />Export PDF</Btn>
            <Btn onClick={() => download(`${id}.json`, "application/json", JSON.stringify(bundle(), null, 2))}><Download className="h-3.5 w-3.5" />Export JSON</Btn>
            <Btn onClick={() => download(`${id}-events.csv`, "text/csv", csv())}><Download className="h-3.5 w-3.5" />Export CSV</Btn>
          </div>
          <S t="Executive summary"><p className="max-w-3xl text-sm leading-relaxed">{r.summary}</p></S>
          <S t="Incident overview"><div className="flex flex-wrap gap-6 text-sm"><span>{r.incident.id}</span><SevBadge s={r.incident.severity} /><span>Confidence {r.incident.confidence}%</span><span>{fmtDate(r.incident.firstSeen)} to {fmtTime(r.incident.lastSeen)}</span></div></S>
          <S t="Attack timeline"><ul className="space-y-1 font-mono text-xs">{flagged.map((e) => <li key={e.id}>{fmtTime(e.ts)}  {e.summary}</li>)}</ul></S>
          <S t="Compromised hosts"><p className="font-mono text-sm">{r.incident.affectedHosts.join(", ")}</p></S>
          <S t="Attack graph">{gr.data && <AttackGraph data={gr.data} height={360} />}</S>
          <S t="Lateral movement"><ul className="space-y-1 text-sm">{lat.data?.map((m) => <li key={m.id} className="font-mono">{m.src} → {m.dst} ({m.user}, {fmtTime(m.ts)})</li>)}</ul></S>
          <S t="MITRE ATT&CK mapping"><ul className="space-y-1 text-sm">{mitre.data?.map((m) => <li key={m.id}><span className="font-mono text-accent">{m.id}</span> {m.name} ({m.tactic})</li>)}</ul></S>
          <S t="Evidence"><ul className="list-disc space-y-1 pl-4 text-sm">{mitre.data?.flatMap((m) => m.evidence).map((e) => <li key={e}>{e}</li>)}</ul></S>
          <S t="Potential next targets"><ul className="space-y-1 text-sm">{nt.data?.map((t) => <li key={t.asset}><span className="font-mono">{t.asset}</span>: {t.priority} investigation priority</li>)}</ul></S>
          <S t="Investigator notes">{notes.length ? notes.map((n) => <p key={n.id} className="text-sm">• {n.text}</p>) : <p className="text-sm text-mute">No notes recorded.</p>}</S>
          <S t="Recommended investigation actions"><ul className="list-disc space-y-1 pl-4 text-sm">{r.actions.map((a) => <li key={a}>{a}</li>)}</ul></S>
        </div>
      )}
    </Q>
  );
}
