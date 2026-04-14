/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Article } from "@worldnews/shared";
import {
  deleteArticle,
  updateArticle,
} from "@worldnews/shared/mongo/collections/articles";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;
    const updates: Partial<Article> = await request.json();

    const result = await updateArticle(slug.toLowerCase(), updates);

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
    const result = await deleteArticle(slug.toLowerCase());
    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}
