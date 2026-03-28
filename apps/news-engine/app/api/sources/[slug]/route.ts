/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ArticleSource } from "@worldnews/shared";
import {
  deleteArticleSource,
  updateArticleSource,
} from "@worldnews/shared/mongo/collections/articleSources";
import { error } from "@worldnews/shared/mongo/response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;
    const updates: Partial<ArticleSource> = await request.json();

    const result = await updateArticleSource(slug.toLowerCase(), updates);

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
    const result = await deleteArticleSource(slug.toLowerCase());
    return result;
  } catch (e: any) {
    return error(e.message || e);
  }
}
