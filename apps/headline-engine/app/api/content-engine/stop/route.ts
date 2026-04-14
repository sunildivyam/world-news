// app/api/content-engine/stop/route.ts

import { engineManager } from "@/lib/content-engine/ContentEngineManager";

export async function POST() {
  engineManager.stop();

  return Response.json({ message: "Engine stopped" });
}
