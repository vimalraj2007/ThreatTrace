"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import cytoscape, { Core, EventObjectNode } from "cytoscape";
import { 
  AttackGraphData, 
  GraphNode, 
  GraphEdge, 
  NodeType, 
  Severity 
} from "@/types";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Target, 
  ShieldAlert, 
  Filter, 
  Activity, 
  Server, 
  Laptop, 
  User, 
  Globe, 
  Terminal, 
  Network,
  X,
  ChevronRight,
  Zap
} from "lucide-react";
import { getSeverityBadgeColor } from "@/lib/utils";

interface AttackGraphProps {
  data: AttackGraphData;
  onSelectNode?: (node: GraphNode | null) => void;
  height?: string;
}

export function AttackGraph({ data, onSelectNode, height = "600px" }: AttackGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [hideNormal, setHideNormal] = useState<boolean>(false);
  const [highlightLateral, setHighlightLateral] = useState<boolean>(true);

  // Colors mapping for Cytoscape node styling
  const getNodeColor = (risk: Severity, status: string) => {
    if (status === "Target") return "#06b6d4"; // Cyan glow
    switch (risk) {
      case "critical": return "#ef4444";
      case "high": return "#f97316";
      case "medium": return "#f59e0b";
      case "low": return "#3b82f6";
      default: return "#10b981";
    }
  };

  const getNodeShape = (type: NodeType) => {
    switch (type) {
      case "server": return "round-rectangle";
      case "host": return "rectangle";
      case "user": return "ellipse";
      case "ip": return "diamond";
      case "domain": return "octagon";
      case "process": return "hexagon";
      default: return "ellipse";
    }
  };

  // Convert raw props data to Cytoscape elements
  const elements = useMemo(() => {
    const nodes = data.nodes
      .filter((n) => {
        if (filterType !== "all" && n.type !== filterType) return false;
        if (hideNormal && n.status === "Normal") return false;
        return true;
      })
      .map((node) => ({
        data: {
          id: node.id,
          label: node.label,
          type: node.type,
          risk: node.risk,
          status: node.status,
          color: getNodeColor(node.risk, node.status),
          shape: getNodeShape(node.type),
          raw: node
        }
      }));

    const validNodeIds = new Set(nodes.map((n) => n.data.id));

    const edges = data.edges
      .filter((e) => validNodeIds.has(e.source) && validNodeIds.has(e.target))
      .map((edge) => {
        const isHighlight = highlightLateral && edge.isLateralPath;
        return {
          data: {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: edge.label || edge.relationshipType,
            relationshipType: edge.relationshipType,
            isLateralPath: edge.isLateralPath,
            color: isHighlight ? "#ef4444" : "#334155",
            width: isHighlight ? 4 : 2,
            raw: edge
          }
        };
      });

    return [...nodes, ...edges];
  }, [data, filterType, hideNormal, highlightLateral]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy existing instance if any
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#0f172a",
            "border-color": "data(color)",
            "border-width": 3,
            "border-opacity": 0.9,
            label: "data(label)",
            color: "#f8fafc",
            "font-size": "11px",
            "font-weight": "bold",
            "font-family": "ui-sans-serif, system-ui, sans-serif",
            "text-valign": "bottom",
            "text-margin-y": 6,
            shape: "data(shape)" as any,
            width: 48,
            height: 48,
            "overlay-padding": 6,
          }
        },
        {
          selector: "node:selected",
          style: {
            "border-width": 5,
            "border-color": "#38bdf8",
            "background-color": "#1e293b",
            "shadow-blur": 15,
            "shadow-color": "#38bdf8",
            "shadow-opacity": 0.8
          }
        },
        {
          selector: "edge",
          style: {
            width: "data(width)",
            "line-color": "data(color)",
            "target-arrow-color": "data(color)",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(label)",
            color: "#94a3b8",
            "font-size": "9px",
            "text-rotation": "autorotate",
            "text-margin-y": -8,
            "arrow-scale": 1.2
          }
        },
        {
          selector: "edge:selected",
          style: {
            width: 5,
            "line-color": "#38bdf8",
            "target-arrow-color": "#38bdf8"
          }
        }
      ],
      layout: {
        name: "cose",
        animate: true,
        animationDuration: 800,
        nodeRepulsion: () => 8000,
        idealEdgeLength: () => 120,
        gravity: 0.25,
        padding: 40
      }
    });

    cy.on("tap", "node", (evt: EventObjectNode) => {
      const nodeRaw = evt.target.data("raw") as GraphNode;
      setSelectedNode(nodeRaw);
      setSelectedEdge(null);
      if (onSelectNode) onSelectNode(nodeRaw);
    });

    cy.on("tap", "edge", (evt: any) => {
      const edgeRaw = evt.target.data("raw") as GraphEdge;
      setSelectedEdge(edgeRaw);
      setSelectedNode(null);
    });

    cy.on("tap", (evt: any) => {
      if (evt.target === cy) {
        setSelectedNode(null);
        setSelectedEdge(null);
        if (onSelectNode) onSelectNode(null);
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [elements]);

  // Graph Action Controls
  const handleZoomIn = () => {
    cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  };

  const handleZoomOut = () => {
    cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  };

  const handleFit = () => {
    cyRef.current?.fit(undefined, 40);
  };

  const handleFocusAttackPath = () => {
    if (!cyRef.current) return;
    const lateralNodeIds = data.nodes.filter((n) => n.isLateralPath).map((n) => n.id);
    if (lateralNodeIds.length > 0) {
      const selector = lateralNodeIds.map((id) => `#${id}`).join(", ");
      const elementsToFit = cyRef.current.$(selector);
      cyRef.current.fit(elementsToFit, 50);
      cyRef.current.animate({
        zoom: cyRef.current.zoom() * 0.95,
        duration: 500
      });
    }
  };

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case "server": return <Server className="w-4 h-4 text-cyan-400" />;
      case "host": return <Laptop className="w-4 h-4 text-blue-400" />;
      case "user": return <User className="w-4 h-4 text-purple-400" />;
      case "ip": return <Network className="w-4 h-4 text-emerald-400" />;
      case "domain": return <Globe className="w-4 h-4 text-amber-400" />;
      case "process": return <Terminal className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="relative border border-slate-800 rounded-xl bg-slate-950 overflow-hidden shadow-2xl flex flex-col" style={{ height }}>
      {/* Graph Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/80 border-b border-slate-800 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Cytoscape Graph Engine</span>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          {/* Node Type Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Node Types</option>
              <option value="host">Hosts</option>
              <option value="server">Servers</option>
              <option value="user">Users</option>
              <option value="ip">IPs</option>
              <option value="domain">Domains</option>
              <option value="process">Processes</option>
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHideNormal(!hideNormal)}
            className={`px-2.5 py-1 text-xs rounded border transition flex items-center gap-1.5 ${
              hideNormal
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{hideNormal ? "Showing Malicious Only" : "Hide Normal"}</span>
          </button>

          <button
            onClick={handleFocusAttackPath}
            className="px-2.5 py-1 text-xs rounded border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition flex items-center gap-1.5 font-medium"
          >
            <Target className="w-3.5 h-3.5 text-red-400" />
            <span>Focus Attack Path</span>
          </button>

          <div className="flex items-center rounded-md border border-slate-700 bg-slate-900 overflow-hidden">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1.5 hover:bg-slate-800 text-slate-300 transition"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1.5 hover:bg-slate-800 text-slate-300 border-l border-slate-800 transition"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleFit}
              title="Fit Graph"
              className="p-1.5 hover:bg-slate-800 text-slate-300 border-l border-slate-800 transition"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        <div ref={containerRef} className="w-full h-full" />

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-[11px] backdrop-blur z-10 space-y-1.5 shadow-lg">
          <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Legend & Node Types
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-red-300 shadow-glow-red" />
              <span>Compromised Host</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-cyan-200 animate-pulse" />
              <span>Target Asset</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>Suspicious Entity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-red-500" />
              <span>Lateral Movement Path</span>
            </div>
          </div>
        </div>

        {/* Selected Node Side Panel */}
        {selectedNode && (
          <div className="absolute top-3 right-3 bottom-3 w-80 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl p-4 overflow-y-auto backdrop-blur z-20 flex flex-col space-y-4 animate-in slide-in-from-right-5 duration-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                  {getNodeIcon(selectedNode.type)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100 leading-tight">
                    {selectedNode.label}
                  </h4>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">
                    Type: {selectedNode.type}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">Status</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getSeverityBadgeColor(selectedNode.risk)}`}>
                  {selectedNode.status}
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">Risk Assessment</span>
                <span className="font-mono text-slate-200 uppercase font-semibold">
                  {selectedNode.risk}
                </span>
              </div>

              {selectedNode.ip && (
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">IP Address</span>
                  <span className="font-mono text-cyan-400 font-semibold">{selectedNode.ip}</span>
                </div>
              )}

              {selectedNode.user && (
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Active User</span>
                  <span className="font-mono text-purple-300">{selectedNode.user}</span>
                </div>
              )}

              {selectedNode.details && (
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-300 block">Telemetry Details</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {selectedNode.details}
                  </p>
                </div>
              )}

              {/* Related Edges Evidence */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-slate-300 block">
                  Observed Relationships ({data.edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length})
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {data.edges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map(e => (
                      <div key={e.id} className="p-2 bg-slate-950/80 rounded border border-slate-850 text-[10px] space-y-0.5">
                        <div className="flex items-center justify-between text-slate-300 font-semibold">
                          <span>{e.source === selectedNode.id ? `→ ${e.target}` : `← ${e.source}`}</span>
                          <span className="text-cyan-400 font-mono text-[9px]">{e.relationshipType}</span>
                        </div>
                        <p className="text-slate-400 truncate">{e.label}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Edge Side Panel */}
        {selectedEdge && (
          <div className="absolute top-3 right-3 bottom-3 w-80 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl p-4 overflow-y-auto backdrop-blur z-20 flex flex-col space-y-4 animate-in slide-in-from-right-5 duration-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-100">Relationship Telemetry</h4>
                <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-mono">
                  {selectedEdge.relationshipType}
                </span>
              </div>
              <button
                onClick={() => setSelectedEdge(null)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-300 font-mono">
                  <span>{selectedEdge.source}</span>
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                  <span>{selectedEdge.target}</span>
                </div>
                <p className="text-slate-400 text-[11px]">{selectedEdge.label}</p>
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">Timestamp</span>
                <span className="font-mono text-slate-300">{selectedEdge.timestamp}</span>
              </div>

              {selectedEdge.isLateralPath && (
                <div className="bg-red-500/15 border border-red-500/30 p-2.5 rounded-lg text-red-300 text-[11px] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Verified Lateral Movement Path Edge</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
