# chittyfractal-fabric

Cloudflare-native orchestration substrate for repeatable, refinable, auditable
agent workflows. Built on ChittyOS fractal scopes.

- **Charter**: [CHARTER.md](./CHARTER.md)
- **Architecture**: [CHITTY.md](./CHITTY.md)
- **Developer guide**: [AGENTS.md](./AGENTS.md)
- **Domain**: `chittyfractal-fabric.chitty.cc`
- **Tier**: 4 — domain agent orchestration

## Status

**DRAFT** — scaffold only. Milestone 0 (registration) + minimal Milestone 1
(envelope validation) implemented. Workflow classes and agents are stubs.

## Quick mental model

```
POST /api/v1/runs  →  FractalRunWorkflow
                       │
                       ├─ creates root scope (chittyos-core)
                       ├─ attaches artifact_refs as scope_artifacts
                       ├─ orchestrates agents through MiniLoops
                       ├─ relooping decisions per §14 rubric
                       ├─ accepted output → chittyevidence-db
                       └─ court_grade output → chittyledger
```

## Why a separate service

Existing services (chittyevidence-db, chittycounsel, chittystorage) each
implement parts of this orchestration ad-hoc. ChittyFractal Fabric extracts
the **control plane** so executors stay focused on their domain, and the
ChittyOS fractal-scope contract is honored uniformly.
