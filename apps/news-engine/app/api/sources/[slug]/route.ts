/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ArticleSource } from "@worldnews/shared";
import {
  deleteArticleSource,
  updateArticleSource,
} from "@worldnews/shared/mongo/collections/articleSources";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;
    const updates: Partial<ArticleSource> = await request.json();

    const result = await updateArticleSource(slug.toLowerCase(), updates);

    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;
    const result = await deleteArticleSource(slug.toLowerCase());
    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}
