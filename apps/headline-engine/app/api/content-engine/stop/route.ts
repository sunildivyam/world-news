// app/api/content-engine/stop/route.ts

import { contentEngine } from "@worldnews/shared/server/content-engine/ContentEngine.class";

export async function POST() {
  contentEngine.stop();

  return Response.json({ message: "Engine stopped" });
}
