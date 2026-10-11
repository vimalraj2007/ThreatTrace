"use client";

import React, { useState } from "react";
import { Grid3X3, Search, ShieldAlert, CheckCircle2, ChevronRight, ExternalLink } from "lucide-react";
import { mockMitreTechniques } from "@/data/mockData";
import { MitreTechniqueItem } from "@/types";

const tacticsList = [
  "Initial Access",
  "Execution",
  "Credential Access",
  "Discovery",
  "Lateral Movement",
  "Command and Control",
  "Exfiltration"
];

export default function MitrePage() {
  const [selectedTechnique, setSelectedTechnique] = useState<MitreTechniqueItem | null>(
    mockMitreTechniques[0]
  );
  const [search, setSearch] = useState("");

  const filteredTechniques = mockMitreTechniques.filter(
    (t) =>
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.tactic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl backdrop-blur">
        <div>
          <h1 className="text-xl font-bold text-white font-mono">
            MITRE ATT&CK Enterprise Matrix Mapping
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Correlated adversary tactics, techniques, and procedures (TTPs) mapped to observed telemetry events.
          </p>
        </div>
      </div>

      {/* Tactic Matrix Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs font-mono">
        {tacticsList.map((tactic) => {
          const matchedCount = mockMitreTechniques.filter((t) => t.tactic.toLowerCase().includes(tactic.toLowerCase())).length;
          return (
            <div key={tactic} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block uppercase truncate">{tactic}</span>
              <span className={`text-base font-extrabold block ${matchedCount > 0 ? "text-red-400" : "text-slate-500"}`}>
                {matchedCount} Active
              </span>
            </div>
          );
        })}
      </div>

      {/* Main List & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Techniques List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Technique ID, Name, Tactic..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            {filteredTechniques.map((tech) => {
              const isSelected = selectedTechnique?.id === tech.id;
              return (
                <div
                  key={tech.id}
                  onClick={() => setSelectedTechnique(tech)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition space-y-1.5 ${
                    isSelected
                      ? "bg-slate-900 border-cyan-500/50 shadow-glow-cyan"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded">
                      {tech.id}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Confidence {tech.confidence}%
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-100">{tech.name}</h3>
                  <div className="text-[10px] text-slate-400">
                    Tactic: <span className="text-slate-300 font-mono">{tech.tactic}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Card */}
        {selectedTechnique && (
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-red-400 bg-red-500/10 border border-red-500/30 px-2.5 py-0.5 rounded">
                    {selectedTechnique.id}
                  </span>
                  <h2 className="text-lg font-bold text-white">{selectedTechnique.name}</h2>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  ATT&CK Tactic Phase: {selectedTechnique.tactic}
                </p>
              </div>

              <span className="px-3 py-1 rounded text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                {selectedTechnique.confidence}% Confidence
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 text-xs">
              <span className="font-semibold text-slate-300 block">Observed Telemetry Evidence</span>
              <p className="text-slate-200 font-mono text-[11px] leading-relaxed">
                {selectedTechnique.evidence}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1">
                <span className="text-slate-400 text-[10px]">Affected Host Assets</span>
                <span className="text-cyan-400 font-bold block">{selectedTechnique.affectedHosts.join(", ")}</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1">
                <span className="text-slate-400 text-[10px]">Correlated Telemetry Events</span>
                <span className="text-amber-400 font-bold block">{selectedTechnique.eventsCount} Events</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
