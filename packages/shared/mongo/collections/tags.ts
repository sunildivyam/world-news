/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError, Tag } from "../../types";
import { getCollections } from "../collections";
import { InsertOneResult, UpdateResult } from "mongodb";
import { toDbFormat, toNormalFormat } from "../mongo-utils";

const moduleError = new AppError("Tags Collection", "");

export async function createTag(tag: Tag) {
  if (!tag?.name) throw moduleError.set("Empty Tag can not be created.", 400);

  try {
    const { tags } = await getCollections();

    const result: InsertOneResult = await tags.insertOne(toDbFormat(tag, true));

    if (!result.insertedId) {
      throw moduleError.set("Failed to create Tag", 500);
    }

    return toNormalFormat({ ...tag, _id: result.insertedId });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function updateTag(name: string, updates: Partial<Tag>) {
  if (!name) throw moduleError.set("Empty Tag name, can not be updated.", 400);
  try {
    const { tags } = await getCollections();
    const result: UpdateResult = await tags.updateOne(
      { name },
      { $set: toDbFormat(updates, true) },
    );

    if (result.modifiedCount === 0) {
      throw moduleError.set("Failed to update Tag", 500);
    }

    return toNormalFormat({ name });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function deleteTag(name: string) {
  if (!name) throw moduleError.set("Empty Tag name, can not be deleted.", 400);
  try {
    const { tags } = await getCollections();
    const result = await tags.deleteOne({ name });

    if (result.deletedCount === 0) {
      throw moduleError.set("Failed to delete Tag", 404);
    }

    return toNormalFormat({ name });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findTag(name: string, label?: string) {
  if (!name) throw moduleError.set("Empty Tag name", 400);

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
      throw moduleError.set("Tag not found", 404);
    }

    return toNormalFormat(tag);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findTagByLabel(label: string) {
  if (!label) throw moduleError.set("Empty Tag label", 400);

  try {
    const { tags } = await getCollections();
    const tag = await tags.findOne({
      label: { $regex: `^${label}`, $options: "i" },
    });

    if (!tag) {
      throw moduleError.set("Tag not found", 404);
    }

    return toNormalFormat(tag);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findTags() {
  try {
    const { tags } = await getCollections();
    const result = await tags.find<Tag>({}).toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function createTags(tags: Tag[]) {
  if (!tags?.length)
    throw moduleError.set("Empty tags array can not be created.", 400);

  try {
    const { tags: collection } = await getCollections();

    const result = await collection.insertMany(toDbFormat(tags, true), {
      ordered: false,
    });

    if (!result.insertedCount) {
      throw moduleError.set("Failed to create tags", 500);
    }

    return toNormalFormat(
      tags.map((tag, index) => ({
        ...tag,
        _id: result.insertedIds[index],
      })),
    );
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}
