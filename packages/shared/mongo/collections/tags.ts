/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tag } from "../../types";
import { getCollections } from "../collections";
import { InsertOneResult, UpdateResult } from "mongodb";
import { error, success } from "../response";

export async function createTag(tag: Tag) {
  if (!tag?.name) return error("Empty Tag can not be created.");

  try {
    const { tags } = await getCollections();

    const result: InsertOneResult = await tags.insertOne(tag);

    if (!result.insertedId) {
      return error("Failed to create Tag");
    }

    return success({ ...tag, id: result.insertedId });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function updateTag(name: string, updates: Partial<Tag>) {
  if (!name) return error("Empty Tag name, can not be updated.");
  try {
    const { tags } = await getCollections();
    const result: UpdateResult = await tags.updateOne(
      { name },
      { $set: updates },
    );

    if (result.modifiedCount === 0) {
      return error("Failed to update Tag", 500);
    }

    return success({ name });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function deleteTag(name: string) {
  if (!name) return error("Empty Tag name, can not be deleted.");
  try {
    const { tags } = await getCollections();
    const result = await tags.deleteOne({ name });

    if (result.deletedCount === 0) {
      return error("Failed to delete Tag", 404);
    }

    return success({ name });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findTag(name: string, label?: string) {
  if (!name) return error("Empty Tag name");

  try {
    const { tags } = await getCollections();
    const q = label
      ? {
          $or: [
            { name: name.toLowerCase() },
            { label: { $regex: `^${label}`, $options: "i" } },
          ],
        }
      : { name };

    const tag = await tags.findOne(q);

    if (!tag) {
      return error("Tag not found", 404);
    }

    return success(tag);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findTagByLabel(label: string) {
  if (!label) return error("Empty Tag label");

  try {
    const { tags } = await getCollections();
    const tag = await tags.findOne({
      label: { $regex: `^${label}`, $options: "i" },
    });

    if (!tag) {
      return error("Tag not found", 404);
    }

    return success(tag);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findTags() {
  try {
    const { tags } = await getCollections();
    const result = await tags.find<Tag>({}).toArray();

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
