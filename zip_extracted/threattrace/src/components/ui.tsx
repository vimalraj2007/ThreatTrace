"use client";
import { AlertTriangle, Inbox } from "lucide-react";
import { cn, sevColor } from "@/lib/util";
import type { Severity } from "@/lib/types";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import React from "react";

export const Card = ({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) => (
  <section className={cn("rounded-md border border-line bg-panel", className)}>
    {title && <header className="flex items-center justify-between border-b border-line px-4 py-2.5"><h3 className="text-[13px] font-semibold text-txt">{title}</h3>{action}</header>}
    <div className="p-4">{children}</div>
  </section>
);
export const SevBadge = ({ s }: { s: Severity }) => <span className={cn("inline-block rounded border px-1.5 py-0.5 text-[11px] font-medium capitalize", sevColor[s])}>{s}</span>;
export const Btn = ({ variant = "ghost", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) => (
  <button {...p} className={cn("inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50",
    variant === "primary" ? "border-accent bg-accent text-bg hover:bg-accent/90" : variant === "danger" ? "border-crit/50 text-crit hover:bg-crit/10" : "border-line text-txt hover:bg-raised", className)} />
);
export const Skeleton = ({ className }: { className?: string }) => <div className={cn("animate-pulse rounded bg-raised", className)} />;
export const Empty = ({ title, hint }: { title: string; hint?: string }) => (
  <div className="flex flex-col items-center gap-2 py-12 text-center"><Inbox className="h-6 w-6 text-mute" /><p className="text-sm text-txt">{title}</p>{hint && <p className="max-w-sm text-xs text-mute">{hint}</p>}</div>
);
export const ErrorBox = ({ error, retry }: { error: unknown; retry?: () => void }) => (
  <div role="alert" className="flex items-start gap-3 rounded-md border border-crit/40 bg-crit/5 p-4">
    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-crit" />
    <div className="text-sm"><p className="text-txt">{error instanceof Error ? error.message : "Something went wrong while loading this view."}</p>
      {retry && <button onClick={retry} className="mt-2 text-xs text-accent underline">Try again</button>}</div>
  </div>
);
export const Stat = ({ label, value, tone }: { label: string; value: ReactNode; tone?: string }) => (
  <div className="rounded-md border border-line bg-panel px-4 py-3"><p className="text-xs text-mute">{label}</p><p className={cn("mt-1 font-mono text-2xl font-semibold tabular-nums", tone)}>{value}</p></div>
);
export const Chip = ({ children, tone = "text-mute border-line" }: { children: ReactNode; tone?: string }) => <span className={cn("inline-block rounded border px-1.5 py-0.5 font-mono text-[11px]", tone)}>{children}</span>;
export const Page = ({ title, sub, actions, children }: { title: string; sub?: string; actions?: ReactNode; children: ReactNode }) => (
  <div className="mx-auto max-w-[1500px] space-y-4 p-5">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-lg font-semibold">{title}</h1>{sub && <p className="text-xs text-mute">{sub}</p>}</div>{actions}</div>{children}
  </div>
);
export function Q<D>({ q, skeleton, children }: { q: { data?: D; isLoading: boolean; error: unknown; refetch: () => void }; skeleton?: ReactNode; children: (d: D) => ReactNode }) {
  if (q.isLoading) return <>{skeleton ?? <div className="space-y-2"><Skeleton className="h-8" /><Skeleton className="h-40" /></div>}</>;
  if (q.error) return <ErrorBox error={q.error} retry={q.refetch} />;
  if (!q.data) return <Empty title="No data returned" />;
  return <>{children(q.data)}</>;
}
export class Boundary extends React.Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <ErrorBox error={new Error("This panel failed to render. Reload the page or try another view.")} /> : this.props.children; }
}
