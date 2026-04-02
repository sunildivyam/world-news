/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createHeadline,
  createHeadlines,
  findHeadline,
  findHeadlineByTitle,
  findHeadlines,
  findHeadlinesByCategory,
  findHeadlinesByProvider,
  findHeadlinesBySource,
  findHeadlinesByTenant,
  findHeadlinesByCountryAndCategory,
} from "@worldnews/shared/mongo/collections/headline";
import { error } from "@worldnews/shared/mongo/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const title = searchParams.get("title");
    const tenantId = searchParams.get("tenantId");
    const category = searchParams.get("category");
    const sourceId = searchParams.get("sourceId");
    const providerName = searchParams.get("providerName");
    const countries = searchParams.getAll("country");
    const categories = searchParams.getAll("category");
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;

    if (slug && title) {
      return await findHeadline(slug.toLowerCase(), title);
    } else if (slug) {
      return await findHeadline(slug.toLowerCase());
    } else if (title) {
      return await findHeadlineByTitle(title);
    } else if (tenantId) {
      return await findHeadlinesByTenant(tenantId, limit);
    } else if (category) {
      return await findHeadlinesByCategory(category, limit);
    } else if (sourceId) {
      return await findHeadlinesBySource(sourceId, limit);
    } else if (providerName) {
      return await findHeadlinesByProvider(providerName, limit);
    } else if (countries.length > 0 || categories.length > 0) {
      return await findHeadlinesByCountryAndCategory(
        countries,
        categories,
        limit,
      );
    } else {
      return await findHeadlines(limit);
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
      const result = await createHeadlines(body);
      return result;
    } else {
      // Single headline insert
      const result = await createHeadline(body);
      return result;
    }
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
