/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewsBatch } from "@worldnews/shared";
import {
  deleteNewsBatch,
  updateNewsBatch,
} from "@worldnews/shared/mongo/collections/newsBatches";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const updates: Partial<NewsBatch> = await request.json();

    const result = await updateNewsBatch(id, updates);

    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const result = await deleteNewsBatch(id);
    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}
