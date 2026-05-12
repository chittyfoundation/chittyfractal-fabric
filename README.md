# chittyfractal-fabric — MOVED

**This repo has been superseded.** The canonical home is now:

> **https://github.com/chittyapps/chittyfractal-fabric**

The CHITTYAPPS version is a **dual-implementation** service:
- **`cloudflare/`** — primary Cloudflare Workers + Workflows + Workers AI (this repo's original scope)
- **`src/extraction_review/`** — fallback Python + LlamaIndex (open-source patterns)

with a shared `configs/config.json` (4 doc-class schemas) and a React UI in
`ui/` that targets either backend via `VITE_API_BASE_URL`.

This `chittyfoundation/` repo is being archived; please use the new home.

— canon: `chittycanon://apps/services/chittyfractal-fabric`
