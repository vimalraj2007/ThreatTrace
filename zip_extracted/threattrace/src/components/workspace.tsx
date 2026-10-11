"use client";
import { useState } from "react";
import type { Incident, IncidentStatus } from "@/lib/types";
import { useLocal } from "@/lib/hooks";
import { Btn, Card, Empty } from "./ui";

const STATUSES: IncidentStatus[] = ["New", "Investigating", "Contained", "Resolved", "False Positive"];
interface Note { id: number; text: string; at: string; evidence: boolean }

export function useNotes(id: string) { return useLocal<Note[]>(`tt_notes_${id}`, []); }

export function Workspace({ incident }: { incident: Incident }) {
  const [status, setStatus] = useLocal<IncidentStatus>(`tt_status_${incident.id}`, incident.status);
  const [owner, setOwner] = useLocal<string>(`tt_owner_${incident.id}`, incident.assignee ?? "");
  const [notes, setNotes] = useNotes(incident.id);
  const [text, setText] = useState(""); const [ev, setEv] = useState(false);
  const add = () => { if (!text.trim()) return; setNotes([{ id: Date.now(), text: text.trim(), at: new Date().toISOString().slice(0, 16).replace("T", " "), evidence: ev }, ...notes]); setText(""); setEv(false); };
  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <Card title="Case controls">
        <label className="text-xs text-mute" htmlFor="st">Status</label>
        <select id="st" value={status} onChange={(e) => setStatus(e.target.value as IncidentStatus)} className="mb-3 mt-1 w-full rounded border border-line bg-bg px-2 py-1.5 text-sm">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <label className="text-xs text-mute" htmlFor="ow">Assigned analyst</label>
        <input id="ow" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Unassigned" className="mt-1 w-full rounded border border-line bg-bg px-2 py-1.5 text-sm" />
        <p className="mt-3 text-xs text-mute">Changes are saved in this browser until a case-management endpoint is connected.</p>
      </Card>
      <Card title="Investigator notes">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Add a finding, comment, or next step" className="w-full rounded border border-line bg-bg p-2 text-sm" />
        <div className="mt-2 flex items-center justify-between"><label className="flex items-center gap-2 text-xs text-mute"><input type="checkbox" checked={ev} onChange={(e) => setEv(e.target.checked)} />Mark as evidence</label><Btn variant="primary" onClick={add}>Add note</Btn></div>
        <div className="mt-4 space-y-2">
          {notes.length === 0 ? <Empty title="No notes yet" hint="Notes you add appear here and in the report." /> : notes.map((n) => (
            <div key={n.id} className="rounded border border-line bg-raised p-3 text-sm"><p>{n.text}</p><p className="mt-1 text-[11px] text-mute">{n.at} UTC{n.evidence && " · Marked as evidence"}</p></div>))}
        </div>
      </Card>
    </div>
  );
}
