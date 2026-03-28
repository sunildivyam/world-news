/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category } from "@worldnews/shared";
import {
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

    if (name && label) {
      return await findCategory(name.toLowerCase(), label);
    } else if (name) {
      return await findCategory(name.toLowerCase());
    } else if (label) {
      return await findCategoryByLabel(label);
    } else {
      return await findCategories();
    }
  } catch (e: any) {
    return error(e?.message || e, 500);
  }
}

export async function POST(request: Request) {
  try {
    const category: Category = await request.json();

    const result = await createCategory(category);
    return result;
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
