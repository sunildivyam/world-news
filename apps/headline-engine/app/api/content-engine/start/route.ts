// app/api/content-engine/start/route.ts

import { contentEngine } from "@worldnews/shared/server/content-engine/ContentEngine.class";

export async function POST() {
  console.log(contentEngine.isRunning, contentEngine.progress);
  if (!contentEngine.isRunning) {
    contentEngine.start();
    return Response.json({ message: "Content Engine started" });
  } else {
    return Response.json({ message: "Content Engine already Running" });
  }
}
