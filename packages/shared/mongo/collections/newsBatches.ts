/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewsBatch } from "../../types";
import { error, success } from "../response";
import { getCollections } from "../collections";
import { InsertOneResult, ObjectId } from "mongodb";

export async function createNewsBatch(newsBatch: NewsBatch) {
  if (!newsBatch?.tenants?.length)
    return error("Can not create an empty news batch");

  try {
    const { newsBatches } = await getCollections();

    const result: InsertOneResult = await newsBatches.insertOne(newsBatch);

    if (!result.insertedId) {
      return error("Failed to create news batch", 500);
    }

    return success({ ...newsBatch, id: result.insertedId });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function getAllNewsBatches() {
  try {
    const { newsBatches } = await getCollections();
    const result = await newsBatches.find({}).toArray();

    // Transform _id to id for consistency
    const transformed = result.map((batch) => ({
      ...batch,
      id: batch._id,
      _id: undefined,
    }));

    return success(transformed);
  } catch (err: any) {
    return error(err?.message || err, 500);
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
      return error("News batch not found", 404);
    }

    return success({ id });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function deleteNewsBatch(id: string) {
  try {
    const { newsBatches } = await getCollections();
    const result = await newsBatches.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return error("News batch not found", 404);
    }

    return success({ id });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findNewsBatch(id: string) {
  try {
    const { newsBatches } = await getCollections();

    const newsBatch = await newsBatches.findOne({ _id: new ObjectId(id) });

    if (!newsBatch) {
      return error("News batch not found", 404);
    }

    // Transform _id to id for consistency
    const transformed = {
      ...newsBatch,
      id: newsBatch._id,
      _id: undefined,
    };

    return success(transformed);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function createNewsBatches(newsBatches: NewsBatch[]) {
  if (!newsBatches?.length)
    return error("Empty news batches array can not be created.");

  try {
    const { newsBatches: collection } = await getCollections();

    const result = await collection.insertMany(newsBatches);

    if (!result.insertedCount) {
      return error("Failed to create news batches");
    }

    return success(
      newsBatches.map((newsBatch, index) => ({
        ...newsBatch,
        id: result.insertedIds[index],
      })),
    );
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
