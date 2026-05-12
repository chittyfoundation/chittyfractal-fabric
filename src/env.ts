// Env interface — bindings declared in wrangler.jsonc.
// As bindings are added (durable objects, workflows, hyperdrive, r2, queues),
// add the corresponding optional field here. Required vs optional per §7.4.

export interface Env {
  // ─── vars ────────────────────────────────────────────────────────────────
  SERVICE_NAME: string;
  SERVICE_VERSION: string;
  SERVICE_ORIGIN: string;
  DEFAULT_POLICY_PROFILE: "cheap" | "balanced" | "court_grade" | "research";
  CHITTYCANON_URI: string;

  // ─── secrets (set via `wrangler secret put`) ─────────────────────────────
  CHITTY_AUTH_SERVICE_TOKEN?: string;

  // ─── AI ──────────────────────────────────────────────────────────────────
  AI?: Ai;

  // ─── Hyperdrive — scope persistence ──────────────────────────────────────
  // Required for any /api/v1/runs request that targets scope projection.
  // Emits `db.binding.missing` scope_event if absent (per §7.4).
  CHITTYOS_CORE_DB?: Hyperdrive;
  CHITTYEVIDENCE_DB?: Hyperdrive;
  CHITTYLEDGER_DB?: Hyperdrive;
  SERVICE_SCOPE_DB?: Hyperdrive;

  // ─── R2 ──────────────────────────────────────────────────────────────────
  ARTIFACTS?: R2Bucket;
  TELEMETRY_LAKE?: R2Bucket;

  // ─── Queues ──────────────────────────────────────────────────────────────
  AGENT_TASK_QUEUE?: Queue;
  AGENT_EVAL_QUEUE?: Queue;
  AGENT_REPLAY_QUEUE?: Queue;
  AGENT_ALCHEMY_QUEUE?: Queue;

  // ─── Service bindings ────────────────────────────────────────────────────
  CHITTYSCHEMA?: Fetcher;
  CHITTYMINT?: Fetcher;
}
