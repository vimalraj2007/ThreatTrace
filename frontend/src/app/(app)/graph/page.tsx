"use client";
import { useState } from "react";
import { useGraph, useIncidents } from "@/lib/hooks";
import { AttackGraph } from "@/components/attack-graph";
import { Page, Q } from "@/components/ui";

export default function GraphPage() {
  const inc = useIncidents(); const [id, setId] = useState("INC-001"); const g = useGraph(id);
  return (
    <Page title="Attack graph" sub="Hosts, users, IPs, domains and processes linked by observed activity"
      actions={<select value={id} onChange={(e) => setId(e.target.value)} aria-label="Incident" className="rounded border border-line bg-bg px-2 py-1.5 text-sm">{(inc.data ?? [{ id: "INC-001" }]).map((i) => <option key={i.id}>{i.id}</option>)}</select>}>
      <Q q={g}>{(d) => <AttackGraph data={d} height={640} />}</Q>
    </Page>
  );
}
