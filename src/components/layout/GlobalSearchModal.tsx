"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoContext } from "@/context/DemoContext";
import { 
  Search, 
  X, 
  ShieldAlert, 
  Server, 
  User, 
  Globe, 
  Terminal, 
  Network, 
  ChevronRight,
  FileCode
} from "lucide-react";
import { 
  mockIncidents, 
  mockHostsList, 
  mockTimelineEvents 
} from "@/data/mockData";

export function GlobalSearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useDemoContext();
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Keyboard shortcut listener Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedIncidents = q
    ? mockIncidents.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          i.initialHost.toLowerCase().includes(q)
      )
    : mockIncidents;

  const matchedHosts = q
    ? mockHostsList.filter(
        (h) =>
          h.hostname.toLowerCase().includes(q) ||
          h.ip.toLowerCase().includes(q) ||
          h.os.toLowerCase().includes(q)
      )
    : mockHostsList.slice(0, 4);

  const matchedEvents = q
    ? mockTimelineEvents.filter(
        (e) =>
          e.id.toLowerCase().includes(q) ||
          e.host.toLowerCase().includes(q) ||
          e.user.toLowerCase().includes(q) ||
          e.eventType.toLowerCase().includes(q) ||
          e.mitreTechniqueId.toLowerCase().includes(q)
      )
    : mockTimelineEvents.slice(0, 3);

  const handleSelectIncident = (id: string) => {
    setIsSearchOpen(false);
    setQuery("");
    router.push(`/incidents/${id}`);
  };

  const handleSelectHost = (hostname: string) => {
    setIsSearchOpen(false);
    setQuery("");
    router.push(`/hosts?selected=${hostname}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-950">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Host, IP, User, Domain, Process, Incident ID, Event ID..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Incidents Category */}
          {matchedIncidents.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Active Incidents
              </div>
              <div className="space-y-1">
                {matchedIncidents.map((inc) => (
                  <button
                    key={inc.id}
                    onClick={() => handleSelectIncident(inc.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                        {inc.id}
                      </span>
                      <div>
                        <span className="font-semibold text-slate-200 group-hover:text-cyan-400 transition">
                          {inc.title}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          Initial Host: {inc.initialHost} • Stage: {inc.attackStage}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Hosts Category */}
          {matchedHosts.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" /> Host Assets & IP Addresses
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedHosts.map((host) => (
                  <button
                    key={host.hostname}
                    onClick={() => handleSelectHost(host.hostname)}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition group"
                  >
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-200 group-hover:text-cyan-400 transition">
                          {host.hostname}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {host.ip} • {host.os.split(" ")[0]}
                        </div>
                      </div>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                      host.status === "Compromised" ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}>
                      {host.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Events Category */}
          {matchedEvents.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-amber-400" /> Telemetry Events
              </div>
              <div className="space-y-1">
                {matchedEvents.map((evt) => (
                  <button
                    key={evt.id}
                    onClick={() => handleSelectIncident("INC-001")}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-cyan-400 text-[11px] font-bold">{evt.id}</span>
                      <div>
                        <span className="font-semibold text-slate-200 group-hover:text-cyan-400 transition">
                          {evt.eventType} ({evt.mitreTechniqueId})
                        </span>
                        <div className="text-[10px] text-slate-400 truncate max-w-md">
                          Host: {evt.host} • User: {evt.user} • {evt.normalizedEvent}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{evt.timestamp.slice(11, 19)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Tip: Press ESC to close</span>
          <span className="font-mono text-[10px]">ThreatTrace Correlated Telemetry Engine</span>
        </div>
      </div>
    </div>
  );
}
