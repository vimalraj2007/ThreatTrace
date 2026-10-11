"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoContext } from "@/context/DemoContext";
import { 
  ShieldAlert, 
  Lock, 
  Mail, 
  ArrowRight, 
  PlayCircle, 
  CheckCircle2, 
  ShieldCheck,
  Server,
  Zap
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loadDemoData } = useDemoContext();
  const [email, setEmail] = useState("analyst.connor@threattrace.soc");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      loadDemoData();
      router.push("/dashboard");
    }, 800);
  };

  const handleDemoClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      loadDemoData();
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background SOC Ambient Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -top-48 -left-48" />
      <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -bottom-48 -right-48" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 shadow-glow-cyan mb-2">
            <ShieldAlert className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white font-mono tracking-tight">
              ThreatTrace
            </h1>
            <p className="text-xs text-cyan-400 font-mono mt-1">
              AI-Assisted Multi-Stage Cyberattack Reconstruction
            </p>
          </div>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Correlate fragmented security telemetry across authentication, DNS, & endpoint process trees.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-200">SOC Analyst Authentication</h2>
            <p className="text-[11px] text-slate-400">Enter enterprise credentials or access instant demo mode.</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Analyst Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@threattrace.soc"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-0"
                />
                <span>Remember session</span>
              </label>
              <a href="#forgot" className="text-cyan-400 hover:underline">
                Forgot credentials?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition shadow-lg shadow-cyan-900/30 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating SOC Analyst...</span>
              ) : (
                <>
                  <span>Sign In to ThreatTrace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
              <span className="bg-slate-900 px-2 text-slate-400">Instant Evaluation</span>
            </div>
          </div>

          {/* Demo Mode Button */}
          <button
            type="button"
            onClick={handleDemoClick}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                <PlayCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block">
                  Continue with Demo Investigation
                </span>
                <span className="text-[10px] text-cyan-300">
                  Pre-load multi-stage lateral attack (PC-03 → FILE-SERVER)
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Feature Badges Footer */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
          <div className="flex items-center justify-center gap-1 bg-slate-900/50 p-2 rounded-lg border border-slate-800/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>MITRE ATT&CK</span>
          </div>
          <div className="flex items-center justify-center gap-1 bg-slate-900/50 p-2 rounded-lg border border-slate-800/80">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>Graph Analytics</span>
          </div>
          <div className="flex items-center justify-center gap-1 bg-slate-900/50 p-2 rounded-lg border border-slate-800/80">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Next Target AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
