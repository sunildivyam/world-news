/* eslint-disable @typescript-eslint/no-explicit-any */
import { Headline } from "../../types";
import { getCollections } from "../collections";
import { InsertOneResult, UpdateResult } from "mongodb";
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

export async function updateHeadline(slug: string, updates: Partial<Headline>) {
  if (!slug) return error("Empty Headline slug, can not be updated.");
  try {
    const { headlines } = await getCollections();
    const result: UpdateResult = await headlines.updateOne(
      { slug },
      { $set: updates },
    );

    if (result.modifiedCount === 0) {
      return error("Failed to update Headline", 500);
    }

    return success({ slug });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function deleteHeadline(slug: string) {
  if (!slug) return error("Empty Headline slug, can not be deleted.");
  try {
    const { headlines } = await getCollections();
    const result = await headlines.deleteOne({ slug });

    if (result.deletedCount === 0) {
      return error("Failed to delete Headline", 404);
    }

    return success({ slug });
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
