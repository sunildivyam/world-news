/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiKey } from "@worldnews/shared";
import {
  deleteApiKey,
  expireApiKey,
  updateApiKey,
} from "@worldnews/shared/mongo/collections/apiKeys";
import { error } from "@worldnews/shared/mongo/response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const key = (await params).key;
    const { expire, ...updates } = await request.json();

    if (expire === true) {
      const result = await expireApiKey(key);
      return result;
    }

    const result = await updateApiKey(key, updates);
    return result;
  } catch (e: any) {
    return error(e.message || e);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const key = (await params).key;
    const result = await deleteApiKey(key);
    return result;
  } catch (e: any) {
    return error(e.message || e);
  }
}
