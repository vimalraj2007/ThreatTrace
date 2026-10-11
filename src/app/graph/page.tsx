"use client";

import React, { useState } from "react";
import { AttackGraph } from "@/components/graph/AttackGraph";
import { mockGraphData } from "@/data/mockData";
import { Network, ShieldAlert, Layers, Target, Activity } from "lucide-react";

export default function DedicatedGraphPage() {
  const [selectedIncidentId, setSelectedIncidentId] = useState("INC-001");

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl backdrop-blur">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white font-mono">
              Global SOC Attack Graph Visualizer
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
              Cytoscape Engine Live
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Interactive graph topology mapping host nodes, authentication edges, process spawns, and lateral movement paths.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-semibold">Incident Graph:</label>
          <select
            value={selectedIncidentId}
            onChange={(e) => setSelectedIncidentId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="INC-001">INC-001: Multi-stage Lateral Movement</option>
            <option value="INC-002">INC-002: Ransomware Staging</option>
            <option value="INC-003">INC-003: DNS Exfiltration</option>
          </select>
        </div>
      </div>

      <AttackGraph data={mockGraphData} height="calc(100vh - 15rem)" />
    </div>
  );
}
