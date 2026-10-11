"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldAlert, 
  CheckCircle2, 
  Flame, 
  Target, 
  Grid3X3, 
  Server,
  FileCode,
  FileSpreadsheet
} from "lucide-react";
import { 
  mockIncidents, 
  mockLateralMovementSteps, 
  mockMitreTechniques, 
  mockNextTargets, 
  mockHostsList 
} from "@/data/mockData";
import { getSeverityBadgeColor } from "@/lib/utils";

export default function ReportsPage() {
  const [selectedIncidentId, setSelectedIncidentId] = useState("INC-001");
  const incident = mockIncidents.find((i) => i.id === selectedIncidentId) || mockIncidents[0];

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(
        {
          reportId: `REP-${incident.id}`,
          incident,
          lateralMovement: mockLateralMovementSteps,
          mitre: mockMitreTechniques,
          nextTargets: mockNextTargets,
          generatedAt: new Date().toISOString()
        },
        null,
        2
      )
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `ThreatTrace_Report_${incident.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,IncidentID,Title,Severity,InitialHost,Status\n" +
      `${incident.id},"${incident.title}",${incident.severity},${incident.initialHost},${incident.status}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ThreatTrace_Report_${incident.id}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl backdrop-blur">
        <div>
          <h1 className="text-xl font-bold text-white font-mono">
            DFIR Executive & Technical Report Generator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate formal incident reconstruction reports with full telemetry evidence and lateral movement logs.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-lg shadow-cyan-950"
          >
            <Printer className="w-4 h-4" />
            <span>Export / Print PDF</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
          >
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>JSON</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Incident Switcher */}
      <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
        <span className="font-semibold text-slate-300">Select Report Incident:</span>
        <select
          value={selectedIncidentId}
          onChange={(e) => setSelectedIncidentId(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
        >
          {mockIncidents.map((inc) => (
            <option key={inc.id} value={inc.id}>
              {inc.id}: {inc.title}
            </option>
          ))}
        </select>
      </div>

      {/* Formal Printable Document Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8 print:bg-white print:text-black print:p-0">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-extrabold text-white">ThreatTrace Report</span>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                CONFIDENTIAL SOC / DFIR
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-200 mt-2">{incident.title}</h2>
            <div className="text-xs text-slate-400 font-mono mt-1">
              Report ID: REP-{incident.id} • Date Generated: {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="text-right">
            <span className={`px-3 py-1 rounded text-xs font-bold border block w-fit ml-auto ${getSeverityBadgeColor(incident.severity)}`}>
              {incident.severity.toUpperCase()} SEVERITY
            </span>
            <span className="text-xs font-mono text-slate-400 block mt-1">
              Risk Score: {incident.riskScore} / 100
            </span>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider">
            1. Executive Summary
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-850">
            ThreatTrace AI correlation identified an active multi-stage intrusion spanning 3 internal hosts. Initial entry via PC-03 with credential theft leading to SMB lateral movement into FILE-SERVER. Active reconnaissance against DOMAIN-CONTROLLER indicates imminent Active Directory compromise vector.
          </p>
        </div>

        {/* 2. Incident Overview Metrics */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider">
            2. Incident Overview Metrics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-850">
            <div>Initial Host: <span className="text-white font-bold">{incident.initialHost}</span></div>
            <div>Affected Hosts: <span className="text-red-400 font-bold">{incident.affectedHosts.join(", ")}</span></div>
            <div>Attack Stage: <span className="text-emerald-400 font-bold">{incident.attackStage}</span></div>
            <div>Analyst Lead: <span className="text-purple-300 font-bold">{incident.assignedTo || "Sarah Connor"}</span></div>
          </div>
        </div>

        {/* 3. Reconstructed Lateral Movement Vector */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-red-400" /> 3. Reconstructed Lateral Movement Vector
          </h3>
          <div className="space-y-2">
            {mockLateralMovementSteps.map((step) => (
              <div key={step.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-850 text-xs space-y-1 font-mono">
                <div className="flex items-center justify-between text-slate-200 font-bold">
                  <span>{step.source} ──► {step.destination}</span>
                  <span className="text-cyan-400">{step.authType}</span>
                </div>
                <p className="text-slate-400 text-[11px] font-sans">{step.evidence}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. MITRE ATT&CK Mapping */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Grid3X3 className="w-4 h-4 text-cyan-400" /> 4. MITRE ATT&CK Mapping Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {mockMitreTechniques.map((tech) => (
              <div key={tech.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-red-400 font-bold">{tech.id} {tech.name}</span>
                  <span className="text-slate-400 text-[10px]">{tech.tactic}</span>
                </div>
                <p className="text-slate-300 text-[11px]">{tech.evidence}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Potential Next Target Assessment */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-4 h-4 text-cyan-400" /> 5. Potential Next Target Assessment
          </h3>
          <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/30 text-xs space-y-2">
            <div className="flex items-center justify-between font-mono font-bold text-white">
              <span>{mockNextTargets[0].asset} ({mockNextTargets[0].ip})</span>
              <span className="text-red-400">{mockNextTargets[0].priority.toUpperCase()} PRIORITY</span>
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              {mockNextTargets[0].evidencePoints.map((pt, i) => (
                <li key={i}>✓ {pt}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 6. Recommended Actions */}
        <div className="space-y-2 border-t border-slate-800 pt-4">
          <h3 className="text-sm font-bold text-emerald-400 font-mono uppercase tracking-wider">
            6. Recommended Remediation & Containment Actions
          </h3>
          <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 bg-slate-950 p-4 rounded-xl border border-slate-850">
            <li>Immediately isolate PC-03, PC-05, and FILE-SERVER network interfaces via EDR agent.</li>
            <li>Revoke Kerberos TGT and reset passwords for compromised service account 'svc_backup' and 'domain_user_alpha'.</li>
            <li>Block C2 IP 185.220.101.5 and domain 'suspicious-domain.com' at perimeter firewall/DNS sinkhole.</li>
            <li>Perform memory analysis on DOMAIN-CONTROLLER to ensure no active LDAP injection or Golden Ticket persistence has occurred.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
