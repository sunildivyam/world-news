/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Category } from "@worldnews/shared";
import {
  deleteCategory,
  updateCategory,
} from "@worldnews/shared/mongo/collections/categories";
import { error } from "@worldnews/shared/mongo/response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const name = (await params).name;
    const updates: Partial<Category> = await request.json();

    const result = await updateCategory(name.toLowerCase(), updates);

    return result;
  } catch (e: any) {
    return error(e.message || e);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const name = (await params).name;
    const result = await deleteCategory(name.toLowerCase());
    return result;
  } catch (e: any) {
    return error(e.message || e);
  }
}
