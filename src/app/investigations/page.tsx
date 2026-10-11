"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  UserCheck, 
  Plus, 
  CheckCircle2, 
  Bookmark, 
  FileText, 
  ShieldAlert,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { useDemoContext } from "@/context/DemoContext";
import { getSeverityBadgeColor } from "@/lib/utils";

export default function InvestigationsPage() {
  const { incidents, updateIncidentStatus, assignIncident, addNoteToIncident } = useDemoContext();
  const [selectedIncidentId, setSelectedIncidentId] = useState("INC-001");
  const [noteInput, setNoteInput] = useState("");

  const activeIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    addNoteToIncident(activeIncident.id, noteInput);
    setNoteInput("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl backdrop-blur">
        <div>
          <h1 className="text-xl font-bold text-white font-mono">
            Analyst Investigation Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Collaborative DFIR workspace for evidence book-marking, peer analyst notes, and status management.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Incidents List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 font-mono uppercase block">Assigned Incident Workbench</span>
          <div className="space-y-2">
            {incidents.map((inc) => {
              const isSelected = inc.id === selectedIncidentId;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                    isSelected
                      ? "bg-slate-900 border-cyan-500/50 shadow-glow-cyan"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-400">{inc.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeColor(inc.severity)}`}>
                      {inc.severity}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-100">{inc.title}</h3>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Host: {inc.initialHost}</span>
                    <span>Assigned: {inc.assignedTo || "Unassigned"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Incident Workspace */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-cyan-400">{activeIncident.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeColor(activeIncident.severity)}`}>
                  {activeIncident.severity}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">{activeIncident.title}</h2>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={activeIncident.status}
                onChange={(e) => updateIncidentStatus(activeIncident.id, e.target.value as any)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
              >
                <option value="New">Status: New</option>
                <option value="Investigating">Status: Investigating</option>
                <option value="Contained">Status: Contained</option>
                <option value="Resolved">Status: Resolved</option>
                <option value="False Positive">Status: False Positive</option>
              </select>

              <select
                value={activeIncident.assignedTo || "Unassigned"}
                onChange={(e) => assignIncident(activeIncident.id, e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
              >
                <option value="Unassigned">Assignee: Unassigned</option>
                <option value="Analyst Sarah Connor (Tier 3)">Sarah Connor (Tier 3)</option>
                <option value="Analyst Alex Rivera (Tier 2)">Alex Rivera (Tier 2)</option>
                <option value="Analyst Mark Vance (Tier 1)">Mark Vance (Tier 1)</option>
              </select>
            </div>
          </div>

          {/* Bookmarked Evidence */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-200 block flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-cyan-400" /> Bookmarked Evidence Artifacts
            </span>
            <div className="space-y-2">
              {(activeIncident.evidenceBookmarks || []).map((ev) => (
                <div key={ev.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-bold">{ev.eventId}</span>
                    <span className="text-[10px] text-slate-400">Added by: {ev.addedBy}</span>
                  </div>
                  <p className="text-slate-300">{ev.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analyst Notes Log */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-200 block flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-purple-400" /> Investigation Log & Peer Notes
            </span>
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {(activeIncident.notes || []).map((note) => (
                <div key={note.id} className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-cyan-400">{note.author}</span>
                    <span className="font-mono">{note.timestamp.slice(11, 19)} UTC</span>
                  </div>
                  <p className="text-slate-300">{note.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handlePostNote} className="flex gap-2 pt-2">
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Type investigation comment or decision rationale..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition"
              >
                Post Note
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
