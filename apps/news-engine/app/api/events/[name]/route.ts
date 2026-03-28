/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NewsEvent } from "@worldnews/shared";
import {
  deleteNewsEvent,
  updateNewsEvent,
} from "@worldnews/shared/mongo/collections/newsEvents";
import { error } from "@worldnews/shared/mongo/response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const name = (await params).name;
    const updates: Partial<NewsEvent> = await request.json();

    const result = await updateNewsEvent(name.toLowerCase(), updates);

    return result;
  } catch (e: any) {
    return error(e.message || e);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const name = (await params).name;
    const result = await deleteNewsEvent(name.toLowerCase());
    return result;
  } catch (e: any) {
    return error(e.message || e);
  }
}
