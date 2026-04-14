/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NewsEvent } from "@worldnews/shared";
import {
  deleteNewsEvent,
  updateNewsEvent,
} from "@worldnews/shared/mongo/collections/newsEvents";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const name = (await params).name;
    const updates: Partial<NewsEvent> = await request.json();

    const result = await updateNewsEvent(name.toLowerCase(), updates);

    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const name = (await params).name;
    const result = await deleteNewsEvent(name.toLowerCase());
    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}
