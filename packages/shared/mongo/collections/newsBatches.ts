/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError, NewsBatch } from "../../types";
import { toDbFormat, toNormalFormat } from "../mongo-utils";
import { getCollections } from "../collections";
import { InsertOneResult, ObjectId } from "mongodb";

const moduleError = new AppError("NewsBatches Collection", "");

export async function createNewsBatch(newsBatch: NewsBatch) {
  if (!newsBatch?.tenants?.length)
    throw moduleError.set("Can not create an empty news batch", 400);

  try {
    const { newsBatches } = await getCollections();

    const result: InsertOneResult = await newsBatches.insertOne(
      toDbFormat(newsBatch, true),
    );

    if (!result.insertedId) {
      throw moduleError.set("Failed to create news batch", 500);
    }

    return toNormalFormat({ ...newsBatch, id: result.insertedId });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function getActiveNewsBatches() {
  try {
    const { newsBatches } = await getCollections();
    const result = await newsBatches

      .find({ $or: [{ finishedAt: { $exists: false } }, { finishedAt: null }] })
      .sort({ startedAt: -1 })
      .toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function getAllNewsBatches() {
  try {
    const { newsBatches } = await getCollections();
    const result = await newsBatches.find({}).toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function updateNewsBatch(
  id: string,
  newsBatch: Partial<NewsBatch>,
) {
  try {
    const { newsBatches } = await getCollections();
    const result = await newsBatches.updateOne(
      { _id: new ObjectId(id) },
      { $set: newsBatch },
    );

    if (result.matchedCount === 0) {
      throw moduleError.set("News batch not found", 404);
    }

    return toNormalFormat({ _id: id });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function deleteNewsBatch(id: string) {
  try {
    const { newsBatches } = await getCollections();
    const result = await newsBatches.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw moduleError.set("News batch not found", 404);
    }

    return toNormalFormat({ _id: id });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findNewsBatch(id: string) {
  try {
    const { newsBatches } = await getCollections();

    const newsBatch = await newsBatches.findOne({ _id: new ObjectId(id) });

    if (!newsBatch) {
      throw moduleError.set("News batch not found", 404);
    }

    return toNormalFormat(newsBatch);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function createNewsBatches(newsBatches: NewsBatch[]) {
  if (!newsBatches?.length)
    throw moduleError.set("Empty news batches array can not be created.", 400);

  try {
    const { newsBatches: collection } = await getCollections();

    const result = await collection.insertMany(newsBatches);

    if (!result.insertedCount) {
      throw moduleError.set("Failed to create news batches", 500);
    }

    return toNormalFormat(
      newsBatches.map((newsBatch, index) => ({
        ...newsBatch,
        _id: result.insertedIds[index],
      })),
    );
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}
