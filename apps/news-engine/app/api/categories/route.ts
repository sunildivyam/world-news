/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createCategories,
  createCategory,
  findCategory,
  findCategoryByLabel,
  findCategories,
} from "@worldnews/shared/mongo/collections/categories";
import { error } from "@worldnews/shared/mongo/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const label = searchParams.get("label");
    const names = searchParams.get("names");

    if (name && label) {
      return await findCategory(name.toLowerCase(), label);
    } else if (name) {
      return await findCategory(name.toLowerCase());
    } else if (label) {
      return await findCategoryByLabel(label);
    } else if (names) {
        return await findCategories(names.split(","));
    } else {
      return await findCategories();
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
      const result = await createCategories(body);
      return result;
    } else {
      // Single category insert
      const result = await createCategory(body);
      return result;
    }
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
