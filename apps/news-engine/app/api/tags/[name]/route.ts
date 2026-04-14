/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Tag } from "@worldnews/shared";
import { deleteTag, updateTag } from "@worldnews/shared/mongo/collections/tags";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const name = (await params).name;
    const updates: Partial<Tag> = await request.json();

    const result = await updateTag(name.toLowerCase(), updates);

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
    const result = await deleteTag(name.toLowerCase());
    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}
