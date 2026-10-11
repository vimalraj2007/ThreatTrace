"use client";
import Link from "next/link";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight } from "lucide-react";
import { useDashboard } from "@/lib/hooks";
import { Card, Empty, Page, Q, SevBadge, Skeleton, Stat } from "@/components/ui";
import { NextTargets } from "@/components/panels";
import { fmtTime } from "@/lib/util";

const SEV = ["#e5484d", "#ee7d3a", "#e2b23a", "#4c93e8"];
const tip = { contentStyle: { background: "#131920", border: "1px solid #242f3d", fontSize: 12 } };

export default function Dashboard() {
  const q = useDashboard();
  return (
    <Page title="Overview" sub="Correlated telemetry across authentication, DNS and endpoint sources">
      <Q q={q} skeleton={<div className="grid grid-cols-2 gap-3 lg:grid-cols-6">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>}>
        {(d) => d.stats.incidents === 0 ? <Empty title="No incidents detected" hint="Upload authentication, DNS and process logs on the Log ingest page to start an investigation." /> : (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
              <Stat label="Total events" value={d.stats.events.toLocaleString()} /><Stat label="Active incidents" value={d.stats.incidents} tone="text-crit" />
              <Stat label="Suspicious hosts" value={d.stats.suspiciousHosts} tone="text-high" /><Stat label="Lateral movements" value={d.stats.lateral} tone="text-high" />
              <Stat label="High-risk users" value={d.stats.riskyUsers} tone="text-med" /><Stat label="Potential next targets" value={d.stats.nextTargets} />
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              <Card title="Attack activity" className="lg:col-span-2"><ResponsiveContainer height={220}><AreaChart data={d.activity}><XAxis dataKey="t" stroke="#8593a6" fontSize={11} /><YAxis stroke="#8593a6" fontSize={11} /><Tooltip {...tip} />
                <Area dataKey="events" stroke="#5a9bf0" fill="#5a9bf0" fillOpacity={0.12} /><Area dataKey="suspicious" stroke="#e5484d" fill="#e5484d" fillOpacity={0.25} /></AreaChart></ResponsiveContainer></Card>
              <Card title="Incident severity"><ResponsiveContainer height={220}><PieChart><Pie data={d.severity} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>{d.severity.map((_, i) => <Cell key={i} fill={SEV[i]} stroke="none" />)}</Pie><Tooltip {...tip} /></PieChart></ResponsiveContainer></Card>
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              <Card title="Top suspicious hosts"><ul className="space-y-2">{d.topHosts.map((h) => <li key={h.host} className="flex items-center gap-3 text-sm"><Link href={`/hosts?host=${h.host}`} className="w-40 truncate font-mono hover:text-accent">{h.host}</Link><div className="h-1.5 flex-1 rounded bg-raised"><div className="h-full rounded bg-high" style={{ width: `${h.score}%` }} /></div><span className="font-mono text-xs text-mute">{h.score}</span></li>)}</ul></Card>
              <Card title="Top source → destination"><ul className="space-y-2 font-mono text-xs">{d.relationships.map((r) => <li key={r.src + r.dst} className="flex justify-between"><span>{r.src} → {r.dst}</span><span className="text-mute">{r.count}</span></li>)}</ul></Card>
              <Card title="MITRE ATT&CK techniques"><ResponsiveContainer height={140}><BarChart data={d.mitre} layout="vertical"><XAxis type="number" hide /><YAxis type="category" dataKey="id" stroke="#8593a6" fontSize={11} width={70} /><Tooltip {...tip} /><Bar dataKey="count" fill="#5a9bf0" radius={2} /></BarChart></ResponsiveContainer></Card>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              <Card title="Lateral movement summary"><ul className="space-y-2 text-sm">{d.lateral.map((l) => <li key={l.from + l.to} className="flex items-center gap-2 font-mono"><span className="text-mute">{fmtTime(l.time)}</span>{l.from}<ArrowRight className="h-3.5 w-3.5 text-crit" />{l.to}</li>)}</ul></Card>
              <Card title="Recent incidents"><ul className="divide-y divide-line">{d.recent.slice(0, 3).map((i) => <li key={i.id}><Link href={`/incidents/${i.id}`} className="block py-2 hover:bg-raised/50"><div className="flex items-center gap-2"><span className="font-mono text-xs text-mute">{i.id}</span><SevBadge s={i.severity} /></div><p className="text-sm">{i.title}</p>
                <p className="text-xs text-mute">Initial host {i.initialHost}. Compromised: {i.affectedHosts.join(", ")}</p></Link></li>)}</ul></Card>
            </div>
            <Card title="Potential next targets"><NextTargets items={d.nextTargets} /></Card>
          </>)}
      </Q>
    </Page>
  );
}
