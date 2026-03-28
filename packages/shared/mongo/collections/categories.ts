/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category } from "../../types";
import { getCollections } from "../collections";
import { InsertOneResult, UpdateResult } from "mongodb";
import { error, success } from "../response";

export async function createCategory(category: Category) {
  if (!category?.name) return error("Empty Category can not be created.");

  try {
    const { categories } = await getCollections();

    const result: InsertOneResult = await categories.insertOne(category);

    if (!result.insertedId) {
      return error("Failed to create Category");
    }

    return success({ ...category, id: result.insertedId });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function updateCategory(name: string, updates: Partial<Category>) {
  if (!name) return error("Empty Category name, can not be updated.");
  try {
    const { categories } = await getCollections();
    const result: UpdateResult = await categories.updateOne(
      { name },
      { $set: updates },
    );

    if (result.modifiedCount === 0) {
      return error("Failed to update Category", 500);
    }

    return success({ name });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function deleteCategory(name: string) {
  if (!name) return error("Empty Category name, can not be deleted.");
  try {
    const { categories } = await getCollections();
    const result = await categories.deleteOne({ name });

    if (result.deletedCount === 0) {
      return error("Failed to delete Category", 404);
    }

    return success({ name });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findCategory(name: string, label?: string) {
  if (!name) return error("Empty Category name");

  try {
    const { categories } = await getCollections();
    const q = label
      ? {
          $or: [
            { name: name.toLowerCase() },
            { label: { $regex: `^${label}`, $options: "i" } },
          ],
        }
      : { name };

    const category = await categories.findOne(q);

    if (!category) {
      return error("Category not found", 404);
    }

    return success(category);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findCategoryByLabel(label: string) {
  if (!label) return error("Empty Category label");

  try {
    const { categories } = await getCollections();
    const category = await categories.findOne({
      label: { $regex: `^${label}`, $options: "i" },
    });

    if (!category) {
      return error("Category not found", 404);
    }

    return success(category);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findCategories() {
  try {
    const { categories } = await getCollections();
    const result = await categories.find<Category>({}).toArray();

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function createCategories(categoriesArray: Category[]) {
  if (!categoriesArray || categoriesArray.length === 0)
    return error("Empty categories array can not be created.");

  try {
    const { categories } = await getCollections();

    const result = await categories.insertMany(categoriesArray);

    if (!result.insertedIds || result.insertedCount === 0) {
      return error("Failed to create categories");
    }

    return success({
      insertedCount: result.insertedCount,
      insertedIds: Object.values(result.insertedIds),
    });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
