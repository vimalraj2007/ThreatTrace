"use client";
import { useState } from "react";
import { useIncidents } from "@/lib/hooks";
import { Report } from "@/components/report";
import { Page } from "@/components/ui";
export default function Reports() {
  const q = useIncidents(); const [id, setId] = useState("INC-001");
  return (
    <Page title="Reports" sub="Preview and export an investigation report"
      actions={<select value={id} onChange={(e) => setId(e.target.value)} aria-label="Incident" className="rounded border border-line bg-bg px-2 py-1.5 text-sm print:hidden">{(q.data ?? [{ id: "INC-001" }]).map((i) => <option key={i.id}>{i.id}</option>)}</select>}>
      <Report key={id} id={id} />
    </Page>
  );
}
