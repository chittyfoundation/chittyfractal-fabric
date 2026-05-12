# AGENTS.md — ChittyFractal Fabric Developer Guide

Developer-facing patterns for working on `chittyfractal-fabric`. See CHARTER.md
for policy and CHITTY.md for architecture.

## Quickstart

```bash
# In CHITTYFOUNDATION/chittyfractal-fabric
npm install
op run --env-file=.env.local -- npm run dev    # Wrangler dev
op run --env-file=.env.local -- npm run deploy # production deploy
```

## Repository Layout

```
src/
├── index.ts              # Worker entry, route dispatch
├── env.ts                # Env interface (bindings)
├── api/                  # HTTP route handlers
│   ├── health.ts         # GET /health
│   ├── runs.ts           # POST /api/v1/runs, GET /:id, POST /:id/events
│   ├── replays.ts        # POST /api/v1/replays
│   └── improvements.ts   # POST /api/v1/improvements/:id/approve
├── workflows/            # Cloudflare Workflow classes
│   ├── FractalRunWorkflow.ts
│   ├── DocumentExtractionWorkflow.ts
│   ├── ReplayEvaluationWorkflow.ts
│   └── AlchemistImprovementWorkflow.ts
├── agents/               # Durable Object named agents
│   ├── RouterAgent.ts · SchemaAgent.ts · RetrievalAgent.ts
│   ├── ExtractorAgent.ts · VerifierAgent.ts · ContradictionAgent.ts
│   ├── EvaluatorAgent.ts · ThirdPartyEvaluatorAgent.ts
│   ├── AlchemistAgent.ts · LedgerAgent.ts
├── loops/                # MiniLoop primitives
├── scope/                # Scope projection (writes to chittyos-core)
│   ├── types.ts          # TypeScript shape matching SQL DDL
│   ├── projector.ts      # Hyperdrive write path
│   ├── events.ts         # scope_events emission
│   ├── artifacts.ts      # scope_artifacts R2 storage routing
│   └── ontology.ts       # scope_type / characterization helpers
├── retrieval/            # AI Search · Vectorize · R2 · Postgres lanes
├── evaluation/           # Rubrics · scoring · third-party
├── persistence/          # Hyperdrive · evidence · ledger · telemetry
└── schemas/              # Local JSON Schema fixtures (canonical lives in chittyschema)
```

## Patterns

### Scope writes are projections, never definitions

The DDL lives in `chittyschema/connectivity/migrations/chittyos-core/002_fractal_scopes.sql`.
This service **uses** the columns; it never adds new ones. If a domain needs
new shape, put it in `scopes.metadata` JSONB or propose a chittyschema migration.

### Scope-type values are free text, characterization is enum

```ts
// CORRECT
await projector.create({
  scope_type: "agent.loop.extraction",         // free text from registered vocab
  characterization: "Engagement",              // must be one of the SQL enum values
  metadata: { policy_profile: "balanced", ... }
});

// WRONG — don't add scope_type to an enum, don't put domain state in columns
```

### Status transitions auto-emit scope_events via trigger

The chittyos-core `scopes` table has `trg_scopes_touch` and the status-transition
event trigger. Updating `status` automatically inserts into `scope_events`.
Don't double-write.

### Entity types are P/L/T/E/A always

Per chittycanon ontology. Claude / agents are **Synthetic Person (P)** in
`scope_parties.entity_type`, NEVER `T`. The CHECK constraint will reject `T`
for agents anyway.

### No fabricated ChittyIDs

If `scopes.chitty_id` is being populated, the value must come from
`mint.chitty.cc/v1/mint` — never hand-fabricated. Block known-bad upstream:
`id.chitty.cc/v1/mint` currently has a bug where it always returns
`entityType=T` (tracked as ecosystem issue).

### Observability is non-negotiable

`wrangler.jsonc` must include:
- `observability.logs.destinations` includes `chittytrack-logs`
- `observability.traces.destinations` includes `chittytrack-traces`
- `observability.traces.persist` is `false`

The CI workflow `.github/workflows/check-observability.yml` enforces this.

## Debugging

```bash
wrangler tail chittyfractal-fabric --format pretty
wrangler workflows list FRACTAL_RUN_WORKFLOW
wrangler workflows instances list FRACTAL_RUN_WORKFLOW
wrangler workflows instances describe FRACTAL_RUN_WORKFLOW <instance-id>
```

## Common Failure Modes

| Failure | Cause | Fix |
|---------|-------|-----|
| `db.binding.missing` scope_event | Hyperdrive binding absent | Bind in wrangler.jsonc, set HYPERDRIVE_ID secret |
| Workflow stuck in `waiting` | Human-in-loop event not injected | `POST /api/v1/runs/:id/events` with approval/correction |
| Reloop budget exhausted | LoopBudget.max_rounds hit before stop_score | Raise budget or improve extractor prompt |
| Evaluator disagreement loop | Internal vs third-party scoring divergence | Routes to `ask_human` decision |
| Hallucination quarantine | ContradictionAgent flagged | Manual review at `/api/v1/runs/:id` |

## Deployment

Per CHITTYFOUNDATION branch completion policy: implementation + tests complete →
push branch → auto-PR → enable auto-merge when checks green. Manual menus only
on explicit request.
