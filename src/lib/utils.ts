import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSeverityBadgeColor(severity: string): string {
  switch (severity?.toLowerCase()) {
    case "critical":
      return "bg-red-500/15 text-red-400 border-red-500/30 glow-red";
    case "high":
      return "bg-orange-500/15 text-orange-400 border-orange-500/30 glow-orange";
    case "medium":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "low":
      return "bg-blue-500/15 text-blue-400 border-blue-500/30 glow-blue";
    case "normal":
    case "info":
    default:
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  }
}

export function getSeverityBg(severity: string): string {
  switch (severity?.toLowerCase()) {
    case "critical":
      return "bg-red-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-amber-500";
    case "low":
      return "bg-blue-500";
    case "normal":
    case "info":
    default:
      return "bg-emerald-500";
  }
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return dateString;
  }
}
