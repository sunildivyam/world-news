/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createArticle,
  createArticles,
  findArticle,
  findArticleByTitle,
  findArticles,
  findArticlesByCategory,
  findArticlesBySource,
  findArticlesByTenant,
} from "@worldnews/shared/mongo/collections/articles";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const title = searchParams.get("title");
    const tenantId = searchParams.get("tenantId");
    const category = searchParams.get("category");
    const sourceId = searchParams.get("sourceId");
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;

    let result;
    if (slug && title) {
      result = await findArticle(slug.toLowerCase(), title);
    } else if (slug) {
      result = await findArticle(slug.toLowerCase());
    } else if (title) {
      result = await findArticleByTitle(title);
    } else if (tenantId) {
      result = await findArticlesByTenant(tenantId, limit);
    } else if (category) {
      result = await findArticlesByCategory(category, limit);
    } else if (sourceId) {
      result = await findArticlesBySource(sourceId, limit);
    } else {
      result = await findArticles(limit);
    }

    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's an array for bulk insert
    if (Array.isArray(body)) {
      const result = await createArticles(body);
      return apiSuccess(result);
    } else {
      // Single article insert
      const result = await createArticle(body);
      return apiSuccess(result);
    }
  } catch (err: any) {
    return apiError(err);
  }
}
