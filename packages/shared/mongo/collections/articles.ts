/* eslint-disable @typescript-eslint/no-explicit-any */
import { Article } from "../../types";
import { getCollections } from "../collections";
import { InsertOneResult, UpdateResult } from "mongodb";
import { error, success } from "../response";

export async function createArticle(article: Article) {
  if (!article?.slug) return error("Empty Article slug can not be created.");

  try {
    const { articles } = await getCollections();

    const result: InsertOneResult = await articles.insertOne(article);

    if (!result.insertedId) {
      return error("Failed to create Article");
    }

    return success({ ...article, id: result.insertedId });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function updateArticle(slug: string, updates: Partial<Article>) {
  if (!slug) return error("Empty Article slug, can not be updated.");
  try {
    const { articles } = await getCollections();
    const result: UpdateResult = await articles.updateOne(
      { slug },
      { $set: updates },
    );

    if (result.modifiedCount === 0) {
      return error("Failed to update Article", 500);
    }

    return success({ slug });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function deleteArticle(slug: string) {
  if (!slug) return error("Empty Article slug, can not be deleted.");
  try {
    const { articles } = await getCollections();
    const result = await articles.deleteOne({ slug });

    if (result.deletedCount === 0) {
      return error("Failed to delete Article", 404);
    }

    return success({ slug });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findArticle(slug: string, title?: string) {
  if (!slug) return error("Empty Article slug");

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
      return error("Article not found", 404);
    }

    return success(article);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findArticleByTitle(title: string) {
  if (!title) return error("Empty Article title");

  try {
    const { articles } = await getCollections();
    const article = await articles.findOne({
      title: { $regex: `^${title}`, $options: "i" },
    });

    if (!article) {
      return error("Article not found", 404);
    }

    return success(article);
  } catch (err: any) {
    return error(err?.message || err, 500);
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

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findArticlesByTenant(tenantId: string, limit?: number) {
  if (!tenantId) return error("TenantId is required to find articles.");
  try {
    const { articles } = await getCollections();
    const query = articles.find<Article>({ tenantId });
    if (limit) {
      query.limit(limit);
    }
    const result = await query.toArray();

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findArticlesByCategory(category: string, limit?: number) {
  if (!category) return error("Category is required to find articles.");
  try {
    const { articles } = await getCollections();
    const query = articles.find<Article>({ category });
    if (limit) {
      query.limit(limit);
    }
    const result = await query.toArray();

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findArticlesBySource(sourceId: string, limit?: number) {
  if (!sourceId) return error("SourceId is required to find articles.");
  try {
    const { articles } = await getCollections();
    const query = articles.find<Article>({ sourceId });
    if (limit) {
      query.limit(limit);
    }
    const result = await query.toArray();

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function createArticles(articlesArray: Article[]) {
  if (!articlesArray || articlesArray.length === 0)
    return error("Empty articles array can not be created.");

  try {
    const { articles } = await getCollections();

    const result = await articles.insertMany(articlesArray);

    if (!result.insertedIds || result.insertedCount === 0) {
      return error("Failed to create articles");
    }

    return success({
      insertedCount: result.insertedCount,
      insertedIds: Object.values(result.insertedIds),
    });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
