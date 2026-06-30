// app/api/content-engine/status/route.ts

import { contentEngine } from "@worldnews/shared/server/content-engine/ContentEngine.class";

export async function GET() {
  return Response.json(contentEngine.progress);
}
