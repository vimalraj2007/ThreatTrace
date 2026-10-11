"use client";

import React, { createContext, useContext, useState } from "react";
import { 
  Incident, 
  IncidentStatus, 
  InvestigationNote, 
  EvidenceBookmark 
} from "@/types";
import { mockIncidents } from "@/data/mockData";

interface DemoContextType {
  incidents: Incident[];
  activeIncidentId: string;
  setActiveIncidentId: (id: string) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  assignIncident: (id: string, analyst: string) => void;
  addNoteToIncident: (id: string, noteContent: string, author?: string) => void;
  bookmarkEvidence: (id: string, evidence: Omit<EvidenceBookmark, "id" | "timestamp">) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  demoLoaded: boolean;
  loadDemoData: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [activeIncidentId, setActiveIncidentId] = useState<string>("INC-001");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [demoLoaded, setDemoLoaded] = useState<boolean>(true);

  const loadDemoData = () => {
    setIncidents(mockIncidents);
    setActiveIncidentId("INC-001");
    setDemoLoaded(true);
  };

  const updateIncidentStatus = (id: string, status: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status } : inc))
    );
  };

  const assignIncident = (id: string, analyst: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, assignedTo: analyst } : inc))
    );
  };

  const addNoteToIncident = (id: string, content: string, author = "SOC Analyst") => {
    const newNote: InvestigationNote = {
      id: `note-${Date.now()}`,
      author,
      timestamp: new Date().toISOString(),
      content
    };

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          return {
            ...inc,
            notes: [...(inc.notes || []), newNote]
          };
        }
        return inc;
      })
    );
  };

  const bookmarkEvidence = (id: string, evidence: Omit<EvidenceBookmark, "id" | "timestamp">) => {
    const newBookmark: EvidenceBookmark = {
      ...evidence,
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          return {
            ...inc,
            evidenceBookmarks: [...(inc.evidenceBookmarks || []), newBookmark]
          };
        }
        return inc;
      })
    );
  };

  return (
    <DemoContext.Provider
      value={{
        incidents,
        activeIncidentId,
        setActiveIncidentId,
        updateIncidentStatus,
        assignIncident,
        addNoteToIncident,
        bookmarkEvidence,
        isSearchOpen,
        setIsSearchOpen,
        demoLoaded,
        loadDemoData
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoContext() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemoContext must be used within a DemoProvider");
  }
  return context;
}
