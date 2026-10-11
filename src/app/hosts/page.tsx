"use client";

import React, { useState, use } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Server, 
  Search, 
  Filter, 
  Activity, 
  ShieldAlert, 
  Globe, 
  Terminal, 
  User, 
  Network, 
  X, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { mockHostsList } from "@/data/mockData";
import { HostDetails } from "@/types";
import { getSeverityBadgeColor } from "@/lib/utils";

export default function HostsPage({ searchParams }: { searchParams: Promise<{ selected?: string }> }) {
  const resolvedParams = use(searchParams);
  const [search, setSearch] = useState("");
  const [selectedHost, setSelectedHost] = useState<HostDetails | null>(
    mockHostsList.find((h) => h.hostname === resolvedParams?.selected) || mockHostsList[0]
  );

  const filteredHosts = mockHostsList.filter(
    (h) =>
      h.hostname.toLowerCase().includes(search.toLowerCase()) ||
      h.ip.toLowerCase().includes(search.toLowerCase()) ||
      h.os.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl backdrop-blur">
        <div>
          <h1 className="text-xl font-bold text-white font-mono">
            Host Asset Inventory & SOC Telemetry Audit
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor workstation, server, and domain controller asset risk states, active sessions, and process trees.
          </p>
        </div>
      </div>

      {/* Main Inventory & Detail Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Host List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Hostname, IP, OS..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            {filteredHosts.map((host) => {
              const isSelected = selectedHost?.hostname === host.hostname;
              return (
                <div
                  key={host.hostname}
                  onClick={() => setSelectedHost(host)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? "bg-slate-900 border-cyan-500/50 shadow-glow-cyan"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono font-bold text-xs text-slate-100 block">
                        {host.hostname}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {host.ip} • {host.os.split(" ")[0]}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeColor(host.risk)}`}>
                    {host.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Host Detail Card */}
        {selectedHost && (
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white font-mono">{selectedHost.hostname}</h2>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeColor(selectedHost.risk)}`}>
                      {selectedHost.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    IP: {selectedHost.ip} • OS: {selectedHost.os}
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-slate-400 text-[10px] block">Active User Accounts</span>
                <span className="text-purple-300 font-bold">{selectedHost.users.join(", ")}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-slate-400 text-[10px] block">Incident Involvement</span>
                <span className="text-red-400 font-bold">{selectedHost.incidentInvolvement.join(", ")}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-slate-400 text-[10px] block">Inbound Connections</span>
                <span className="text-cyan-400 font-bold">{selectedHost.inboundConnections.length} Active</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-slate-400 text-[10px] block">Outbound Connections</span>
                <span className="text-amber-400 font-bold">{selectedHost.outboundConnections.length} Active</span>
              </div>
            </div>

            {/* Network Connections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200 block flex items-center gap-1.5">
                  <Network className="w-4 h-4 text-cyan-400" /> Inbound Connections
                </span>
                <div className="space-y-1 text-slate-300 font-mono text-[11px]">
                  {selectedHost.inboundConnections.length > 0 ? (
                    selectedHost.inboundConnections.map((conn, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-850">
                        {conn}
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-500 italic">No active inbound connections</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200 block flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-amber-400" /> Outbound Connections
                </span>
                <div className="space-y-1 text-slate-300 font-mono text-[11px]">
                  {selectedHost.outboundConnections.length > 0 ? (
                    selectedHost.outboundConnections.map((conn, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-850">
                        {conn}
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-500 italic">No active outbound connections</span>
                  )}
                </div>
              </div>
            </div>

            {/* Active Processes */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-200 block flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-red-400" /> Running Process Tree Telemetry
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedHost.processes.map((proc, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded border font-mono text-[11px] ${
                      proc.includes("powershell") || proc.includes("PSEXE") || proc.includes("vssadmin")
                        ? "bg-red-500/15 text-red-300 border-red-500/40 font-bold"
                        : "bg-slate-900 text-slate-300 border-slate-800"
                    }`}
                  >
                    {proc}
                  </span>
                ))}
              </div>
            </div>

            {/* DNS & Auth Activity */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-200 block">DNS & Authentication Telemetry</span>
              <div className="space-y-1 text-slate-300 font-mono text-[11px]">
                {selectedHost.dnsActivity.map((dns, idx) => (
                  <div key={idx} className="p-1.5 bg-slate-900 rounded border border-slate-850 text-cyan-300">
                    DNS Query: {dns}
                  </div>
                ))}
                {selectedHost.authActivity.map((auth, idx) => (
                  <div key={idx} className="p-1.5 bg-slate-900 rounded border border-slate-850 text-purple-300">
                    Auth Event: {auth}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
