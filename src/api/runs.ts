import type { Env } from "../env";
import type { ChittyFractalRunRequest } from "../scope/types";
import { characterizationFor } from "../scope/ontology";

type JsonFn = (b: unknown, i?: ResponseInit) => Response;

const REQUIRED_TOP_LEVEL: (keyof ChittyFractalRunRequest)[] = [
  "entry_id", "tenant_id", "requested_by", "root_scope_type",
  "objective", "artifact_refs", "schema_contract_uri",
  "policy_profile", "loop_budget", "evaluator_profile", "output_targets"
];

const VALID_ROOT_SCOPE_TYPES = [
  "legal.document_extraction",
  "legal.litigation.case",
  "corporate_governance.document",
  "agent.system_improvement"
];

const VALID_POLICY_PROFILES = ["cheap", "balanced", "court_grade", "research"];

function validateEnvelope(raw: unknown): { ok: true; req: ChittyFractalRunRequest } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  if (!raw || typeof raw !== "object") {
    return { ok: false, errors: ["body must be a JSON object"] };
  }
  const r = raw as Record<string, unknown>;

  for (const k of REQUIRED_TOP_LEVEL) {
    if (!(k in r)) errors.push(`missing required field: ${k}`);
  }
  if (errors.length) return { ok: false, errors };

  if (typeof r.entry_id !== "string" || !r.entry_id.length) errors.push("entry_id must be non-empty string");
  if (typeof r.tenant_id !== "string" || !r.tenant_id.length) errors.push("tenant_id must be non-empty string");
  if (typeof r.requested_by !== "string" || !r.requested_by.length) errors.push("requested_by must be non-empty string");
  if (typeof r.objective !== "string" || !r.objective.length) errors.push("objective must be non-empty string");
  if (typeof r.schema_contract_uri !== "string" || !r.schema_contract_uri.startsWith("chittyschema://")) {
    errors.push("schema_contract_uri must be a chittyschema:// URI");
  }
  if (typeof r.root_scope_type !== "string" || !VALID_ROOT_SCOPE_TYPES.includes(r.root_scope_type as string)) {
    errors.push(`root_scope_type must be one of: ${VALID_ROOT_SCOPE_TYPES.join(", ")}`);
  }
  if (typeof r.policy_profile !== "string" || !VALID_POLICY_PROFILES.includes(r.policy_profile as string)) {
    errors.push(`policy_profile must be one of: ${VALID_POLICY_PROFILES.join(", ")}`);
  }
  if (!Array.isArray(r.artifact_refs)) errors.push("artifact_refs must be an array");
  if (typeof r.loop_budget !== "object" || r.loop_budget === null) errors.push("loop_budget must be an object");
  if (typeof r.evaluator_profile !== "object" || r.evaluator_profile === null) errors.push("evaluator_profile must be an object");
  if (typeof r.output_targets !== "object" || r.output_targets === null) errors.push("output_targets must be an object");

  if (errors.length) return { ok: false, errors };

  // Verify characterization mapping exists (will throw if not)
  try {
    characterizationFor(r.root_scope_type as string);
  } catch (e: unknown) {
    errors.push(e instanceof Error ? e.message : String(e));
    return { ok: false, errors };
  }

  return { ok: true, req: raw as ChittyFractalRunRequest };
}

export async function handleCreateRun(
  req: Request,
  env: Env,
  _ctx: ExecutionContext,
  json: JsonFn
): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_request", detail: "body must be JSON" }, { status: 400 });
  }

  const result = validateEnvelope(body);
  if (!result.ok) {
    return json({ error: "validation_failed", errors: result.errors }, { status: 400 });
  }

  // ─── TODO Milestone 2: scope creation + workflow dispatch ─────────────────
  // 1. Verify CHITTYOS_CORE_DB binding (emit `db.binding.missing` scope_event if absent)
  // 2. Mint ChittyID via env.CHITTYMINT?.fetch (canonical, not fabricated)
  // 3. INSERT INTO scopes (...) VALUES (...) with characterizationFor(root_scope_type)
  // 4. INSERT scope_artifacts rows for each artifact_ref
  // 5. Spawn FractalRunWorkflow instance, attach workflow_id to metadata
  // 6. Return { run_id, root_scope_id, workflow_id, status: "accepted" }

  return json(
    {
      error: "not_implemented",
      detail:
        "envelope validation passed but scope creation pending Milestone 2 " +
        "(requires CHITTYOS_CORE_DB Hyperdrive binding + FractalRunWorkflow class)",
      validated_envelope: { entry_id: result.req.entry_id, root_scope_type: result.req.root_scope_type }
    },
    { status: 501 }
  );
}

export async function handleGetRun(_runId: string, _env: Env, json: JsonFn): Promise<Response> {
  return json({ error: "not_implemented", detail: "pending Milestone 2" }, { status: 501 });
}

export async function handleRunEvent(_runId: string, _req: Request, _env: Env, json: JsonFn): Promise<Response> {
  return json({ error: "not_implemented", detail: "pending Milestone 5 (relooping)" }, { status: 501 });
}
