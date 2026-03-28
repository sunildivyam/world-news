/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createArticleSource,
  createArticleSources,
  findArticleSource,
  findArticleSourceByName,
  findArticleSources,
} from "@worldnews/shared/mongo/collections/articleSources";
import { error } from "@worldnews/shared/mongo/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const name = searchParams.get("name");

    if (slug && name) {
      return await findArticleSource(slug.toLowerCase(), name);
    } else if (slug) {
      return await findArticleSource(slug.toLowerCase());
    } else if (name) {
      return await findArticleSourceByName(name);
    } else {
      return await findArticleSources();
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
      const result = await createArticleSources(body);
      return result;
    } else {
      // Single article source insert
      const result = await createArticleSource(body);
      return result;
    }
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
