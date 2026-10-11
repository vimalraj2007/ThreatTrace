"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Core } from "cytoscape";
import Link from "next/link";
import { Crosshair, Maximize2, Route, Waypoints, X } from "lucide-react";
import type { GraphData, GraphNode } from "@/lib/types";
import { Btn, SevBadge } from "./ui";
import { cn } from "@/lib/util";

const TYPES = ["host", "server", "user", "ip", "domain", "process"] as const;
const STATUS_COLOR = { compromised: "#e5484d", suspicious: "#ee7d3a", "at-risk": "#e2b23a", normal: "#5b6878" };

export function AttackGraph({ data, height = 560 }: { data: GraphData; height?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [ready, setReady] = useState(false);
  const [sel, setSel] = useState<GraphNode | null>(null);
  const [types, setTypes] = useState<Set<string>>(new Set(TYPES));
  const [hideNormal, setHideNormal] = useState(false);
  const [pathOnly, setPathOnly] = useState(false);
  const [dim, setDim] = useState(false);
  const [lat, setLat] = useState(false);
  const byId = useMemo(() => new Map(data.nodes.map((n) => [n.id, n])), [data]);

  useEffect(() => {
    let dead = false; let cy: Core | undefined;
    (async () => {
      const cytoscape = (await import("cytoscape")).default;
      if (dead || !box.current) return;
      cy = cytoscape({
        container: box.current, wheelSensitivity: 0.25, minZoom: 0.2, maxZoom: 3,
        elements: [...data.nodes.map((n) => ({ data: { ...n, id: n.id } })), ...data.edges.map((e) => ({ data: { ...e } }))],
        style: [
          { selector: "node", style: { label: "data(label)", color: "#d9dfe7", "font-size": 10, "text-valign": "bottom", "text-margin-y": 5, "background-color": "#5b6878", width: 30, height: 30, "border-width": 2, "border-color": "#0c1015" } },
          { selector: 'node[type="server"]', style: { shape: "round-rectangle", width: 38, height: 30 } },
          { selector: 'node[type="user"]', style: { shape: "diamond" } },
          { selector: 'node[type="ip"]', style: { shape: "hexagon" } },
          { selector: 'node[type="domain"]', style: { shape: "tag" } },
          { selector: 'node[type="process"]', style: { shape: "rectangle", width: 22, height: 22 } },
          ...(Object.entries(STATUS_COLOR).map(([s, c]) => ({ selector: `node[status="${s}"]`, style: { "background-color": c } })) as never[]),
          { selector: "edge", style: { width: 1.2, "line-color": "#3a4657", "target-arrow-color": "#3a4657", "target-arrow-shape": "triangle", "curve-style": "bezier", label: "data(rel)", "font-size": 7, color: "#8593a6", "text-rotation": "autorotate", "text-background-color": "#0c1015", "text-background-opacity": 0.9 } },
          { selector: "edge.lat", style: { width: 3, "line-color": "#e5484d", "target-arrow-color": "#e5484d", color: "#e5484d" } },
          { selector: ".dim", style: { opacity: 0.12 } },
          { selector: "node:selected", style: { "border-color": "#5a9bf0", "border-width": 3 } },
        ],
        layout: { name: "cose", animate: false, nodeRepulsion: () => 12000, idealEdgeLength: () => 90 } as never,
      });
      cy.on("tap", "node", (e) => setSel(byId.get(e.target.id()) ?? null));
      cy.on("tap", (e) => { if (e.target === cy) setSel(null); });
      cyRef.current = cy; setReady(true);
    })();
    return () => { dead = true; cy?.destroy(); cyRef.current = null; setReady(false); };
  }, [data, byId]);

  useEffect(() => {
    const cy = cyRef.current; if (!cy) return;
    cy.batch(() => {
      cy.nodes().forEach((n) => {
        const d = n.data() as GraphNode;
        const show = types.has(d.type) && !(hideNormal && d.status === "normal") && !(pathOnly && !d.onPath);
        n.style("display", show ? "element" : "none");
      });
      cy.elements().removeClass("dim"); cy.edges().removeClass("lat");
      if (dim) cy.elements().filter((el) => !el.data("onPath")).addClass("dim");
      if (lat) cy.edges('[rel="MOVED_TO"]').addClass("lat");
    });
  }, [types, hideNormal, pathOnly, dim, lat, ready]);

  const cy = () => cyRef.current;
  const related = sel ? data.edges.filter((e) => e.source === sel.id || e.target === sel.id) : [];
  const toggle = (t: string) => setTypes((s) => { const n = new Set(s); n.has(t) ? n.delete(t) : n.add(t); return n; });
  const chip = (on: boolean) => cn("rounded border px-2 py-1 text-xs capitalize", on ? "border-accent/60 bg-accent/10 text-accent" : "border-line text-mute");

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Btn variant="primary" onClick={() => { setPathOnly(true); setLat(true); setTimeout(() => cy()?.fit(undefined, 50), 50); }}><Route className="h-3.5 w-3.5" />Focus Attack Path</Btn>
        <Btn onClick={() => setDim(!dim)}><Waypoints className="h-3.5 w-3.5" />{dim ? "Show all" : "Show suspicious path"}</Btn>
        <Btn onClick={() => setLat(!lat)}>{lat ? "Clear" : "Highlight"} lateral movement</Btn>
        <Btn onClick={() => cy()?.fit(undefined, 40)}><Maximize2 className="h-3.5 w-3.5" />Fit</Btn>
        <Btn disabled={!sel} onClick={() => sel && cy()?.fit(cy()!.$id(sel.id).closedNeighborhood(), 60)}><Crosshair className="h-3.5 w-3.5" />Focus selected</Btn>
        <Btn onClick={() => { setPathOnly(false); setDim(false); setLat(false); setHideNormal(false); setTypes(new Set(TYPES)); setTimeout(() => cy()?.fit(undefined, 40), 50); }}>Reset</Btn>
        <span className="mx-1 h-5 w-px bg-line" />
        {TYPES.map((t) => <button key={t} onClick={() => toggle(t)} className={chip(types.has(t))} aria-pressed={types.has(t)}>{t}</button>)}
        <button onClick={() => setHideNormal(!hideNormal)} className={chip(hideNormal)} aria-pressed={hideNormal}>hide normal</button>
      </div>
      <div className="relative overflow-hidden rounded-md border border-line bg-bg" style={{ height }}>
        <div ref={box} className="h-full w-full" aria-label="Attack graph" />
        <div className="absolute bottom-2 left-2 flex gap-3 rounded bg-panel/90 px-2 py-1 text-[11px] text-mute">
          {Object.entries(STATUS_COLOR).map(([k, c]) => <span key={k} className="flex items-center gap-1"><i className="h-2 w-2 rounded-full" style={{ background: c }} />{k}</span>)}
        </div>
        {sel && (
          <aside className="absolute right-0 top-0 h-full w-72 overflow-y-auto border-l border-line bg-panel p-4 text-sm">
            <button onClick={() => setSel(null)} className="absolute right-2 top-2 text-mute hover:text-txt" aria-label="Close panel"><X className="h-4 w-4" /></button>
            <p className="text-xs uppercase text-mute">{sel.type}</p>
            <h4 className="font-mono text-base font-semibold">{sel.label}</h4>
            <dl className="mt-3 space-y-2 text-xs">
              <div><dt className="text-mute">Status</dt><dd className="capitalize">{sel.status.replace("-", " ")}{sel.status === "compromised" && " (potentially)"}</dd></div>
              <div><dt className="text-mute">Risk</dt><dd><SevBadge s={sel.risk} /></dd></div>
            </dl>
            <p className="mt-3 text-xs text-mute">Evidence</p>
            {sel.evidence.length ? <ul className="mt-1 list-disc space-y-1 pl-4 text-xs">{sel.evidence.map((e) => <li key={e}>{e}</li>)}</ul> : <p className="text-xs text-mute">No suspicious evidence.</p>}
            <p className="mt-3 text-xs text-mute">Relationships</p>
            <ul className="mt-1 space-y-1 text-xs">{related.map((e) => <li key={e.id} className="font-mono">{e.source} <span className="text-accent">{e.rel}</span> {e.target}</li>)}</ul>
            {(sel.type === "host" || sel.type === "server") && <Link href={`/hosts?host=${sel.id}`} className="mt-4 inline-block text-xs text-accent underline">Open host details</Link>}
          </aside>
        )}
      </div>
    </div>
  );
}
