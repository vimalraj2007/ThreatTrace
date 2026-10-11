"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  Activity, 
  Server, 
  Network, 
  User, 
  Target, 
  ArrowRight, 
  AlertTriangle, 
  ExternalLink,
  Flame,
  Clock,
  Grid3X3,
  Layers
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import { useDemoContext } from "@/context/DemoContext";
import { 
  initialStats, 
  mockActivityTimelineData, 
  mockSourceDestRelationships,
  mockNextTargets,
  mockHostsList
} from "@/data/mockData";
import { getSeverityBadgeColor } from "@/lib/utils";

const pieData = [
  { name: "Critical", value: 1, color: "#ef4444" },
  { name: "High", value: 1, color: "#f97316" },
  { name: "Medium", value: 1, color: "#f59e0b" },
  { name: "Low", value: 1, color: "#3b82f6" },
];

const mitreDistData = [
  { technique: "PowerShell (T1059)", count: 18 },
  { technique: "LSASS Dump (T1003)", count: 14 },
  { technique: "SMB Share (T1021)", count: 26 },
  { technique: "C2 Protocols (T1071)", count: 32 },
  { technique: "LDAP Recon (T1087)", count: 12 },
];

export default function DashboardPage() {
  const { incidents } = useDemoContext();

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl backdrop-blur">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white font-mono">
              SOC Security Telemetry Command Center
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Active Monitoring
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time correlation of authentication logs, DNS requests, and process tree telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/logs"
            className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition shadow-lg shadow-cyan-950 flex items-center gap-2"
          >
            <span>Ingest New Telemetry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/incidents/INC-001"
            className="px-3.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-semibold transition flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Open Incident INC-001</span>
          </Link>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Events</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {initialStats.totalEvents.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400">↑ 12% in last 1 hour</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Incidents</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-xl font-bold text-red-400 font-mono">
            {initialStats.activeIncidents}
          </div>
          <span className="text-[10px] text-red-400 font-medium">1 Critical Stage</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Suspicious Hosts</span>
            <Server className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-xl font-bold text-orange-400 font-mono">
            {initialStats.suspiciousHosts}
          </div>
          <span className="text-[10px] text-slate-400">PC-03, PC-05, FILE-SERVER</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Lateral Movements</span>
            <Network className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 font-mono">
            {initialStats.lateralMovements}
          </div>
          <span className="text-[10px] text-amber-400">NTLM & SMB Remote Share</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>High-Risk Users</span>
            <User className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-400 font-mono">
            {initialStats.highRiskUsers}
          </div>
          <span className="text-[10px] text-purple-300">svc_backup, domain_user</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 bg-cyan-500/5 space-y-1">
          <div className="flex items-center justify-between text-cyan-400 text-xs">
            <span>Potential Next Targets</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-300 font-mono">
            {initialStats.potentialNextTargets}
          </div>
          <span className="text-[10px] text-cyan-400">DOMAIN-CONTROLLER</span>
        </div>
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* A. Attack Activity Timeline Chart (Spike chart) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Attack Activity Timeline & Anomaly Frequency</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Correlated event telemetry volume and anomaly risk score over time.
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
              Spike Peak @ 10:00
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockActivityTimelineData}>
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSeverity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }}
                />
                <Area type="monotone" dataKey="events" stroke="#06b6d4" fillOpacity={1} fill="url(#colorEvents)" name="Events" />
                <Area type="monotone" dataKey="severityScore" stroke="#ef4444" fillOpacity={1} fill="url(#colorSeverity)" name="Anomaly Risk Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* B. Incident Severity Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Incident Severity Breakdown</span>
            </h3>
            <p className="text-[11px] text-slate-400">Current open threat classifications.</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-slate-300">1 Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span className="text-slate-300">1 High</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-300">1 Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-slate-300">1 Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Lateral Movement & Potential Next Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* F. Lateral Movement Summary Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Lateral Movement Vectors</h3>
                <p className="text-[11px] text-slate-400">Reconstructed authentication jumps across hosts.</p>
              </div>
            </div>
            <Link href="/incidents/INC-001" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
              <span>View Full Graph</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-red-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-red-400">Jump 1: Workstation to Workstation</span>
                <span className="text-[10px] font-mono text-slate-400">10:07:20 UTC</span>
              </div>
              <div className="flex items-center justify-around bg-slate-900 p-2 rounded-lg text-xs font-mono">
                <span className="text-red-400 font-bold">PC-03 (192.168.1.103)</span>
                <span className="text-amber-400">── NTLM Remote Auth ──►</span>
                <span className="text-red-400 font-bold">PC-05 (192.168.1.105)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                LSASS credential harvest on PC-03 yielded domain_user_alpha hash, enabling remote SMB session to PC-05.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-red-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-red-400">Jump 2: Workstation to File Server</span>
                <span className="text-[10px] font-mono text-slate-400">10:09:50 UTC</span>
              </div>
              <div className="flex items-center justify-around bg-slate-900 p-2 rounded-lg text-xs font-mono">
                <span className="text-red-400 font-bold">PC-05 (192.168.1.105)</span>
                <span className="text-red-400">── SMB ADMIN$ Share ──►</span>
                <span className="text-red-400 font-bold">FILE-SERVER (192.168.1.200)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Stolen service token (svc_backup) used to register PSEXESVC remote administrative service on FILE-SERVER.
              </p>
            </div>
          </div>
        </div>

        {/* G. Potential Next Targets */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 bg-cyan-500/5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Potential Next Target Assessment</h3>
                <p className="text-[11px] text-cyan-300">AI Predictive lateral path assessment based on telemetry evidence.</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
              Confidence 92%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-cyan-400 font-mono uppercase font-semibold">High Priority Target</span>
                <h4 className="text-base font-extrabold text-white font-mono">
                  DOMAIN-CONTROLLER (192.168.1.10)
                </h4>
                <p className="text-[11px] text-slate-400">Primary Active Directory Domain Controller</p>
              </div>
              <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                Critical Priority
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-300 block">
                Evidence Supporting This Assessment:
              </span>
              <ul className="space-y-1 text-[11px] text-slate-300">
                {mockNextTargets[0].evidencePoints.slice(0, 3).map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold shrink-0">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[10px]">
                Anticipated Vector: DCSync / LDAP Injection
              </span>
              <Link
                href="/incidents/INC-001?tab=next-target"
                className="text-cyan-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Investigation Priority Actions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* H. Recent Incidents List & Suspicious Hosts Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incidents Table */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Correlated Incidents Queue</span>
            </h3>
            <Link href="/incidents" className="text-xs text-cyan-400 hover:underline">
              View All (4)
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-mono">
                  <th className="py-2.5 px-3">Incident ID</th>
                  <th className="py-2.5 px-3">Title & Stage</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Initial Host</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-850/50 transition">
                    <td className="py-3 px-3 font-mono font-bold text-cyan-400">
                      {inc.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{inc.title}</div>
                      <div className="text-[10px] text-slate-400">
                        Stage: <span className="text-slate-300 font-mono">{inc.attackStage}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeColor(inc.severity)}`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {inc.initialHost}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/incidents/${inc.id}`}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition inline-flex items-center gap-1"
                      >
                        <span>Investigate</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Source / Destination Relationships */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              <span>Top Network Relationships</span>
            </h3>
            <p className="text-[11px] text-slate-400">Frequent host-to-host traffic vectors.</p>
          </div>

          <div className="space-y-2">
            {mockSourceDestRelationships.map((rel, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <div className="font-mono text-slate-200 font-semibold flex items-center gap-1.5">
                    <span>{rel.source}</span>
                    <span className="text-cyan-400 text-[10px]">►</span>
                    <span>{rel.target}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {rel.type} • {rel.events} Events
                  </div>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getSeverityBadgeColor(rel.risk)}`}>
                  {rel.risk}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight(props: any) {
  return <ArrowRight {...props} />;
}
