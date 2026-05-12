import type { Env } from "../env";

export function handleHealth(env: Env, json: (b: unknown, i?: ResponseInit) => Response) {
  return json({
    status: "ok",
    service: "chittyfractal-fabric",
    version: env.SERVICE_VERSION
  });
}
