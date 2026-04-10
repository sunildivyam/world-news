/* eslint-disable @typescript-eslint/no-explicit-any */
import { Headline } from "../../types";
import { getCollections } from "../collections";
import { InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { error, success } from "../response";

export async function createHeadline(headline: Headline) {
  if (!headline?.slug) return error("Empty Headline slug can not be created.");

  try {
    const { headlines } = await getCollections();

    const result: InsertOneResult = await headlines.insertOne(headline);

    if (!result.insertedId) {
      return error("Failed to create Headline");
    }

    return success({ ...headline, id: result.insertedId });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function updateHeadline(id: string, updates: Partial<Headline>) {
  // 1. Check if ID exists and is structurally valid for MongoDB
  if (!id || !ObjectId.isValid(id)) {
    return error("Invalid or missing Headline ID.", 400);
  }

  try {
    const { headlines } = await getCollections();

    // 2. Clean the updates object
    const { _id, ...finalUpdates } = updates as any;

    // 3. Prevent 400 error if there's nothing to update
    if (Object.keys(finalUpdates).length === 0) {
      return success({ id, note: "Nothing to update" });
    }

    const result: UpdateResult = await headlines.updateOne(
      { _id: new ObjectId(id) },
      { $set: finalUpdates },
    );

    if (result.matchedCount === 0) {
      return error("Headline not found", 404);
    }

    return success({ id });
  } catch (err: any) {
    console.log(err?.message);
    // This will catch the "Argument passed in must be a string of 12 bytes..." error
    return error(err?.message || "Database update failed", 400);
  }
}

export async function deleteHeadline(id: string) {
  if (!id) return error("Empty Headline id, can not be deleted.");
  try {
    const { headlines } = await getCollections();
    const result = await headlines.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return error("Failed to delete Headline", 404);
    }

    return success({ id });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findHeadline(slug: string, title?: string) {
  if (!slug) return error("Empty Headline slug");

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
      return error("Headline not found", 404);
    }

    return success(headline);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findHeadlineByTitle(title: string) {
  if (!title) return error("Empty Headline title");

  try {
    const { headlines } = await getCollections();
    const headline = await headlines.findOne({
      title: { $regex: `^${title}`, $options: "i" },
    });

    if (!headline) {
      return error("Headline not found", 404);
    }

    return success(headline);
  } catch (err: any) {
    return error(err?.message || err, 500);
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

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findHeadlinesByTenant(tenantId: string, limit?: number) {
  if (!tenantId) return error("TenantId is required to find headlines.");
  try {
    const { headlines } = await getCollections();
    const query = headlines.find<Headline>({ tenantId });
    if (limit) {
      query.limit(limit);
    }
    const result = await query.toArray();

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
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

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
export async function findHeadlinesByCategory(
  category: string,
  limit?: number,
) {
  if (!category) return error("Category is required to find headlines.");
  try {
    const { headlines } = await getCollections();
    const query = headlines.find<Headline>({ category });
    if (limit) {
      query.limit(limit);
    }
    const result = await query.toArray();

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findHeadlinesBySource(sourceId: string, limit?: number) {
  if (!sourceId) return error("SourceId is required to find headlines.");
  try {
    const { headlines } = await getCollections();
    const query = headlines.find<Headline>({ sourceId });
    if (limit) {
      query.limit(limit);
    }
    const result = await query.toArray();

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findHeadlinesByProvider(
  providerName: string,
  limit?: number,
) {
  if (!providerName)
    return error("ProviderName is required to find headlines.");
  try {
    const { headlines } = await getCollections();
    const query = headlines.find<Headline>({ providerName });
    if (limit) {
      query.limit(limit);
    }
    const result = await query.toArray();

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
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

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function createHeadlines(headlinesArray: Headline[]) {
  if (!headlinesArray || headlinesArray.length === 0)
    return error("Empty headlines array can not be created.");

  try {
    const { headlines } = await getCollections();

    const result = await headlines.insertMany(headlinesArray);

    if (!result.insertedIds || result.insertedCount === 0) {
      return error("Failed to create headlines");
    }

    return success({
      insertedCount: result.insertedCount,
      insertedIds: Object.values(result.insertedIds),
    });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
