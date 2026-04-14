/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createNewsEvent,
  createNewsEvents,
  findNewsEvent,
  findNewsEventByLabel,
  findNewsEvents,
} from "@worldnews/shared/mongo/collections/newsEvents";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const label = searchParams.get("label");

    let result;
    if (name && label) {
      result = await findNewsEvent(name.toLowerCase(), label);
    } else if (name) {
      result = await findNewsEvent(name.toLowerCase());
    } else if (label) {
      result = await findNewsEventByLabel(label);
    } else {
      result = await findNewsEvents();
    }

    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's an array for bulk insert
    if (Array.isArray(body)) {
      const result = await createNewsEvents(body);
      return apiSuccess(result);
    } else {
      // Single news event insert
      const result = await createNewsEvent(body);
      return apiSuccess(result);
    }
  } catch (err: any) {
    return apiError(err);
  }
}
