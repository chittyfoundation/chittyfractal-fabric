---
uri: chittycanon://docs/tech/architecture/chitty-fractal-fabric
namespace: chittycanon://docs/tech
type: architecture
version: 0.1.0
status: DRAFT
registered_with: chittycanon://core/services/canon
title: "ChittyFractal Fabric — Architecture & Badge"
certifier: chittycanon://core/services/chittycertify
visibility: PUBLIC
---

# ChittyFractal Fabric

## Badge

```
service:        chittyfractal-fabric
tier:           4
status:         DRAFT
certification:  None (scaffold)
canon_uri:      chittycanon://tech/services/chittyfractal-fabric
domain:         chittyfractal-fabric.chitty.cc
org:            CHITTYFOUNDATION
```

## ChittyDNA

- **Identity**: Synthetic Person (P) ChittyOS service
- **Entity type**: Service-of-Services control plane
- **Position**: Sits *above* domain executors (chittyevidence-db, chittycounsel,
  chittystorage), *below* application clients. Translates application intent
  into governed agent workflows.

## Architecture Snapshot

```
Client / App
    ↓
chittyfractal-fabric Worker (API + envelope validation)
    ↓
FractalRunWorkflow (Cloudflare Workflow — durable)
    ↓ orchestrates ↓
Named Agents (Durable Objects):
  RouterAgent · SchemaAgent · RetrievalAgent · ExtractorAgent
  VerifierAgent · ContradictionAgent · EvaluatorAgent
  ThirdPartyEvaluatorAgent · AlchemistAgent · LedgerAgent
    ↓ executes ↓
MiniLoops: Plan → Act → Verify → Score → Decide → Persist
    ↓ persists ↓
chittyos-core (scopes/parties/events/artifacts via Hyperdrive)
chittyevidence-db (accepted facts)
chittyledger (court-grade finalized)
R2 (artifacts), AI Search + Vectorize (retrieval),
chittytrack (OTLP), Pipelines (replay lake)
```

## Ecosystem Placement

| Layer | Service | Role |
|-------|---------|------|
| Schema | `chittyschema` | Scope primitive DDL, run envelope schemas |
| Ontology | `chittycanon` | URIs, P/L/T/E/A types |
| Identity | `chittyentity` | Entity resolution dependency |
| Control plane | **`chittyfractal-fabric`** | Workflow orchestration (this service) |
| Executor | `chittyevidence-db` | Document extraction workflow |
| Executor | `chittycounsel` | Case-strategy retrieval |
| Executor | `chittystorage` | Artifact persistence |
| Evidence sink | `chittyevidence` | Reviewable extractions |
| Ledger sink | `chittyledger` | Court-grade finalized |
| Identity mint | `chittymint` | ChittyID issuance |
| Telemetry | `chittytrack` | OTLP receiver |
| Catalog | `chittyregister` | Service registration |

## Runtime Bindings (canonical)

```jsonc
{
  "hyperdrive": ["CHITTYOS_CORE_DB", "CHITTYEVIDENCE_DB", "CHITTYLEDGER_DB"],
  "durable_objects": [
    "ROUTER_AGENT","SCHEMA_AGENT","RETRIEVAL_AGENT","EXTRACTOR_AGENT",
    "VERIFIER_AGENT","EVALUATOR_AGENT","ALCHEMIST_AGENT","LEDGER_AGENT"
  ],
  "workflows": [
    "FRACTAL_RUN_WORKFLOW",
    "DOCUMENT_EXTRACTION_WORKFLOW",
    "REPLAY_EVALUATION_WORKFLOW",
    "ALCHEMIST_IMPROVEMENT_WORKFLOW"
  ],
  "r2": ["ARTIFACTS", "TELEMETRY_LAKE"],
  "queues_producers": ["AGENT_TASK_QUEUE","AGENT_EVAL_QUEUE","AGENT_REPLAY_QUEUE","AGENT_ALCHEMY_QUEUE"],
  "queues_consumers": ["agent-task-queue","agent-eval-queue","agent-replay-queue","agent-alchemy-queue","agent-dlq"],
  "ai": "AI",
  "observability": {
    "logs": ["chittytrack-logs"],
    "traces": ["chittytrack-traces"]
  }
}
```

## Certification Roadmap

| Stage | Requirement |
|-------|-------------|
| Compatible | CHARTER + CHITTY + AGENTS + /health + canonical wrangler observability |
| Compliant | All entity types use P/L/T/E/A; no fabricated ChittyIDs; OTLP wired |
| Certified | Replay corpus established; Alchemist promotion gates enforced |
| Canonical | Court-grade ledger path verified; cross-service scope projection live |

## Scope-Type Vocabulary (registered with chittycanon)

```
agent.workflow                        characterization=Project
agent.loop                            characterization=Engagement
agent.loop.ocr                        characterization=Engagement
agent.loop.extraction                 characterization=Engagement
agent.loop.verification               characterization=Engagement
agent.loop.evaluation                 characterization=Engagement
agent.loop.alchemy                    characterization=Engagement
agent.replay                          characterization=Session
agent.evaluation                      characterization=Engagement
agent.improvement.proposal            characterization=Project
agent.policy.decision                 characterization=Incident
legal.document_extraction             characterization=Engagement
legal.litigation.case                 characterization=Case
legal.litigation.claim                characterization=Engagement
legal.litigation.filing               characterization=Transaction
legal.litigation.motion               characterization=Transaction
legal.litigation.discovery            characterization=Engagement
legal.litigation.deadline             characterization=Engagement
legal.litigation.evidence             characterization=Engagement
corporate_governance.document         characterization=Engagement
corporate_governance.operating_agreement characterization=Engagement
corporate_governance.amendment        characterization=Transaction
corporate_governance.resolution       characterization=Transaction
corporate_governance.audit_trail      characterization=Engagement
```

## Status Mapping (fabric MiniLoop → scope_status)

| Fabric loop state | scope_status |
|-------------------|--------------|
| new               | new          |
| running           | active       |
| waiting           | waiting      |
| passed            | resolved     |
| failed            | closed (status_reason set) |
| escalated         | escalated    |
