/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createNewsEvent,
  findNewsEvent,
  findNewsEventByLabel,
  findNewsEvents,
} from "@worldnews/shared/mongo/collections/newsEvents";
import { error } from "@worldnews/shared/mongo/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const label = searchParams.get("label");

    if (name && label) {
      return await findNewsEvent(name.toLowerCase(), label);
    } else if (name) {
      return await findNewsEvent(name.toLowerCase());
    } else if (label) {
      return await findNewsEventByLabel(label);
    } else {
      return await findNewsEvents();
    }
  } catch (e: any) {
    return error(e?.message || e, 500);
  }
}

export async function POST(request: Request) {
  try {
    const newsEvent = await request.json();

    const result = await createNewsEvent(newsEvent);
    return result;
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
