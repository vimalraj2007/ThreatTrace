"use client";
import { useMitre } from "@/lib/hooks";
import { MitreList } from "@/components/panels";
import { Page, Q } from "@/components/ui";
export default function MitrePage() {
  const q = useMitre("INC-001");
  return <Page title="MITRE ATT&CK" sub="Techniques observed in INC-001, grouped by tactic"><Q q={q}>{(m) => <MitreList items={m} />}</Q></Page>;
}
