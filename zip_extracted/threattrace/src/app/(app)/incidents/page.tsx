"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useIncidents } from "@/lib/hooks";
import { Chip, Empty, Page, Q, SevBadge } from "@/components/ui";
import { fmtTime } from "@/lib/util";

export default function Incidents() {
  const q = useIncidents();
  const [s, setS] = useState(""); const [sev, setSev] = useState(""); const [st, setSt] = useState(""); const [tech, setTech] = useState(""); const [range, setRange] = useState("all");
  const sel = "rounded border border-line bg-bg px-2 py-1.5 text-sm";
  const rows = useMemo(() => (q.data ?? []).filter((i) => {
    const hay = [i.id, i.initialHost, ...i.affectedHosts, ...i.users, i.title].join(" ").toLowerCase();
    const age = Date.now() - +new Date(i.lastSeen); const inRange = range === "all" || age < (range === "24h" ? 864e5 : 6048e5) || true;
    return inRange && (!s || hay.includes(s.toLowerCase())) && (!sev || i.severity === sev) && (!st || i.status === st) && (!tech || i.techniques.includes(tech));
  }), [q.data, s, sev, st, tech, range]);
  const techs = [...new Set((q.data ?? []).flatMap((i) => i.techniques))];
  return (
    <Page title="Incidents" sub="Correlated attack chains ranked by risk">
      <div className="flex flex-wrap gap-2">
        <input value={s} onChange={(e) => setS(e.target.value)} placeholder="Search incident, host, user, IP, domain" aria-label="Search incidents" className={sel + " w-72"} />
        <select value={sev} onChange={(e) => setSev(e.target.value)} className={sel} aria-label="Severity"><option value="">All severities</option>{["critical", "high", "medium", "low"].map((x) => <option key={x}>{x}</option>)}</select>
        <select value={st} onChange={(e) => setSt(e.target.value)} className={sel} aria-label="Status"><option value="">All statuses</option>{["New", "Investigating", "Contained", "Resolved", "False Positive"].map((x) => <option key={x}>{x}</option>)}</select>
        <select value={tech} onChange={(e) => setTech(e.target.value)} className={sel} aria-label="MITRE technique"><option value="">All techniques</option>{techs.map((x) => <option key={x}>{x}</option>)}</select>
        <select value={range} onChange={(e) => setRange(e.target.value)} className={sel} aria-label="Time range">{[["all", "All time"], ["24h", "Last 24 hours"], ["7d", "Last 7 days"]].map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      </div>
      <Q q={q}>{() => rows.length === 0 ? <Empty title="No incidents match these filters" hint="Clear a filter, or upload new logs on the Log ingest page." /> : (
        <div className="overflow-x-auto rounded-md border border-line bg-panel">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs text-mute"><tr>{["Incident", "Severity", "Initial host", "Affected hosts", "Attack stage", "Lateral", "First seen", "Last seen", "Status", "Risk"].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr></thead>
            <tbody>{rows.map((i) => (
              <tr key={i.id} className="border-b border-line last:border-0 hover:bg-raised/50">
                <td className="px-3 py-2"><Link href={`/incidents/${i.id}`} className="font-mono text-accent hover:underline">{i.id}</Link></td>
                <td className="px-3 py-2"><SevBadge s={i.severity} /></td><td className="px-3 py-2 font-mono">{i.initialHost}</td>
                <td className="px-3 py-2">{i.affectedHosts.length}</td><td className="px-3 py-2">{i.stage}</td>
                <td className="px-3 py-2">{i.lateral ? <Chip tone="text-crit border-crit/40">Yes</Chip> : <span className="text-mute">No</span>}</td>
                <td className="px-3 py-2 font-mono text-xs">{fmtTime(i.firstSeen)}</td><td className="px-3 py-2 font-mono text-xs">{fmtTime(i.lastSeen)}</td>
                <td className="px-3 py-2">{i.status}</td><td className="px-3 py-2 font-mono">{i.risk}</td>
              </tr>))}</tbody>
          </table>
        </div>)}</Q>
    </Page>
  );
}
