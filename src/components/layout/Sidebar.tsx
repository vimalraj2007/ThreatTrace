"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShieldAlert, 
  UploadCloud, 
  Network, 
  Server, 
  Grid3X3, 
  Briefcase, 
  FileText, 
  Settings,
  Flame,
  HelpCircle,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Incidents", href: "/incidents", icon: ShieldAlert, badge: "4 Active" },
  { name: "Log Ingestion", href: "/logs", icon: UploadCloud },
  { name: "Attack Graph", href: "/graph", icon: Network },
  { name: "Host Assets", href: "/hosts", icon: Server },
  { name: "MITRE ATT&CK", href: "/mitre", icon: Grid3X3 },
  { name: "Investigations", href: "/investigations", icon: Briefcase },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "SOC Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-3 space-y-6">
        {/* Navigation Group */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            SOC Navigation
          </div>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition group",
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-300"
                    )} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-red-500/20 text-red-400 border border-red-500/30 font-mono">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Threat Intelligence Alert Banner */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> Lateral Move Engine
            </span>
            <span className="px-1 py-0.2 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded">
              v2.4 Active
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            AI telemetry correlation automatically tracking SMB NTLM auth anomalies and Kerberos ticket reuse across hosts.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1 bg-slate-950">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px]">ThreatTrace v4.12.0</span>
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> SOC Online
          </span>
        </div>
      </div>
    </aside>
  );
}
