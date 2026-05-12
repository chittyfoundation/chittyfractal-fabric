// chittyfractal-fabric — Worker entry
//
// @canon: chittycanon://tech/services/chittyfractal-fabric
// @charter: ./CHARTER.md
// @arch: ./CHITTY.md

import type { Env } from "./env";
import { handleHealth } from "./api/health";
import { handleCreateRun, handleGetRun, handleRunEvent } from "./api/runs";
import { handleStatus } from "./api/status";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Chitty-Auth"
};

const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: {
      "content-type": "application/json",
      ...corsHeaders,
      ...(init.headers ?? {})
    }
  });

const notFound = () =>
  json({ error: "not_found", service: "chittyfractal-fabric" }, { status: 404 });

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(req.url);
    const { pathname } = url;

    try {
      // Health
      if (pathname === "/health" && req.method === "GET") {
        return handleHealth(env, json);
      }

      // Status (bindings + workflow inventory)
      if (pathname === "/api/v1/status" && req.method === "GET") {
        return handleStatus(env, json);
      }

      // Runs
      if (pathname === "/api/v1/runs" && req.method === "POST") {
        return handleCreateRun(req, env, ctx, json);
      }

      const runMatch = pathname.match(/^\/api\/v1\/runs\/([^/]+)$/);
      if (runMatch && req.method === "GET") {
        return handleGetRun(runMatch[1]!, env, json);
      }

      const eventMatch = pathname.match(/^\/api\/v1\/runs\/([^/]+)\/events$/);
      if (eventMatch && req.method === "POST") {
        return handleRunEvent(eventMatch[1]!, req, env, json);
      }

      // Root
      if (pathname === "/" && req.method === "GET") {
        return json({
          service: "chittyfractal-fabric",
          version: env.SERVICE_VERSION,
          charter: "./CHARTER.md",
          docs: "https://chittyfractal-fabric.chitty.cc/api/v1/status"
        });
      }

      return notFound();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return json(
        { error: "internal", service: "chittyfractal-fabric", detail: msg },
        { status: 500 }
      );
    }
  }
} satisfies ExportedHandler<Env>;
