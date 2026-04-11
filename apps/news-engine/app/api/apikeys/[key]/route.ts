/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiKey } from "@worldnews/shared";
import {
  deleteApiKey,
  expireApiKey,
  updateApiKey,
} from "@worldnews/shared/mongo/collections/apiKeys";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const key = (await params).key;
    const { expire, ...updates } = await request.json();

    if (expire === true) {
      const result = await expireApiKey(key);
      return apiSuccess(result);
    }

    const result = await updateApiKey(key, updates);
    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const key = (await params).key;
    const result = await deleteApiKey(key);
    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}
