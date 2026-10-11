"use client";
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "./api";

export const useDashboard = () => useQuery({ queryKey: ["dashboard"], queryFn: api.dashboard });
export const useIncidents = () => useQuery({ queryKey: ["incidents"], queryFn: api.incidents });
export const useIncident = (id: string) => useQuery({ queryKey: ["incident", id], queryFn: () => api.incident(id) });
export const useTimeline = (id: string, page: number) => useQuery({ queryKey: ["timeline", id, page], queryFn: () => api.timeline(id, page), placeholderData: keepPreviousData });
export const useGraph = (id: string) => useQuery({ queryKey: ["graph", id], queryFn: () => api.graph(id), enabled: !!id });
export const useMitre = (id: string) => useQuery({ queryKey: ["mitre", id], queryFn: () => api.mitre(id), enabled: !!id });
export const useLateral = (id: string) => useQuery({ queryKey: ["lateral", id], queryFn: () => api.lateral(id), enabled: !!id });
export const useNextTargets = (id: string) => useQuery({ queryKey: ["next", id], queryFn: () => api.nextTargets(id), enabled: !!id });
export const useHosts = () => useQuery({ queryKey: ["hosts"], queryFn: api.hosts });
export const useEvents = (page: number, q: string) => useQuery({ queryKey: ["events", page, q], queryFn: () => api.events(page, 25, q), placeholderData: keepPreviousData });

/** localStorage-backed state for analyst workspace data (no backend endpoint specified). */
export function useLocal<V>(key: string, initial: V) {
  const [v, setV] = useState<V>(initial);
  useEffect(() => { try { const s = localStorage.getItem(key); if (s) setV(JSON.parse(s)); } catch {} }, [key]);
  const set = (n: V) => { setV(n); try { localStorage.setItem(key, JSON.stringify(n)); } catch {} };
  return [v, set] as const;
}
