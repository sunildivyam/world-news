/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createArticleSource,
  createArticleSources,
  findArticleSource,
  findArticleSourceByName,
  findArticleSources,
} from "@worldnews/shared/mongo/collections/articleSources";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const name = searchParams.get("name");
    let result;
    if (slug && name) {
      result = await findArticleSource(slug.toLowerCase(), name);
    } else if (slug) {
      result = await findArticleSource(slug.toLowerCase());
    } else if (name) {
      result = await findArticleSourceByName(name);
    } else {
      result = await findArticleSources();
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
      const result = await createArticleSources(body);
      return apiSuccess(result);
    } else {
      // Single article source insert
      const result = await createArticleSource(body);
      return apiSuccess(result);
    }
  } catch (err: any) {
    return apiError(err);
  }
}
