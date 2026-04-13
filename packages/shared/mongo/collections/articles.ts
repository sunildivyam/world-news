/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppError,
  type Article,
  type ArticleCollection,
  type LatestArticlesQueryParams,
} from "../../types";
import { getCollections } from "../collections";
import { InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { toDbFormat, toNormalFormat } from "../mongo-utils";

const moduleError = new AppError("Articles Collection", "");

export async function createArticle(article: Article) {
  if (!article?.slug)
    throw moduleError.set("Empty Article slug can not be created.", 400);

  try {
    const { articles } = await getCollections();

    const result: InsertOneResult = await articles.insertOne(
      toDbFormat(article, true),
    );

    if (!result.insertedId) {
      throw moduleError.set("Failed to create Article", 500);
    }

    return toNormalFormat({ ...article, _id: result.insertedId });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function updateArticle(slug: string, updates: Partial<Article>) {
  if (!slug)
    throw moduleError.set("Empty Article slug, can not be updated.", 400);
  try {
    const { articles } = await getCollections();
    const result: UpdateResult = await articles.updateOne(
      { slug },
      { $set: updates },
    );

    if (result.modifiedCount === 0) {
      throw moduleError.set("Failed to update Article", 500);
    }

    return toNormalFormat({ slug });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function deleteArticle(slug: string) {
  if (!slug)
    throw moduleError.set("Empty Article slug, can not be deleted.", 400);
  try {
    const { articles } = await getCollections();
    const result = await articles.deleteOne({ slug });

    if (result.deletedCount === 0) {
      throw moduleError.set("Failed to delete Article", 404);
    }

    return toNormalFormat({ slug });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findArticle(slug: string, title?: string) {
  if (!slug) throw moduleError.set("Empty Article slug", 400);

  try {
    const { articles } = await getCollections();
    const q = title
      ? {
          $or: [
            { slug: slug.toLowerCase() },
            { title: { $regex: `^${title}`, $options: "i" } },
          ],
        }
      : { slug };

    const article = await articles.findOne(q);

    if (!article) {
      throw moduleError.set("Article not found", 404);
    }

    return toNormalFormat(article);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findArticleById(id: string) {
  if (!id) throw moduleError.set("Empty Article id", 400);

  try {
    const { articles } = await getCollections();
    const q = { _id: new ObjectId(id) };

    const article = await articles.findOne(q);

    if (!article) {
      throw moduleError.set("Article not found", 404);
    }

    return toNormalFormat(article);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findArticleByTitle(title: string) {
  if (!title) throw moduleError.set("Empty Article title", 400);

  try {
    const { articles } = await getCollections();
    const article = await articles.findOne({
      title: { $regex: `^${title}`, $options: "i" },
    });

    if (!article) {
      throw moduleError.set("Article not found", 404);
    }

    return toNormalFormat(article);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findArticles(limit?: number) {
  try {
    const { articles } = await getCollections();
    const query = articles.find<Article>({});
    if (limit) {
      query.limit(limit);
    }
    const result = await query.toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findArticlesByTenant(tenantId: string, limit?: number) {
  if (!tenantId)
    throw moduleError.set("TenantId is required to find articles.", 400);
  try {
    const { articles } = await getCollections();
    const query = articles.find<Article>({ tenantId });
    if (limit) {
      query.limit(limit);
    }
    const result = await query.toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findArticlesByCategory(category: string, limit?: number) {
  if (!category)
    throw moduleError.set("Category is required to find articles.", 400);
  try {
    const { articles } = await getCollections();
    const query = articles.find<Article>({ category });
    if (limit) {
      query.limit(limit);
    }
    const result = await query.toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findArticlesBySource(sourceId: string, limit?: number) {
  if (!sourceId)
    throw moduleError.set("SourceId is required to find articles.", 400);
  try {
    const { articles } = await getCollections();
    const query = articles.find<Article>({ sourceId });
    if (limit) {
      query.limit(limit);
    }
    const result = await query.toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function createArticles(articlesArray: Article[]) {
  if (!articlesArray || articlesArray.length === 0)
    throw moduleError.set("Empty articles array can not be created.", 400);

  try {
    const { articles } = await getCollections();

    const result = await articles.insertMany(articlesArray, { ordered: false });

    if (!result.insertedIds || result.insertedCount === 0) {
      throw moduleError.set("Failed to create articles", 500);
    }

    return toNormalFormat({
      insertedCount: result.insertedCount,
      insertedIds: Object.values(result.insertedIds),
    });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findLatest(params?: LatestArticlesQueryParams) {
  const {
    id,
    slug,
    country,
    language,
    tenantId,
    keywords,
    tags,
    category,
    page,
    limit,
    fields,
    hours,
  } = params || {};

  try {
    const { articles } = await getCollections();

    if (id || slug) {
      const q = id
        ? { _id: new ObjectId(id) }
        : slug
          ? { slug: slug.toLowerCase() }
          : "";
      if (q) {
        const article = await articles.findOne(q);

        const response: ArticleCollection = {
          articles: article
            ? [toDbFormat({ ...article, _id: article._id })]
            : [],
          totalResults: 0,
          nextPage: 0,
        };

        return response;
      }
    } else {
      const filters = [] as any;

      // Updated to use dot notation for nested objects
      if (country) filters.push({ "geo.country": country.toLowerCase() });
      if (language) filters.push({ language: language.toLowerCase() });
      if (tenantId) filters.push({ tenantId: tenantId.toLowerCase() });
      if (category) filters.push({ category: category.toLowerCase() });
      if (keywords) filters.push({ keywords: { $in: keywords } });
      if (tags) filters.push({ tags: { $in: tags } });

      // if published hours are given
      if (hours) {
        const sincePublishedAt = new Date();
        sincePublishedAt.setTime(
          sincePublishedAt.getTime() - hours * 60 * 60 * 1000,
        );
        // Filter: publishedAt is Greater Than or Equal to n hours ago
        filters.push({ publishedAt: { $gte: sincePublishedAt.toISOString() } });
      } else {
        // mandatory filter for latest articles
        filters.push({ publishedAt: { $exists: true, $ne: null } });
      }

      // Only apply $and if there are actually filters,
      // otherwise find({}) returns everything.
      const q = filters.length > 0 ? { $and: filters } : {};

      const query = articles.find<Article>(q);
      query.sort("publishedAt", "desc");
      if (page) {
        query.skip((page - 1) * (limit || 10));
      }
      query.limit(limit || 10);

      // Include fields else include all fields
      if (fields?.length) {
        const projections: any = {};
        for (const field of fields) {
          projections[field] = 1;
        }
        // { code: 1, name: 1, languages: 1 }
        query.project(projections);
      }

      const result = await query.toArray();
      const response: ArticleCollection = {
        articles: result,
        totalResults: 0,
        nextPage: page ? page + 1 : 2,
      };

      return response;
    }
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}
