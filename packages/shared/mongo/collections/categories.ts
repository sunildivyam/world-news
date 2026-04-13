/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError, Category } from "../../types";
import { getCollections } from "../collections";
import { InsertOneResult, UpdateResult } from "mongodb";
import { toDbFormat, toNormalFormat } from "../mongo-utils";

const moduleError = new AppError("Categories Collection", "");

export async function createCategory(category: Category) {
  if (!category?.name)
    throw moduleError.set("Empty Category can not be created.", 400);

  try {
    const { categories } = await getCollections();

    const result: InsertOneResult = await categories.insertOne(
      toDbFormat(category, true),
    );

    if (!result.insertedId) {
      throw moduleError.set("Failed to create Category", 500);
    }

    return toNormalFormat({ ...category, _id: result.insertedId });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function updateCategory(name: string, updates: Partial<Category>) {
  if (!name)
    throw moduleError.set("Empty Category name, can not be updated.", 400);
  try {
    const { categories } = await getCollections();
    const result: UpdateResult = await categories.updateOne(
      { name },
      { $set: updates },
    );

    if (result.modifiedCount === 0) {
      throw moduleError.set("Failed to update Category", 500);
    }

    return toNormalFormat({ name });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function deleteCategory(name: string) {
  if (!name)
    throw moduleError.set("Empty Category name, can not be deleted.", 400);
  try {
    const { categories } = await getCollections();
    const result = await categories.deleteOne({ name });

    if (result.deletedCount === 0) {
      throw moduleError.set("Failed to delete Category", 404);
    }

    return toNormalFormat({ name });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findCategory(name: string, label?: string) {
  if (!name) throw moduleError.set("Empty Category name", 400);

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
      throw moduleError.set("Category not found", 404);
    }

    return toNormalFormat(category);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findCategoryByLabel(label: string) {
  if (!label) throw moduleError.set("Empty Category label", 400);

  try {
    const { categories } = await getCollections();
    const category = await categories.findOne({
      label: { $regex: `^${label}`, $options: "i" },
    });

    if (!category) {
      throw moduleError.set("Category not found", 404);
    }

    return toNormalFormat(category);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findCategories(names?: string[]) {
  try {
    const { categories } = await getCollections();
    let filter = {};
    if (names?.length) {
      filter = { name: { $in: names } };
    }

    const result = await categories.find<Category>(filter).toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function createCategories(categoriesArray: Category[]) {
  if (!categoriesArray || categoriesArray.length === 0)
    throw moduleError.set("Empty categories array can not be created.", 400);

  try {
    const { categories } = await getCollections();

    const result = await categories.insertMany(categoriesArray, {
      ordered: false,
    });

    if (!result.insertedIds || result.insertedCount === 0) {
      throw moduleError.set("Failed to create categories", 500);
    }

    return toNormalFormat({
      insertedCount: result.insertedCount,
      insertedIds: Object.values(result.insertedIds),
    });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}
