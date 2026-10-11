"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  ChevronRight, 
  Flame, 
  Clock, 
  Server, 
  User,
  SlidersHorizontal
} from "lucide-react";
import { useDemoContext } from "@/context/DemoContext";
import { getSeverityBadgeColor } from "@/lib/utils";

export default function IncidentsListPage() {
  const { incidents } = useDemoContext();
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredIncidents = incidents.filter((inc) => {
    const s = search.toLowerCase();
    const matchesSearch =
      !s ||
      inc.id.toLowerCase().includes(s) ||
      inc.title.toLowerCase().includes(s) ||
      inc.initialHost.toLowerCase().includes(s) ||
      inc.affectedHosts.some((h) => h.toLowerCase().includes(s));

    const matchesSeverity = severityFilter === "all" || inc.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || inc.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl backdrop-blur">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white font-mono">
              Correlated Security Incidents Queue
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/30">
              {filteredIncidents.length} Active Findings
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-stage attack chains identified through correlated authentication and process tree telemetry.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Incident ID, Host, User, IP, Domain..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Statuses</option>
              <option value="Investigating">Investigating</option>
              <option value="New">New</option>
              <option value="Contained">Contained</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incident Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-[10px] uppercase font-mono">
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Attack Title & Stage</th>
                <th className="py-3 px-4">Initial Host</th>
                <th className="py-3 px-4">Affected Hosts</th>
                <th className="py-3 px-4">Lateral Move</th>
                <th className="py-3 px-4">First Seen</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                    {inc.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeColor(inc.severity)}`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-semibold text-slate-200 truncate">{inc.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Stage: {inc.attackStage} • Confidence: {inc.confidence}%
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {inc.initialHost}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {inc.affectedHosts.map((h) => (
                        <span key={h} className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono text-[10px]">
                          {h}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {inc.hasLateralMovement ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1 w-fit">
                        <Flame className="w-3 h-3 text-red-400" /> Yes
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono text-[10px]">None</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                    {inc.firstSeen.slice(11, 19)} UTC
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                    {inc.riskScore} / 100
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/incidents/${inc.id}`}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition text-xs inline-flex items-center gap-1"
                    >
                      <span>Investigate</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
