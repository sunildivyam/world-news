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
  findHeadlinesByContentGenerated,
} from "@worldnews/shared/mongo/collections/headline";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const title = searchParams.get("title");
    const tenantId = searchParams.get("tenantId");
    const category = searchParams.get("category");
    const sourceId = searchParams.get("sourceId");
    const providerName = searchParams.get("providerName");
    const contentGeneratedAt = searchParams.get("contentGeneratedAt");
    const countries = searchParams.getAll("country");
    const categories = searchParams.getAll("category");
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;

    let result;
    if (slug && title) {
      result = await findHeadline(slug.toLowerCase(), title);
    } else if (slug) {
      result = await findHeadline(slug.toLowerCase());
    } else if (title) {
      result = await findHeadlineByTitle(title);
    } else if (tenantId) {
      result = await findHeadlinesByTenant(tenantId, limit);
    } else if (category) {
      result = await findHeadlinesByCategory(category, limit);
    } else if (sourceId) {
      result = await findHeadlinesBySource(sourceId, limit);
    } else if (providerName) {
      result = await findHeadlinesByProvider(providerName, limit);
    } else if (countries.length > 0 || categories.length > 0) {
      result = await findHeadlinesByCountryAndCategory(
        countries,
        categories,
        limit,
      );
    } else if (contentGeneratedAt) {
      result = await findHeadlinesByContentGenerated(contentGeneratedAt, limit);
    } else {
      result = await findHeadlines(limit);
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
      const result = await createHeadlines(body);
      return apiSuccess(result);
    } else {
      // Single headline insert
      const result = await createHeadline(body);
      return apiSuccess(result);
    }
  } catch (err: any) {
    return apiError(err);
  }
}
