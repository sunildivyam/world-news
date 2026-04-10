// app/api/content-engine/status/route.ts

import { engineManager } from "@/lib/content-engine/ContentEngineManager";

export async function GET() {
  return Response.json(engineManager.getStatus());
}
