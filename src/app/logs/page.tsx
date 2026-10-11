"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  UploadCloud, 
  FileCheck, 
  FileSpreadsheet, 
  FileCode, 
  CheckCircle2, 
  Play, 
  Activity, 
  Loader2, 
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Database
} from "lucide-react";
import { IngestionLogFile } from "@/types";

const defaultFiles: IngestionLogFile[] = [
  {
    name: "Authentication.csv",
    type: "authentication",
    recordsCount: 2340,
    validSchema: true,
    sizeMb: 4.2
  },
  {
    name: "DNS_Queries.json",
    type: "dns",
    recordsCount: 5230,
    validSchema: true,
    sizeMb: 8.7
  },
  {
    name: "Endpoint_Processes.csv",
    type: "process",
    recordsCount: 3120,
    validSchema: true,
    sizeMb: 6.1
  },
  {
    name: "Network_Connections.ndjson",
    type: "network",
    recordsCount: 1400,
    validSchema: true,
    sizeMb: 2.8
  }
];

const pipelineSteps = [
  "Parsing logs & verifying checksums...",
  "Normalizing heterogeneous event timestamps...",
  "Correlating authentication & process tree telemetry...",
  "Building Cytoscape graph nodes & edge relationships...",
  "Mapping tactics to MITRE ATT&CK framework...",
  "Analyzing lateral movement paths (NTLM/SMB)...",
  "Generating predictive next-target investigation report..."
];

export default function LogUploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<IngestionLogFile[]>(defaultFiles);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setCurrentStepIndex(0);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < pipelineSteps.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          router.push("/incidents/INC-001");
        }, 600);
      }
    }, 700);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // Add custom synthetic dropped file
    const newFile: IngestionLogFile = {
      name: "Custom_Telemetry_Batch.csv",
      type: "network",
      recordsCount: 1850,
      validSchema: true,
      sizeMb: 3.5
    };
    setFiles((prev) => [...prev, newFile]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-mono">
              Telemetry Ingestion & AI Analysis Pipeline
            </h1>
            <p className="text-xs text-slate-400">
              Upload fragmented CSV, JSON, or NDJSON security telemetry from domain controllers, endpoint EDR, or DNS servers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Upload Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Drag & Drop Box */}
        <div className="lg:col-span-1 space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-3 transition min-h-[300px] ${
              isDragOver
                ? "border-cyan-400 bg-cyan-500/10"
                : "border-slate-800 bg-slate-900 hover:border-slate-700"
            }`}
          >
            <div className="p-4 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                Drag & Drop telemetry files here
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports CSV, JSON, NDJSON (Max 100MB)
              </p>
            </div>
            <label className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700 transition">
              <span>Browse Computer</span>
              <input type="file" multiple className="hidden" onChange={() => {
                const newFile: IngestionLogFile = {
                  name: "Uploaded_SIEM_Logs.csv",
                  type: "authentication",
                  recordsCount: 3400,
                  validSchema: true,
                  sizeMb: 5.1
                };
                setFiles((prev) => [...prev, newFile]);
              }} />
            </label>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
            <span className="font-semibold text-slate-300 block flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-400" /> Supported Log Schemas
            </span>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li>• Windows Security Auth (Event IDs 4624, 4625, 4672)</li>
              <li>• Sysmon Process Creation & Memory (Event IDs 1, 10)</li>
              <li>• DNS Server Analytic Logs (Event ID 22)</li>
              <li>• Network Connection Flow Logs (NetFlow / VPC)</li>
            </ul>
          </div>
        </div>

        {/* Right Preview & Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100">Staged Telemetry Files</h3>
                <p className="text-[11px] text-slate-400">Schema verification and event record counts.</p>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                {files.reduce((a, b) => a + b.recordsCount, 0).toLocaleString()} Total Records
              </span>
            </div>

            {/* File items list */}
            <div className="space-y-2.5">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                      {file.name.endsWith(".csv") ? (
                        <FileSpreadsheet className="w-4 h-4" />
                      ) : (
                        <FileCode className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 block font-mono">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {file.recordsCount.toLocaleString()} records • {file.sizeMb} MB
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Valid Schema ✓
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Analysis Action Button / Progress */}
            {!isAnalyzing ? (
              <button
                onClick={handleStartAnalysis}
                className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition shadow-lg shadow-cyan-950 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Multi-Stage Telemetry Correlation</span>
              </button>
            ) : (
              <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    Executing ThreatTrace AI Correlation Engine...
                  </span>
                  <span className="text-xs font-mono text-slate-300 font-bold">
                    {Math.round(((currentStepIndex + 1) / pipelineSteps.length) * 100)}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-500 ease-out"
                    style={{
                      width: `${((currentStepIndex + 1) / pipelineSteps.length) * 100}%`
                    }}
                  />
                </div>

                {/* Current Pipeline Step */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                  <span className="text-cyan-400 font-bold">Step {currentStepIndex + 1}: </span>
                  <span>{pipelineSteps[currentStepIndex]}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
