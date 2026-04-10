/* eslint-disable @typescript-eslint/no-explicit-any */
import { findLatest } from "@worldnews/shared/mongo/collections/articles";
import { error } from "@worldnews/shared/mongo/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || undefined;
    const slug = searchParams.get("slug") || undefined;
    const country = searchParams.get("country") || undefined;
    const language = searchParams.get("language") || undefined;
    const tenantId = searchParams.get("tenantId") || undefined;
    const category = searchParams.get("category") || undefined;
    const keywords =
      searchParams
        .get("keywords")
        ?.split(",")
        .map((k) => k.trim()) || undefined;
    const tags =
      searchParams
        .get("tags")
        ?.split(",")
        .map((t) => t.trim()) || undefined;

    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!)
      : undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const fields =
      searchParams
        .get("fields")
        ?.split(",")
        .map((k) => k.trim()) || undefined;
    const hours = searchParams.get("hours")
      ? parseInt(searchParams.get("hours")!)
      : undefined;
    const result = await findLatest(
      id,
      slug,
      country,
      language,
      tenantId,
      keywords,
      tags,
      category,
      page,
      limit,
      fields,
      hours,
    );

    return Response.json(result);
  } catch (e: any) {
    return error(e?.message || e, 500);
  }
}
