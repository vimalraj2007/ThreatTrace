import networkx as nx
from typing import Dict, Any, List

def build_nx_graph(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> nx.DiGraph:
    G = nx.DiGraph()
    for n in nodes:
        G.add_node(n["id"], **n)
    for e in edges:
        G.add_edge(e["source"], e["target"], **e)
    return G

def mark_suspicious_paths(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> Dict[str, Any]:
    G = build_nx_graph(nodes, edges)

    # Find initial host node (e.g. PC-03 or compromised host)
    start_nodes = [n["id"] for n in nodes if n.get("status") in ("COMPROMISED", "compromised", "Suspicious")]
    
    path_nodes = set()
    path_edges = set()

    for u, v, data in G.edges(data=True):
        if data.get("on_path") or data.get("is_lateral") or data.get("rel") in ("AUTHENTICATED_TO", "MOVED_TO", "EXECUTED", "ACCESSED", "RESOLVED"):
            path_edges.add((u, v))
            path_nodes.add(u)
            path_nodes.add(v)

    updated_nodes = []
    for n in nodes:
        node_copy = n.copy()
        # Ensure standard UPPERCASE types
        t = str(node_copy.get("type", "")).upper()
        if t not in ("HOST", "SERVER", "USER", "IP", "DOMAIN", "PROCESS"):
            t = "HOST"
        node_copy["type"] = t
        node_copy["on_path"] = n["id"] in path_nodes or n.get("on_path", False)
        updated_nodes.append(node_copy)

    updated_edges = []
    for e in edges:
        edge_copy = e.copy()
        # Ensure standard enum rel
        rel = str(edge_copy.get("rel", edge_copy.get("relationshipType", ""))).upper()
        if rel not in ("AUTHENTICATED_TO", "CONNECTED_TO", "RESOLVED", "EXECUTED", "ACCESSED", "MOVED_TO"):
            rel = "CONNECTED_TO"
        edge_copy["rel"] = rel
        edge_copy["on_path"] = (e["source"], e["target"]) in path_edges or e.get("on_path", False)
        updated_edges.append(edge_copy)

    return {"nodes": updated_nodes, "edges": updated_edges}
