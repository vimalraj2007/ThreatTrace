"use client";
import { ArrowRight, Check, ShieldAlert } from "lucide-react";
import type { HostInfo, LateralMove, MitreTechnique, NextTarget } from "@/lib/types";
import { Card, Chip, Empty, SevBadge } from "./ui";
import { fmtTime, sevHex } from "@/lib/util";

export function Progression({ steps, active }: { steps: string[]; active: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span className={`rounded border px-3 py-1.5 text-xs ${i <= active ? "border-crit/50 bg-crit/10 text-txt" : "border-line text-mute"}`}>{s}</span>
          {i < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-mute" />}
        </li>
      ))}
    </ol>
  );
}

export function MitreList({ items }: { items: MitreTechnique[] }) {
  if (!items.length) return <Empty title="No techniques mapped" />;
  const tactics = [...new Set(items.map((i) => i.tactic))];
  return (
    <div className="space-y-4">
      {tactics.map((t) => (
        <div key={t}>
          <h4 className="mb-2 text-xs font-medium text-mute">{t}</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {items.filter((i) => i.tactic === t).map((m) => (
              <Card key={m.id}>
                <div className="flex items-center justify-between"><span className="font-mono text-sm text-accent">{m.id}</span><span className="text-xs text-mute">Confidence {m.confidence}%</span></div>
                <p className="mt-1 font-medium">{m.name}</p>
                <p className="mt-3 text-xs text-mute">Observed evidence</p>
                <ul className="mt-1 list-disc pl-4 text-xs">{m.evidence.map((e) => <li key={e}>{e}</li>)}</ul>
                <div className="mt-3 flex flex-wrap gap-1.5">{m.hosts.map((h) => <Chip key={h}>{h}</Chip>)}{m.eventIds.map((h) => <Chip key={h} tone="text-accent border-accent/30">{h}</Chip>)}</div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function LateralPath({ moves }: { moves: LateralMove[] }) {
  if (!moves.length) return <Empty title="No lateral movement detected" hint="Authentication and connection patterns did not show host-to-host movement." />;
  const path = [moves[0].src, ...moves.map((m) => m.dst)];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
        {path.map((h, i) => <span key={h + i} className="flex items-center gap-2"><span className="rounded border border-crit/40 bg-crit/10 px-3 py-1.5">{h}</span>{i < path.length - 1 && <ArrowRight className="h-4 w-4 text-crit" />}</span>)}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {moves.map((m) => (
          <Card key={m.id}>
            <div className="flex items-center justify-between font-mono text-sm"><span>{m.src} <ArrowRight className="inline h-3.5 w-3.5" /> {m.dst}</span><SevBadge s={m.risk} /></div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div><dt className="text-mute">Timestamp</dt><dd className="font-mono">{fmtTime(m.ts)}</dd></div><div><dt className="text-mute">User</dt><dd className="font-mono">{m.user}</dd></div>
              <div><dt className="text-mute">Authentication</dt><dd>{m.authType}</dd></div><div><dt className="text-mute">Confidence</dt><dd>{m.confidence}%</dd></div>
              <div className="col-span-2"><dt className="text-mute">Evidence</dt><dd>{m.evidence}</dd></div>
            </dl>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function NextTargets({ items }: { items: NextTarget[] }) {
  if (!items.length) return <Empty title="No potential next targets identified" />;
  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 rounded border border-line bg-raised px-3 py-2 text-xs text-mute"><ShieldAlert className="h-4 w-4" />These are investigation priorities based on correlated evidence, not predictions of attacker behavior.</p>
      <div className="grid gap-3 lg:grid-cols-3">
        {items.map((t) => (
          <Card key={t.asset}>
            <p className="text-xs text-mute">Potential Next Target</p>
            <p className="font-mono text-base font-semibold">{t.asset}</p>
            <div className="mt-2 flex items-center gap-2 text-xs"><span className="text-mute">Investigation Priority</span><SevBadge s={t.priority} /></div>
            <div className="mt-2 h-1.5 rounded bg-raised"><div className="h-full rounded" style={{ width: `${t.score}%`, background: sevHex[t.priority] }} /></div>
            <p className="mt-3 text-xs text-mute">Evidence Supporting This Assessment</p>
            <ul className="mt-1 space-y-1 text-xs">{t.evidence.map((e) => <li key={e} className="flex gap-2"><Check className="h-3.5 w-3.5 shrink-0 text-ok" />{e}</li>)}</ul>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function HostCard({ h }: { h: HostInfo }) {
  const list = (t: string, v: string[]) => <div><p className="text-xs text-mute">{t}</p><div className="mt-1 flex flex-wrap gap-1.5">{v.length ? v.map((x) => <Chip key={x}>{x}</Chip>) : <span className="text-xs text-mute">None</span>}</div></div>;
  return (
    <Card title={h.name} action={<SevBadge s={h.risk} />}>
      <dl className="grid grid-cols-3 gap-3 text-xs"><div><dt className="text-mute">IP</dt><dd className="font-mono">{h.ip}</dd></div><div><dt className="text-mute">OS</dt><dd>{h.os}</dd></div><div><dt className="text-mute">Status</dt><dd className="capitalize">{h.status.replace("-", " ")}</dd></div></dl>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {list("Users", h.users)}{list("Processes", h.processes)}{list("Inbound connections", h.inbound)}{list("Outbound connections", h.outbound)}
        {list("DNS activity", h.dns)}{list("Authentication activity", h.auth)}{list("MITRE techniques", h.techniques)}{list("Incidents", h.incidents)}
      </div>
    </Card>
  );
}
