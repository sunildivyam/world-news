/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Headline } from "@worldnews/shared";
import {
  deleteHeadline,
  updateHeadline,
} from "@worldnews/shared/mongo/collections/headline";
import { error } from "@worldnews/shared/mongo/response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;
    const updates: Partial<Headline> = await request.json();

    const result = await updateHeadline(slug.toLowerCase(), updates);

    return result;
  } catch (e: any) {
    return error(e.message || e);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;
    const result = await deleteHeadline(slug.toLowerCase());
    return result;
  } catch (e: any) {
    return error(e.message || e);
  }
}
