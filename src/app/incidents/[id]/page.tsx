"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  Activity, 
  Server, 
  Network, 
  Clock, 
  Flame, 
  Target, 
  Grid3X3, 
  FileText, 
  Bookmark, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ChevronRight,
  User,
  Terminal,
  ExternalLink,
  Zap,
  Plus,
  X,
  FileCode,
  Download
} from "lucide-react";
import { useDemoContext } from "@/context/DemoContext";
import { 
  mockGraphData, 
  mockTimelineEvents, 
  mockMitreTechniques, 
  mockLateralMovementSteps, 
  mockNextTargets,
  mockHostsList 
} from "@/data/mockData";
import { AttackGraph } from "@/components/graph/AttackGraph";
import { TimelineEvent } from "@/types";
import { getSeverityBadgeColor, formatDate } from "@/lib/utils";

export default function IncidentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { incidents, updateIncidentStatus, addNoteToIncident, bookmarkEvidence } = useDemoContext();

  const incident = incidents.find((i) => i.id.toLowerCase() === id.toLowerCase()) || incidents[0];

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState<TimelineEvent | null>(null);
  const [newNoteText, setNewNoteText] = useState("");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addNoteToIncident(incident.id, newNoteText);
    setNewNoteText("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 backdrop-blur space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded">
                {incident.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${getSeverityBadgeColor(incident.severity)}`}>
                {incident.severity.toUpperCase()} SEVERITY
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Confidence: {incident.confidence}%
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Stage: {incident.attackStage}
              </span>
            </div>

            <h1 className="text-xl font-extrabold text-white font-mono tracking-tight mt-1">
              {incident.title}
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              {incident.description}
            </p>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <select
              value={incident.status}
              onChange={(e) => updateIncidentStatus(incident.id, e.target.value as any)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
            >
              <option value="New">Status: New</option>
              <option value="Investigating">Status: Investigating</option>
              <option value="Contained">Status: Contained</option>
              <option value="Resolved">Status: Resolved</option>
              <option value="False Positive">Status: False Positive</option>
            </select>

            <Link
              href={`/reports`}
              className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-950"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Report</span>
            </Link>
          </div>
        </div>

        {/* Quick Incident Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Initial Access Host</span>
            <span className="font-mono text-slate-200 font-bold text-xs">{incident.initialHost}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Compromised Hosts</span>
            <span className="font-mono text-red-400 font-bold text-xs">
              {incident.affectedHosts.join(", ")}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">First Seen / Last Seen</span>
            <span className="font-mono text-slate-300 text-[11px]">
              {incident.firstSeen.slice(11, 19)} - {incident.lastSeen.slice(11, 19)} UTC
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Attack Duration</span>
            <span className="font-mono text-cyan-400 font-bold text-xs">12 mins 43 secs</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 overflow-x-auto pb-1 text-xs">
        {[
          { id: "overview", label: "Overview", icon: Activity },
          { id: "graph", label: "Attack Graph", icon: Network },
          { id: "timeline", label: "Attack Timeline", icon: Clock },
          { id: "evidence", label: "Evidence", icon: Bookmark },
          { id: "hosts", label: "Compromised Hosts", icon: Server },
          { id: "mitre", label: "MITRE ATT&CK", icon: Grid3X3 },
          { id: "lateral", label: "Lateral Movement", icon: Flame },
          { id: "next-target", label: "Next Target", icon: Target },
          { id: "report", label: "Investigation Report", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg font-medium transition border-t border-x shrink-0 ${
                isActive
                  ? "bg-slate-900 text-cyan-400 border-slate-800 border-b-slate-900 font-bold"
                  : "bg-slate-950/50 text-slate-400 border-transparent hover:text-slate-200"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Attack Progression Flowchart */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Attack Progression Stage Flow</span>
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
              {[
                { stage: "Initial Activity", host: "PC-03", status: "DNS C2 Callback" },
                { stage: "Execution", host: "PC-03", status: "Encoded PowerShell" },
                { stage: "Credential Access", host: "PC-03", status: "LSASS Dumping" },
                { stage: "Discovery", host: "PC-03", status: "Domain Recon" },
                { stage: "Lateral Movement", host: "PC-03 → PC-05", status: "NTLM Remote Auth" },
                { stage: "Server Access", host: "FILE-SERVER", status: "SMB Admin Share" }
              ].map((step, idx, arr) => (
                <React.Fragment key={idx}>
                  <div className="flex-1 w-full bg-slate-900 p-3 rounded-lg border border-red-500/30 text-center space-y-1">
                    <span className="text-[10px] font-mono text-red-400 font-bold uppercase block">
                      Stage {idx + 1}
                    </span>
                    <span className="text-xs font-extrabold text-white block">{step.stage}</span>
                    <span className="text-[10px] font-mono text-cyan-400 block">{step.host}</span>
                    <span className="text-[10px] text-slate-400 block">{step.status}</span>
                  </div>
                  {idx < arr.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-red-500 shrink-0 hidden md:block" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Summary Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-100">Correlated Telemetry Summary</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Initial DNS beaconing on <span className="font-mono text-cyan-400 font-semibold">PC-03</span> resolved C2 IP 185.220.101.5. Within 2 minutes, Microsoft Word spawned an encoded PowerShell payload that dumped LSASS memory. Using harvested credentials (<span className="font-mono text-purple-300">domain_user_alpha</span>), the adversary executed an NTLM remote authentication logon to <span className="font-mono text-cyan-400 font-semibold">PC-05</span>, subsequently registering remote administrative shares on <span className="font-mono text-cyan-400 font-semibold">FILE-SERVER</span>.
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-200 block">Identified ATT&CK Tactics</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/15 text-red-400 border border-red-500/30 font-mono">T1059.001 PowerShell</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/15 text-red-400 border border-red-500/30 font-mono">T1003.001 LSASS Memory</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-orange-500/15 text-orange-400 border border-orange-500/30 font-mono">T1021.002 SMB Shares</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono">T1087.002 Domain Recon</span>
                </div>
              </div>
            </div>

            {/* Investigator Notes Panel */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100 mb-3">Analyst Investigation Notes</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(incident.notes || []).map((note) => (
                    <div key={note.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span className="font-bold text-cyan-400">{note.author}</span>
                        <span className="font-mono">{note.timestamp.slice(11, 19)} UTC</span>
                      </div>
                      <p className="text-slate-300">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add analyst note or observation..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. ATTACK GRAPH TAB */}
      {activeTab === "graph" && (
        <div className="animate-in fade-in duration-150 space-y-4">
          <AttackGraph data={mockGraphData} height="650px" />
        </div>
      )}

      {/* 3. TIMELINE TAB */}
      {activeTab === "timeline" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            Click any telemetry event to inspect normalized fields, raw JSON payload, & detection triggers.
          </div>

          <div className="space-y-3">
            {mockTimelineEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setSelectedTimelineEvent(evt)}
                className="p-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-cyan-400">{evt.timestamp.slice(11, 19)} UTC</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeColor(evt.severity)}`}>
                      {evt.severity}
                    </span>
                    <span className="font-semibold text-slate-100 group-hover:text-cyan-300 transition">
                      {evt.eventType} ({evt.mitreTechniqueId})
                    </span>
                  </div>
                  <span className="font-mono text-xs text-slate-400">{evt.id}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono bg-slate-950 p-2 rounded-lg border border-slate-850">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Host:</span>
                    <span className="text-slate-200 font-bold">{evt.host}</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">User:</span>
                    <span className="text-purple-300 font-bold">{evt.user}</span>
                  </div>
                  <span className="text-slate-400 truncate max-w-md">{evt.normalizedEvent}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Event Modal */}
          {selectedTimelineEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Event Telemetry Inspector</h3>
                    <span className="font-mono text-xs text-cyan-400">{selectedTimelineEvent.id}</span>
                  </div>
                  <button onClick={() => setSelectedTimelineEvent(null)} className="p-1 text-slate-400 hover:text-slate-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Timestamp</span>
                      <span className="font-mono text-slate-200">{selectedTimelineEvent.timestamp}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Host & User</span>
                      <span className="font-mono text-slate-200">{selectedTimelineEvent.host} ({selectedTimelineEvent.user})</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-slate-400 block text-[10px]">Normalized Event</span>
                    <p className="text-slate-200 font-semibold">{selectedTimelineEvent.normalizedEvent}</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-slate-400 block text-[10px]">Detection Trigger Reason</span>
                    <p className="text-amber-300">{selectedTimelineEvent.detectionReason}</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-slate-400 block text-[10px]">Raw Log JSON</span>
                    <pre className="text-[11px] font-mono text-cyan-300 overflow-x-auto p-2 bg-slate-900 rounded border border-slate-800">
                      {selectedTimelineEvent.rawEvent}
                    </pre>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      bookmarkEvidence(incident.id, {
                        eventId: selectedTimelineEvent.id,
                        description: selectedTimelineEvent.normalizedEvent,
                        addedBy: "Analyst Sarah Connor",
                        severity: selectedTimelineEvent.severity
                      });
                      setSelectedTimelineEvent(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition"
                  >
                    Bookmark as Evidence
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. EVIDENCE TAB */}
      {activeTab === "evidence" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-cyan-400" />
              <span>Bookmarked Evidence Artifacts ({incident.evidenceBookmarks?.length || 0})</span>
            </h3>

            <div className="space-y-3">
              {(incident.evidenceBookmarks || []).map((ev) => (
                <div key={ev.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-400">{ev.eventId}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeColor(ev.severity)}`}>
                      {ev.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium">{ev.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-850 pt-2 font-mono">
                    <span>Added by: {ev.addedBy}</span>
                    <span>Timestamp: {ev.timestamp.slice(11, 19)} UTC</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. HOSTS TAB */}
      {activeTab === "hosts" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockHostsList.slice(0, 3).map((host) => (
              <div key={host.hostname} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-white">{host.hostname}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeColor(host.risk)}`}>
                    {host.status}
                  </span>
                </div>
                <div className="text-xs space-y-1 font-mono text-slate-300">
                  <div>IP: <span className="text-cyan-400">{host.ip}</span></div>
                  <div>OS: <span className="text-slate-400">{host.os}</span></div>
                  <div>Active Users: <span className="text-purple-300">{host.users.join(", ")}</span></div>
                </div>
                <Link
                  href={`/hosts?selected=${host.hostname}`}
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1"
                >
                  <span>View Host Deep Dive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. MITRE TAB */}
      {activeTab === "mitre" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-cyan-400" />
              <span>Mapped MITRE ATT&CK Techniques</span>
            </h3>

            <div className="space-y-3">
              {mockMitreTechniques.map((tech) => (
                <div key={tech.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded">
                        {tech.id}
                      </span>
                      <span className="font-bold text-slate-100 text-xs">{tech.name}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">Tactic: {tech.tactic}</span>
                  </div>
                  <p className="text-xs text-slate-300">{tech.evidence}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Affected Hosts: {tech.affectedHosts.join(", ")}</span>
                    <span>Confidence: {tech.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. LATERAL MOVEMENT TAB */}
      {activeTab === "lateral" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-400" />
                <span>Reconstructed Lateral Movement Vector Path</span>
              </h3>
              <p className="text-xs text-slate-400">Sequential authentication and remote administrative share access.</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-red-500/30 flex flex-col md:flex-row items-center justify-around gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-900 rounded-lg text-center border border-red-500/40">
                <span className="text-red-400 font-bold block">PC-03</span>
                <span className="text-[10px] text-slate-400">192.168.1.103</span>
              </div>
              <span className="text-amber-400 font-bold text-xs">► NTLM Auth ►</span>
              <div className="p-3 bg-slate-900 rounded-lg text-center border border-red-500/40">
                <span className="text-red-400 font-bold block">PC-05</span>
                <span className="text-[10px] text-slate-400">192.168.1.105</span>
              </div>
              <span className="text-red-400 font-bold text-xs">► SMB ADMIN$ Share ►</span>
              <div className="p-3 bg-slate-900 rounded-lg text-center border border-red-500/40">
                <span className="text-red-400 font-bold block">FILE-SERVER</span>
                <span className="text-[10px] text-slate-400">192.168.1.200</span>
              </div>
            </div>

            <div className="space-y-3">
              {mockLateralMovementSteps.map((step) => (
                <div key={step.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-mono font-bold text-slate-200">
                    <span>{step.source} ──► {step.destination}</span>
                    <span className="text-cyan-400">{step.authType}</span>
                  </div>
                  <p className="text-slate-300">{step.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. NEXT TARGET TAB */}
      {activeTab === "next-target" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 bg-cyan-500/5 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <span>Potential Next Targets Assessment</span>
              </h3>
              <p className="text-xs text-cyan-300 mt-1">
                AI Predictive Lateral Path Engine assessment based on correlated network & directory telemetry evidence.
              </p>
            </div>

            <div className="space-y-4">
              {mockNextTargets.map((target) => (
                <div key={target.id} className="p-5 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs text-cyan-400 font-mono font-bold uppercase block">
                        Potential Next Target
                      </span>
                      <h4 className="text-lg font-extrabold text-white font-mono">{target.asset} ({target.ip})</h4>
                      <p className="text-xs text-slate-400">{target.role}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold border ${getSeverityBadgeColor(target.priority)}`}>
                      {target.priority} Priority
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-200 block">Evidence Supporting This Assessment:</span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {target.evidencePoints.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-cyan-400 font-bold shrink-0">✓</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">Investigation Priority Reasoning</span>
                    <p className="text-slate-300 leading-relaxed">{target.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. REPORT TAB */}
      {activeTab === "report" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Investigation Report Preview</h3>
                <p className="text-xs text-slate-400">Executive & technical breakdown ready for export.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("PDF Export generated successfully!")}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300 bg-slate-950 p-6 rounded-xl border border-slate-800">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="font-mono text-sm font-bold text-cyan-400">Executive Summary</h4>
                <p className="mt-1 leading-relaxed">
                  ThreatTrace AI correlation identified an active multi-stage intrusion spanning 3 internal hosts. Initial entry via PC-03 with credential theft leading to SMB lateral movement into FILE-SERVER. Active reconnaissance against DOMAIN-CONTROLLER indicates imminent Active Directory compromise vector.
                </p>
              </div>

              <div>
                <h4 className="font-mono text-sm font-bold text-cyan-400 mb-2">Recommended Immediate Actions</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Isolate PC-03, PC-05, and FILE-SERVER network interfaces via EDR.</li>
                  <li>Revoke Kerberos tickets for compromised account domain_user_alpha and svc_backup.</li>
                  <li>Block C2 domain suspicious-domain.com at DNS sinkhole.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
