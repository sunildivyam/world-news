// app/api/content-engine/start/route.ts

import { engineManager } from "@/lib/content-engine/ContentEngineManager";

export async function POST() {
  await engineManager.start();

  return Response.json({ message: "Engine started" });
}
