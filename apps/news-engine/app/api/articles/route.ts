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
import { error } from "@worldnews/shared/mongo/response";

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

    if (slug && title) {
      return await findArticle(slug.toLowerCase(), title);
    } else if (slug) {
      return await findArticle(slug.toLowerCase());
    } else if (title) {
      return await findArticleByTitle(title);
    } else if (tenantId) {
      return await findArticlesByTenant(tenantId, limit);
    } else if (category) {
      return await findArticlesByCategory(category, limit);
    } else if (sourceId) {
      return await findArticlesBySource(sourceId, limit);
    } else {
      return await findArticles(limit);
    }
  } catch (e: any) {
    return error(e?.message || e, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's an array for bulk insert
    if (Array.isArray(body)) {
      const result = await createArticles(body);
      return result;
    } else {
      // Single article insert
      const result = await createArticle(body);
      return result;
    }
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
