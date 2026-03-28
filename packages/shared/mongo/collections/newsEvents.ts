/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewsEvent } from "../../types";
import { getCollections } from "../collections";
import { InsertOneResult, UpdateResult } from "mongodb";
import { error, success } from "../response";

export async function createNewsEvent(newsEvent: NewsEvent) {
  if (!newsEvent?.name) return error("Empty NewsEvent can not be created.");

  try {
    const { newsEvents } = await getCollections();

    const result: InsertOneResult = await newsEvents.insertOne(newsEvent);

    if (!result.insertedId) {
      return error("Failed to create NewsEvent");
    }

    return success({ ...newsEvent, id: result.insertedId });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function updateNewsEvent(
  name: string,
  updates: Partial<NewsEvent>,
) {
  if (!name) return error("Empty NewsEvent name, can not be updated.");
  try {
    const { newsEvents } = await getCollections();
    const result: UpdateResult = await newsEvents.updateOne(
      { name },
      { $set: updates },
    );

    if (result.modifiedCount === 0) {
      return error("Failed to update NewsEvent", 500);
    }

    return success({ name });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function deleteNewsEvent(name: string) {
  if (!name) return error("Empty NewsEvent name, can not be deleted.");
  try {
    const { newsEvents } = await getCollections();
    const result = await newsEvents.deleteOne({ name });

    if (result.deletedCount === 0) {
      return error("Failed to delete NewsEvent", 404);
    }

    return success({ name });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findNewsEvent(name: string, label?: string) {
  if (!name) return error("Empty NewsEvent name");

  try {
    const { newsEvents } = await getCollections();
    const q = label
      ? {
          $or: [
            { name: name.toLowerCase() },
            { label: { $regex: `^${label}`, $options: "i" } },
          ],
        }
      : { name };

    const newsEvent = await newsEvents.findOne(q);

    if (!newsEvent) {
      return error("NewsEvent not found", 404);
    }

    return success(newsEvent);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findNewsEventByLabel(label: string) {
  if (!label) return error("Empty NewsEvent label");

  try {
    const { newsEvents } = await getCollections();
    const newsEvent = await newsEvents.findOne({
      label: { $regex: `^${label}`, $options: "i" },
    });

    if (!newsEvent) {
      return error("NewsEvent not found", 404);
    }

    return success(newsEvent);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findNewsEvents() {
  try {
    const { newsEvents } = await getCollections();
    const result = await newsEvents.find<NewsEvent>({}).toArray();

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function createNewsEvents(newsEvents: NewsEvent[]) {
  if (!newsEvents?.length)
    return error("Empty newsEvents array can not be created.");

  try {
    const { newsEvents: collection } = await getCollections();

    const result = await collection.insertMany(newsEvents);

    if (!result.insertedCount) {
      return error("Failed to create newsEvents");
    }

    return success(
      newsEvents.map((newsEvent, index) => ({
        ...newsEvent,
        id: result.insertedIds[index],
      })),
    );
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
