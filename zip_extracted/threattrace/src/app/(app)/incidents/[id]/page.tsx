"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useGraph, useHosts, useIncident, useLateral, useMitre, useNextTargets } from "@/lib/hooks";
import { Boundary, Card, Page, Q, SevBadge } from "@/components/ui";
import { AttackGraph } from "@/components/attack-graph";
import { Timeline } from "@/components/timeline";
import { HostCard, LateralPath, MitreList, NextTargets, Progression } from "@/components/panels";
import { Workspace } from "@/components/workspace";
import { Report } from "@/components/report";
import { attackProgress } from "@/lib/demo";
import { fmtDate } from "@/lib/util";

const TABS = ["Overview", "Attack Graph", "Timeline", "Evidence", "Hosts", "MITRE ATT&CK", "Lateral Movement", "Next Target", "Workspace", "Report"] as const;

export default function IncidentPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const inc = useIncident(id), graph = useGraph(id), mitre = useMitre(id), lat = useLateral(id), nt = useNextTargets(id), hosts = useHosts();
  return (
    <Page title={id} sub="Incident investigation">
      <Q q={inc}>{(i) => (
        <>
          <div className="flex flex-wrap items-center gap-3"><h2 className="text-base">{i.title}</h2><SevBadge s={i.severity} /><span className="text-xs text-mute">Confidence {i.confidence}%</span></div>
          <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-line print:hidden">
            {TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`whitespace-nowrap border-b-2 px-3 py-2 text-[13px] ${tab === t ? "border-accent text-txt" : "border-transparent text-mute hover:text-txt"}`}>{t}</button>)}
          </div>
          <Boundary>
            {tab === "Overview" && (<div className="space-y-4">
              <Card><dl className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-4">
                {[["Incident ID", i.id], ["Confidence", `${i.confidence}%`], ["Initial access host", i.initialHost], ["Current compromised hosts", i.affectedHosts.join(", ")], ["First seen", fmtDate(i.firstSeen)], ["Last seen", fmtDate(i.lastSeen)], ["Attack duration", `${Math.round((+new Date(i.lastSeen) - +new Date(i.firstSeen)) / 60000)} min`], ["Status", i.status]].map(([k, v]) => <div key={k}><dt className="text-xs text-mute">{k}</dt><dd className="font-mono">{v}</dd></div>)}</dl></Card>
              <Card title="Attack progression"><Progression steps={attackProgress} active={i.lateral ? 5 : 2} /></Card></div>)}
            {tab === "Attack Graph" && <Q q={graph}>{(g) => <AttackGraph data={g} />}</Q>}
            {tab === "Timeline" && <Timeline incidentId={id} />}
            {tab === "Evidence" && <Q q={mitre}>{(m) => <Card title="Evidence by technique"><ul className="space-y-3 text-sm">{m.map((x) => <li key={x.id}><span className="font-mono text-accent">{x.id}</span> {x.name}<ul className="ml-4 list-disc text-xs text-mute">{x.evidence.map((e) => <li key={e}>{e}</li>)}</ul></li>)}</ul></Card>}</Q>}
            {tab === "Hosts" && <Q q={hosts}>{(h) => <div className="grid gap-3 lg:grid-cols-2">{h.filter((x) => x.incidents.includes(id)).map((x) => <HostCard key={x.name} h={x} />)}</div>}</Q>}
            {tab === "MITRE ATT&CK" && <Q q={mitre}>{(m) => <MitreList items={m} />}</Q>}
            {tab === "Lateral Movement" && <Q q={lat}>{(l) => <LateralPath moves={l} />}</Q>}
            {tab === "Next Target" && <Q q={nt}>{(t) => <NextTargets items={t} />}</Q>}
            {tab === "Workspace" && <Workspace incident={i} />}
            {tab === "Report" && <Report id={id} />}
          </Boundary>
        </>)}</Q>
    </Page>
  );
}
