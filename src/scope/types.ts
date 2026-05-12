// Canonical TypeScript shape for the fractal scope primitive.
//
// Source of truth: chittyschema/connectivity/migrations/chittyos-core/
//                    002_fractal_scopes.sql
//
// If the SQL changes, this file changes — never the other way around.
// Use the chittyagent-neon-schema agent to detect drift between this and
// the live Neon schema.

export type ScopeStatus =
  | "new"
  | "active"
  | "waiting"
  | "escalated"
  | "paused"
  | "resolved"
  | "closed"
  | "archived";

export type ScopeCharacterization =
  | "Case"
  | "Session"
  | "Transaction"
  | "Incident"
  | "Project"
  | "Engagement";

export type EntityType = "P" | "L" | "T" | "E" | "A";

export interface Scope {
  id: string;                       // uuid
  chitty_id: string | null;
  canon_type: "E";                  // hardcoded — scopes are Events
  characterization: ScopeCharacterization;
  scope_type: string;               // free text — domain taxonomy
  parent_scope_id: string | null;
  root_scope_id: string | null;
  depth: number;
  status: ScopeStatus;
  status_reason: string | null;
  status_changed_at: string;
  creator_id: string;
  current_agent_id: string | null;
  current_agent_since: string | null;
  title: string;
  summary: string | null;
  source: string | null;
  external_id: string | null;
  metadata: Record<string, unknown>;
  resolved_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  deleted_at: string | null;
}

export interface ScopeParty {
  id: string;
  scope_id: string;
  party_id: string;
  entity_type: EntityType;          // P/L/T/E/A — Claude must be P, never T
  role: string;
  display_name: string | null;
  metadata: Record<string, unknown>;
  joined_at: string;
  left_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScopeEvent {
  id: string;
  scope_id: string;
  event_type: string;
  summary: string;
  actor: string | null;
  from_status: ScopeStatus | null;
  to_status: ScopeStatus | null;
  details: Record<string, unknown>;
  created_at: string;
}

export interface ScopeArtifact {
  id: string;
  scope_id: string;
  artifact_type: string;
  title: string;
  description: string | null;
  storage_type: "r2" | "url" | "drive" | "manual" | "email" | null;
  storage_ref: string | null;
  content_hash: string | null;
  file_size: number | null;
  mime_type: string | null;
  metadata: Record<string, unknown>;
  added_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// ─── App-layer types (live in metadata JSONB, not as columns) ──────────────

export type PolicyProfile = "cheap" | "balanced" | "court_grade" | "research";

export interface LoopBudget {
  max_rounds: number;
  max_cost_usd?: number;
  max_wall_time_seconds?: number;
  stop_score?: number;
  require_human_at_round?: number;
}

export interface EvaluatorProfile {
  internal: boolean;
  third_party?: "openai" | "anthropic" | "mistral" | "gemini" | "custom";
  require_disagreement_review: boolean;
  minimum_score?: number;
}

export interface OutputTargets {
  write_scope_events: boolean;
  write_evidence: boolean;
  ledger_candidate: boolean;
  telemetry: boolean;
}

export interface ArtifactRef {
  storage_type: "r2" | "url" | "drive" | "manual" | "email";
  storage_ref: string;
  content_hash?: string;
  mime_type?: string;
  filename?: string;
  page_range?: string;
}

export type RootScopeType =
  | "legal.document_extraction"
  | "legal.litigation.case"
  | "corporate_governance.document"
  | "agent.system_improvement";

export interface ChittyFractalRunRequest {
  entry_id: string;
  tenant_id: string;
  requested_by: string;
  root_scope_type: RootScopeType;
  objective: string;
  artifact_refs: ArtifactRef[];
  schema_contract_uri: string;
  policy_profile: PolicyProfile;
  loop_budget: LoopBudget;
  evaluator_profile: EvaluatorProfile;
  output_targets: OutputTargets;
}
