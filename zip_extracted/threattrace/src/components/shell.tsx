"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpenCheck, FileText, LayoutDashboard, Network, Search, Server, Settings, ShieldAlert, Siren, Table2, Target } from "lucide-react";
import { useEvents, useHosts, useIncidents } from "@/lib/hooks";
import { cn } from "@/lib/util";
import { Boundary } from "./ui";

const NAV = [
  ["/dashboard", "Dashboard", LayoutDashboard], ["/incidents", "Incidents", Siren], ["/logs", "Log ingest", Table2], ["/graph", "Attack graph", Network],
  ["/hosts", "Hosts", Server], ["/mitre", "MITRE ATT&CK", Target], ["/investigations", "Investigations", BookOpenCheck], ["/reports", "Reports", FileText], ["/settings", "Settings", Settings],
] as const;

function GlobalSearch() {
  const [q, setQ] = useState(""); const router = useRouter();
  const inc = useIncidents(), hosts = useHosts(), ev = useEvents(1, q.length > 1 ? q : "zzzz-none");
  const s = q.trim().toLowerCase();
  const groups = s.length < 2 ? [] : [
    ["Incidents", (inc.data ?? []).filter((i) => (i.id + i.title).toLowerCase().includes(s)).map((i) => ({ k: i.id, l: `${i.id} ${i.title}`, href: `/incidents/${i.id}` }))],
    ["Hosts & IPs", (hosts.data ?? []).filter((h) => (h.name + h.ip).toLowerCase().includes(s)).map((h) => ({ k: h.name, l: `${h.name} (${h.ip})`, href: `/hosts?host=${h.name}` }))],
    ["Users", [...new Set((inc.data ?? []).flatMap((i) => i.users))].filter((u) => u.toLowerCase().includes(s)).map((u) => ({ k: u, l: u, href: `/logs?q=${u}` }))],
    ["Domains & processes", [...new Set((ev.data?.items ?? []).map((e) => e.summary))].slice(0, 4).map((m) => ({ k: m, l: m, href: `/logs?q=${encodeURIComponent(q)}` }))],
    ["Events", (ev.data?.items ?? []).filter((e) => e.id.toLowerCase().includes(s)).slice(0, 4).map((e) => ({ k: e.id, l: `${e.id} ${e.summary}`, href: `/logs?q=${e.id}` }))],
  ].filter(([, r]) => (r as unknown[]).length) as [string, { k: string; l: string; href: string }[]][];
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-2.5 top-2 h-4 w-4 text-mute" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search host, IP, user, domain, process, incident, event ID" aria-label="Global search"
        className="w-full rounded border border-line bg-bg py-1.5 pl-8 pr-3 text-sm placeholder:text-mute focus:border-accent focus:outline-none" />
      {s.length >= 2 && (
        <div className="absolute z-30 mt-1 max-h-96 w-full overflow-y-auto rounded border border-line bg-panel p-2 shadow-xl">
          {groups.length === 0 ? <p className="p-2 text-xs text-mute">No matches for “{q}”.</p> : groups.map(([g, rows]) => (
            <div key={g} className="mb-2"><p className="px-2 text-[11px] text-mute">{g}</p>
              {rows.map((r) => <button key={r.k} onClick={() => { router.push(r.href); setQ(""); }} className="block w-full truncate rounded px-2 py-1 text-left text-sm hover:bg-raised">{r.l}</button>)}</div>))}
        </div>)}
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="flex min-h-screen print:block">
      <nav className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-line bg-panel md:flex print:hidden" aria-label="Primary">
        <Link href="/dashboard" className="flex items-center gap-2 border-b border-line px-4 py-4"><ShieldAlert className="h-5 w-5 text-accent" /><span className="font-semibold tracking-tight">ThreatTrace</span></Link>
        <ul className="flex-1 space-y-0.5 p-2">
          {NAV.map(([href, label, Icon]) => (
            <li key={href}><Link href={href} className={cn("flex items-center gap-2.5 rounded px-3 py-2 text-[13px]", path.startsWith(href) ? "bg-raised text-txt" : "text-mute hover:bg-raised/60 hover:text-txt")}><Icon className="h-4 w-4" />{label}</Link></li>))}
        </ul>
      </nav>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-bg/95 px-5 py-2.5 backdrop-blur print:hidden"><GlobalSearch /></header>
        <main><Boundary>{children}</Boundary></main>
      </div>
    </div>
  );
}
