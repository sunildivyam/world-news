/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError, NewsEvent } from "../../types";
import { getCollections } from "../collections";
import { InsertOneResult, UpdateResult } from "mongodb";
import { toDbFormat, toNormalFormat } from "../mongo-utils";

const moduleError = new AppError("NewsEvents Collection", "");

export async function createNewsEvent(newsEvent: NewsEvent) {
  if (!newsEvent?.name)
    throw moduleError.set("Empty NewsEvent can not be created.", 400);

  try {
    const { newsEvents } = await getCollections();

    const result: InsertOneResult = await newsEvents.insertOne(
      toDbFormat(newsEvent, true),
    );

    if (!result.insertedId) {
      throw moduleError.set("Failed to create NewsEvent", 500);
    }

    return toNormalFormat({ ...newsEvent, _id: result.insertedId });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function updateNewsEvent(
  name: string,
  updates: Partial<NewsEvent>,
) {
  if (!name)
    throw moduleError.set("Empty NewsEvent name, can not be updated.", 400);
  try {
    const { newsEvents } = await getCollections();
    const result: UpdateResult = await newsEvents.updateOne(
      { name },
      { $set: toDbFormat(updates, true) },
    );

    if (result.modifiedCount === 0) {
      throw moduleError.set("Failed to update NewsEvent", 500);
    }

    return toNormalFormat({ name });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function deleteNewsEvent(name: string) {
  if (!name)
    throw moduleError.set("Empty NewsEvent name, can not be deleted.", 400);
  try {
    const { newsEvents } = await getCollections();
    const result = await newsEvents.deleteOne({ name });

    if (result.deletedCount === 0) {
      throw moduleError.set("Failed to delete NewsEvent", 404);
    }

    return toNormalFormat({ name });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findNewsEvent(name: string, label?: string) {
  if (!name) throw moduleError.set("Empty NewsEvent name", 400);

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
      throw moduleError.set("NewsEvent not found", 404);
    }

    return toNormalFormat(newsEvent);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findNewsEventByLabel(label: string) {
  if (!label) throw moduleError.set("Empty NewsEvent label", 400);

  try {
    const { newsEvents } = await getCollections();
    const newsEvent = await newsEvents.findOne({
      label: { $regex: `^${label}`, $options: "i" },
    });

    if (!newsEvent) {
      throw moduleError.set("NewsEvent not found", 404);
    }

    return toNormalFormat(newsEvent);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findNewsEvents() {
  try {
    const { newsEvents } = await getCollections();
    const result = await newsEvents.find<NewsEvent>({}).toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function createNewsEvents(newsEvents: NewsEvent[]) {
  if (!newsEvents?.length)
    throw moduleError.set("Empty newsEvents array can not be created.", 400);

  try {
    const { newsEvents: collection } = await getCollections();

    const result = await collection.insertMany(toDbFormat(newsEvents, true), {
      ordered: false,
    });

    if (!result.insertedCount) {
      throw moduleError.set("Failed to create newsEvents", 500);
    }

    return toNormalFormat(
      newsEvents.map((newsEvent, index) => ({
        ...newsEvent,
        _id: result.insertedIds[index],
      })),
    );
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}
