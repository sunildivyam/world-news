/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewsBatch } from "@worldnews/shared";
import {
  deleteNewsBatch,
  updateNewsBatch,
} from "@worldnews/shared/mongo/collections/newsBatches";
import { error } from "@worldnews/shared/mongo/response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const updates: Partial<NewsBatch> = await request.json();

    const result = await updateNewsBatch(id, updates);

    return result;
  } catch (e: any) {
    return error(e.message || e);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const result = await deleteNewsBatch(id);
    return result;
  } catch (e: any) {
    return error(e.message || e);
  }
}
