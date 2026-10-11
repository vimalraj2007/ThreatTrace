"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  Search, 
  Bell, 
  Activity, 
  PlayCircle, 
  UserCheck,
  Zap,
  UploadCloud
} from "lucide-react";
import { useDemoContext } from "@/context/DemoContext";

export function Navbar() {
  const { setIsSearchOpen, loadDemoData } = useDemoContext();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 group-hover:border-cyan-400/60 transition shadow-glow-cyan">
              <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:scale-105 transition-transform" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-mono">
                  ThreatTrace
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  SOC Enterprise
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden md:block">
                AI Cyberattack Reconstruction & Lateral Movement Detection
              </p>
            </div>
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 hover:text-slate-200 transition"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-500" />
              <span>Search Host, IP, User, Domain, Process, Incident...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-800 border border-slate-700 rounded">
              ⌘K / Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Reload */}
          <button
            onClick={loadDemoData}
            title="Reload Synthetic Attack Scenario"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-medium hover:bg-cyan-500/20 transition"
          >
            <PlayCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Demo Attack</span>
          </button>

          {/* Quick Ingest Button */}
          <Link
            href="/logs"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 text-xs font-medium hover:bg-slate-800 hover:border-slate-600 transition"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Ingest Telemetry</span>
          </Link>

          <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

          {/* SOC System Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-mono text-[11px]">SIEM Stream Live</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>

          {/* Analyst Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-semibold text-xs font-mono">
              SC
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-medium text-slate-200 leading-tight">
                Sarah Connor
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Tier 3 Lead Analyst
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
