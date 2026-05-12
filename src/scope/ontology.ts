// Maps fabric scope_type values → required scope characterization.
// Source: CHITTY.md "Scope-Type Vocabulary" table.

import type { ScopeCharacterization } from "./types";

export const SCOPE_TYPE_CHARACTERIZATION: Record<string, ScopeCharacterization> = {
  // Agent-internal
  "agent.workflow":                  "Project",
  "agent.loop":                      "Engagement",
  "agent.loop.ocr":                  "Engagement",
  "agent.loop.extraction":           "Engagement",
  "agent.loop.verification":         "Engagement",
  "agent.loop.evaluation":           "Engagement",
  "agent.loop.alchemy":              "Engagement",
  "agent.replay":                    "Session",
  "agent.evaluation":                "Engagement",
  "agent.improvement.proposal":      "Project",
  "agent.policy.decision":           "Incident",

  // Legal domain
  "legal.document_extraction":       "Engagement",
  "legal.litigation.case":           "Case",
  "legal.litigation.claim":          "Engagement",
  "legal.litigation.filing":         "Transaction",
  "legal.litigation.motion":         "Transaction",
  "legal.litigation.discovery":      "Engagement",
  "legal.litigation.deadline":       "Engagement",
  "legal.litigation.evidence":       "Engagement",

  // Corporate governance domain
  "corporate_governance.document":              "Engagement",
  "corporate_governance.operating_agreement":   "Engagement",
  "corporate_governance.amendment":             "Transaction",
  "corporate_governance.resolution":            "Transaction",
  "corporate_governance.audit_trail":           "Engagement"
};

export function characterizationFor(scope_type: string): ScopeCharacterization {
  const c = SCOPE_TYPE_CHARACTERIZATION[scope_type];
  if (!c) {
    throw new Error(
      `Unknown scope_type "${scope_type}". Register in src/scope/ontology.ts ` +
      `and add to CHITTY.md "Scope-Type Vocabulary" before use.`
    );
  }
  return c;
}
