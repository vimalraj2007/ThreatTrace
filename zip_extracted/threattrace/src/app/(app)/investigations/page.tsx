"use client";
import { useState } from "react";
import { useIncidents } from "@/lib/hooks";
import { Workspace } from "@/components/workspace";
import { Page, Q } from "@/components/ui";
export default function Investigations() {
  const q = useIncidents(); const [id, setId] = useState("INC-001");
  return (
    <Page title="Investigations" sub="Notes, status and ownership per incident"
      actions={<select value={id} onChange={(e) => setId(e.target.value)} aria-label="Incident" className="rounded border border-line bg-bg px-2 py-1.5 text-sm">{(q.data ?? []).map((i) => <option key={i.id}>{i.id}</option>)}</select>}>
      <Q q={q}>{(l) => { const i = l.find((x) => x.id === id) ?? l[0]; return i ? <Workspace key={i.id} incident={i} /> : null; }}</Q>
    </Page>
  );
}
