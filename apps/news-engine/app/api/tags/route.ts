/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createTag,
  createTags,
  findTag,
  findTagByLabel,
  findTags,
} from "@worldnews/shared/mongo/collections/tags";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const label = searchParams.get("label");

    let result;
    if (name && label) {
      result = await findTag(name.toLowerCase(), label);
    } else if (name) {
      result = await findTag(name.toLowerCase());
    } else if (label) {
      result = await findTagByLabel(label);
    } else {
      result = await findTags();
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
      const result = await createTags(body);
      return apiSuccess(result);
    } else {
      // Single tag insert
      const result = await createTag(body);
      return apiSuccess(result);
    }
  } catch (err: any) {
    return apiError(err);
  }
}
