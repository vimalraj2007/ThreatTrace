"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useHosts } from "@/lib/hooks";
import { HostCard } from "@/components/panels";
import { Empty, Page, Q, SevBadge } from "@/components/ui";

function Inner() {
  const q = useHosts(); const p = useSearchParams(); const [sel, setSel] = useState(p.get("host") ?? "");
  return (
    <Page title="Hosts" sub="Every asset seen in correlated telemetry">
      <Q q={q}>{(hs) => hs.length === 0 ? <Empty title="No hosts yet" hint="Upload logs to populate the host inventory." /> : (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <ul className="divide-y divide-line rounded-md border border-line bg-panel">{hs.map((h) => (
            <li key={h.name}><button onClick={() => setSel(h.name)} className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-raised ${sel === h.name ? "bg-raised" : ""}`}><span><span className="font-mono">{h.name}</span><span className="block text-xs text-mute">{h.ip}</span></span><SevBadge s={h.risk} /></button></li>))}</ul>
          {hs.find((h) => h.name === sel) ? <HostCard h={hs.find((h) => h.name === sel)!} /> : <Empty title="Select a host" hint="Choose a host to see users, processes, connections and techniques." />}
        </div>)}</Q>
    </Page>
  );
}
export default function Hosts() { return <Suspense><Inner /></Suspense>; }
