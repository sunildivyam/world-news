/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Article } from "@worldnews/shared";
import {
  deleteArticle,
  updateArticle,
} from "@worldnews/shared/mongo/collections/articles";
import { error } from "@worldnews/shared/mongo/response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;
    const updates: Partial<Article> = await request.json();

    const result = await updateArticle(slug.toLowerCase(), updates);

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
    const result = await deleteArticle(slug.toLowerCase());
    return result;
  } catch (e: any) {
    return error(e.message || e);
  }
}
