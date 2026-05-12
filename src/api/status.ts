import type { Env } from "../env";

export function handleStatus(env: Env, json: (b: unknown, i?: ResponseInit) => Response) {
  return json({
    service: "chittyfractal-fabric",
    version: env.SERVICE_VERSION,
    canonical_uri: env.CHITTYCANON_URI,
    default_policy_profile: env.DEFAULT_POLICY_PROFILE,
    bindings: {
      // bool flags — `bindings.missing` scope events are emitted at runtime
      // for *required* bindings absent (per CHARTER §7.4).
      ai: Boolean(env.AI),
      chittyos_core_db: Boolean(env.CHITTYOS_CORE_DB),
      chittyevidence_db: Boolean(env.CHITTYEVIDENCE_DB),
      chittyledger_db: Boolean(env.CHITTYLEDGER_DB),
      artifacts_r2: Boolean(env.ARTIFACTS),
      telemetry_lake_r2: Boolean(env.TELEMETRY_LAKE),
      agent_task_queue: Boolean(env.AGENT_TASK_QUEUE),
      agent_eval_queue: Boolean(env.AGENT_EVAL_QUEUE),
      agent_replay_queue: Boolean(env.AGENT_REPLAY_QUEUE),
      agent_alchemy_queue: Boolean(env.AGENT_ALCHEMY_QUEUE),
      chittyschema: Boolean(env.CHITTYSCHEMA),
      chittymint: Boolean(env.CHITTYMINT)
    },
    workflows: [
      // populated as classes are implemented
    ],
    durable_object_agents: [
      // populated as classes are implemented
    ],
    scope_schema: {
      source: "chittyschema://connectivity/migrations/chittyos-core/002_fractal_scopes.sql",
      version: "2026-04-14"
    }
  });
}
