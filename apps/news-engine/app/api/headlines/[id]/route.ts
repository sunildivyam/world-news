/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Headline } from "@worldnews/shared";
import {
  deleteHeadline,
  updateHeadline,
} from "@worldnews/shared/mongo/collections/headline";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const updates: Partial<Headline> = await request.json();

    const result = await updateHeadline(id.toLowerCase(), updates);

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
    const result = await deleteHeadline(id.toLowerCase());
    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}
