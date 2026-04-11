/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError, Headline } from "../../types";
import { getCollections } from "../collections";
import { InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { toDbFormat, toNormalFormat } from "../mongo-utils";

const moduleError = new AppError("Headlines Collection", "");

export async function createHeadline(headline: Headline) {
  if (!headline?.slug)
    throw moduleError.set("Empty Headline slug can not be created.", 400);

  try {
    const { headlines } = await getCollections();

    const result: InsertOneResult = await headlines.insertOne(
      toDbFormat(headline, true),
    );

    if (!result.insertedId) {
      throw moduleError.set("Failed to create Headline", 500);
    }

    return toNormalFormat({ ...headline, _id: result.insertedId.toString() });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function updateHeadline(id: string, updates: Partial<Headline>) {
  // 1. Check if ID exists and is structurally valid for MongoDB
  if (!id || !ObjectId.isValid(id)) {
    throw moduleError.set("Invalid or missing Headline ID.", 400);
  }

  try {
    const { headlines } = await getCollections();

    // 2. Clean the updates object
    const { _id, ...finalUpdates } = updates as any;

    // 3. Prevent 400 error if there's nothing to update
    if (Object.keys(finalUpdates).length === 0) {
      return toNormalFormat({ id, note: "Nothing to update" });
    }

    const result: UpdateResult = await headlines.updateOne(
      { _id: new ObjectId(id) },
      { $set: finalUpdates },
    );

    if (result.matchedCount === 0) {
      throw moduleError.set("Headline not found", 404);
    }

    return toNormalFormat({ _id: id });
  } catch (err: any) {
    console.log(err?.message);
    // This will catch the "Argument passed in must be a string of 12 bytes..." error
    throw moduleError.set(err?.message || "Database update failed", 400);
  }
}

export async function deleteHeadline(id: string) {
  if (!id) throw moduleError.set("Empty Headline id, can not be deleted.", 400);
  try {
    const { headlines } = await getCollections();
    const result = await headlines.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw moduleError.set("Failed to delete Headline", 404);
    }

    return toNormalFormat({ _id: id });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findHeadline(slug: string, title?: string) {
  if (!slug) throw moduleError.set("Empty Headline slug", 400);

  try {
    const { headlines } = await getCollections();
    const q = title
      ? {
          $or: [
            { slug: slug.toLowerCase() },
            { title: { $regex: `^${title}`, $options: "i" } },
          ],
        }
      : { slug };

    const headline = await headlines.findOne(q);

    if (!headline) {
      throw moduleError.set("Headline not found", 404);
    }

    return toNormalFormat(headline);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findHeadlineByTitle(title: string) {
  if (!title) throw moduleError.set("Empty Headline title", 400);

  try {
    const { headlines } = await getCollections();
    const headline = await headlines.findOne({
      title: { $regex: `^${title}`, $options: "i" },
    });

    if (!headline) {
      throw moduleError.set("Headline not found", 404);
    }

    return toNormalFormat(headline);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findHeadlines(limit?: number) {
  try {
    const { headlines } = await getCollections();
    const query = headlines.find<Headline>({});
    if (limit) {
      query.limit(limit);
    }
    const result = await query.toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findHeadlinesByTenant(tenantId: string, limit?: number) {
  if (!tenantId)
    throw moduleError.set("TenantId is required to find headlines.", 400);
  try {
    const { headlines } = await getCollections();
    const query = headlines.find<Headline>({ tenantId });
    if (limit) {
      query.limit(limit);
    }
    const result = await query.toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}
export async function findHeadlinesByContentGenerated(
  contentGeneratedAt: Date | string | null,
  limit?: number,
) {
  try {
    const { headlines } = await getCollections();
    const query = headlines.find<Headline>({
      $or: [
        { contentGeneratedAt: { $exists: false } },
        { contentGeneratedAt: null },
      ],
    });
    if (limit) {
      query.limit(limit);
    }
    const result = await query.toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}
export async function findHeadlinesByCategory(
  category: string,
  limit?: number,
) {
  if (!category)
    throw moduleError.set("Category is required to find headlines.", 400);
  try {
    const { headlines } = await getCollections();
    const query = headlines.find<Headline>({ category });
    if (limit) {
      query.limit(limit);
    }
    const result = await query.toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findHeadlinesBySource(sourceId: string, limit?: number) {
  if (!sourceId)
    throw moduleError.set("SourceId is required to find headlines.", 400);
  try {
    const { headlines } = await getCollections();
    const query = headlines.find<Headline>({ sourceId });
    if (limit) {
      query.limit(limit);
    }
    const result = await query.toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findHeadlinesByProvider(
  providerName: string,
  limit?: number,
) {
  if (!providerName)
    throw moduleError.set("ProviderName is required to find headlines.", 400);
  try {
    const { headlines } = await getCollections();
    const query = headlines.find<Headline>({ providerName });
    if (limit) {
      query.limit(limit);
    }
    const result = await query.toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findHeadlinesByCountryAndCategory(
  countries: string[],
  categories: string[],
  limit?: number,
) {
  try {
    const { headlines } = await getCollections();
    const query: any = {};

    if (countries.length > 0 && categories.length > 0) {
      query.$and = [
        { "geo.country": { $in: countries } },
        { category: { $in: categories } },
      ];
    } else if (countries.length > 0) {
      query["geo.country"] = { $in: countries };
    } else if (categories.length > 0) {
      query.category = { $in: categories };
    }

    const mongoQuery = headlines.find<Headline>(query);
    if (limit) {
      mongoQuery.limit(limit);
    }
    const result = await mongoQuery.toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function createHeadlines(headlinesArray: Headline[]) {
  if (!headlinesArray || headlinesArray.length === 0)
    throw moduleError.set("Empty headlines array can not be created.", 400);

  try {
    const { headlines } = await getCollections();

    const result = await headlines.insertMany(headlinesArray);

    if (!result.insertedIds || result.insertedCount === 0) {
      throw moduleError.set("Failed to create headlines", 500);
    }

    return toNormalFormat({
      insertedCount: result.insertedCount,
      insertedIds: Object.values(result.insertedIds),
    });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}
