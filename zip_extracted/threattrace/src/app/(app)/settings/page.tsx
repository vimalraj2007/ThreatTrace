"use client";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Btn, Card, Page } from "@/components/ui";
export default function Settings() {
  const qc = useQueryClient(); const [demo, setDemo] = useState(false);
  useEffect(() => setDemo(localStorage.getItem("tt_demo") === "1"), []);
  const toggle = () => { const n = !demo; setDemo(n); n ? localStorage.setItem("tt_demo", "1") : localStorage.removeItem("tt_demo"); qc.invalidateQueries(); };
  return (
    <Page title="Settings">
      <Card title="Data source">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={demo} onChange={toggle} />Use synthetic demo investigation</label>
        <p className="mt-2 text-xs text-mute">API base URL is set with NEXT_PUBLIC_API_URL ({process.env.NEXT_PUBLIC_API_URL || "same origin"}). Turn demo mode off to query the live backend.</p>
        <Btn className="mt-3" onClick={() => { localStorage.clear(); location.href = "/login"; }}>Sign out and clear local data</Btn>
      </Card>
    </Page>
  );
}
