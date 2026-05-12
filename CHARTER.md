---
uri: chittycanon://docs/tech/policy/chitty-fractal-fabric-charter
namespace: chittycanon://docs/tech
type: policy
version: 0.1.0
status: DRAFT
registered_with: chittycanon://core/services/canon
title: "ChittyFractal Fabric Charter"
certifier: chittycanon://core/services/chittycertify
visibility: PUBLIC
---

# ChittyFractal Fabric Charter

## Classification

- **Canonical URI**: `chittycanon://tech/services/chittyfractal-fabric`
- **Service**: `chittyfractal-fabric`
- **Domain**: `chittyfractal-fabric.chitty.cc`
- **Tier**: 4 (Domain agent orchestration)
- **Organization**: CHITTYFOUNDATION
- **Layer**: Workflow control plane / agent orchestration substrate

## Mission

Cloudflare-native orchestration layer for repeatable, refinable, auditable agent
workflows. The unit of truth is the **ChittyOS fractal scope** as defined in
`chittyschema/connectivity/migrations/chittyos-core/002_fractal_scopes.sql`.
Runs, documents, loops, evaluations, failures, patch proposals, replays, and
improvements are each represented as a scope or scope event.

The fabric replaces one-off extraction scripts and opaque agent chains with:
structured workflow entry, durable Cloudflare Workflows orchestration,
variable named agents, MiniLoops, governed relooping, evaluator gates,
Alchemist-driven improvement, and replayable benchmark corpora.

## Scope — IS responsible for

- Workflow entry envelope validation (`POST /api/v1/runs`)
- Durable agent orchestration via Cloudflare Workflows
- MiniLoop execution and reloop decisions
- Evaluation routing (internal + bounded third-party)
- Alchemist improvement proposals (artifacts, never silent mutation)
- Replay execution against benchmark corpora
- Scope event projection to `chittyos-core`
- Artifact persistence to R2

## Scope — IS NOT responsible for

- Canonical schema definitions → `chittyschema`
- Scope primitive DDL → `chittyschema` migration `002_fractal_scopes.sql`
- Entity identity resolution → `chittyentity`
- Legal evidence facts → `chittyevidence` / `chittyevidence-db`
- Immutable ledger anchoring → `chittyledger`
- Ontology authority → `chittycanon`
- Auth token issuance → `chittyauth` / `chittycert` / `chittyid`

## API Contract (v1)

| Method | Path | Purpose |
|--------|------|---------|
| GET    | `/health` | Service health (`{status, service}`) |
| GET    | `/api/v1/status` | Bindings + workflow class inventory |
| POST   | `/api/v1/runs` | Create root scope + start FractalRunWorkflow |
| GET    | `/api/v1/runs/:run_id` | Status, active loop, latest score |
| POST   | `/api/v1/runs/:run_id/events` | Human-in-loop event injection |
| POST   | `/api/v1/replays` | Run candidates against replay corpus |
| POST   | `/api/v1/improvements/:id/approve` | Promote Alchemist proposal |

Envelope schema: `chittyschema://scopes/agent/run-request.schema.json`.

## Dependencies

- **chittyschema** — scope primitive DDL, run envelope schemas, validators
- **chittycanon** — ontology, canonical URI namespace
- **chittyentity** — entity resolution / identity substrate
- **chittyos-core (Neon)** — scopes / scope_parties / scope_events / scope_artifacts
- **chittyevidence-db** — operational extraction sink
- **chittyledger** — finalized record anchoring (court-grade only)
- **chittytrack** — OTLP telemetry destination
- **chittymint** — ChittyID minting (no fabricated IDs)
- **chittyregister** — canonical service registration
- **Cloudflare** — Workers, Workflows, Durable Objects, Hyperdrive, R2, Queues,
  AI Search, Vectorize, AI Gateway, Workers AI, Pipelines, R2 Data Catalog

## Compliance Posture

- ChittyAuth service token authentication path
- All wrangler configs export OTLP to `chittytrack-logs` + `chittytrack-traces`
- All entity_type fields use canonical P/L/T/E/A (Claude = P/Synthetic, never T)
- All ChittyIDs minted via `mint.chitty.cc` — never fabricated
- Promotion gates required for any Alchemist proposal (no silent mutation)
- Third-party evaluator calls are scope_events; redacted payloads when required
- Privileged legal material requires explicit policy approval before any
  third-party model call

## Data Ownership

- Scope rows written to **service-local** scope table (when configured)
  and projected to **chittyos-core** for ecosystem-wide visibility
- Source artifacts in R2, addressed by content_hash
- Telemetry to chittytrack (OTLP) + R2 Pipelines lake
- Evidence facts to chittyevidence-db (only accepted/reviewable extractions)
- Ledger anchors to chittyledger (only finalized, court-grade outputs)

## Non-Goals

- Not a replacement for ChittySchema, ChittyEvidence, ChittyLedger, or ChittyCanon
- Does not store source files in Postgres
- Does not use Hyperdrive as agent memory
- Does not let external evaluators write directly to Evidence / Ledger / Canon
- Does not create new databases without explicit foundation-level approval

## Governance

- All material operations emit scope_events with actor + decision_reason
- Improvement proposals must pass replay benchmarks + human approval gate
  for `risk: high` or `requires_human_approval: true`
- Schema contract URIs are versioned; production traffic targets specific
  versions, never `latest`, for evidentiary reproducibility
