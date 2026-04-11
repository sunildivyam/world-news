/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createCategories,
  createCategory,
  findCategory,
  findCategoryByLabel,
  findCategories,
} from "@worldnews/shared/mongo/collections/categories";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const label = searchParams.get("label");
    const names = searchParams.get("names");

    let result;
    if (name && label) {
      result = await findCategory(name.toLowerCase(), label);
    } else if (name) {
      result = await findCategory(name.toLowerCase());
    } else if (label) {
      result = await findCategoryByLabel(label);
    } else if (names) {
      result = await findCategories(names.split(","));
    } else {
      result = await findCategories();
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
      const result = await createCategories(body);
      return apiSuccess(result);
    } else {
      // Single category insert
      const result = await createCategory(body);
      return apiSuccess(result);
    }
  } catch (err: any) {
    return apiError(err);
  }
}
