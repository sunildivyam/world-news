/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Headline } from "@worldnews/shared";
import {
  deleteHeadline,
  updateHeadline,
} from "@worldnews/shared/mongo/collections/headline";
import { error } from "@worldnews/shared/mongo/response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const updates: Partial<Headline> = await request.json();
    console.log("in Route: ", id);
    const result = await updateHeadline(id.toLowerCase(), updates);
    console.log("Post Route: ", id);
    return result;
  } catch (e: any) {
    console.log("in Error: ", e);
    return error(e.message || e);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const result = await deleteHeadline(id.toLowerCase());
    return result;
  } catch (e: any) {
    return error(e.message || e);
  }
}
