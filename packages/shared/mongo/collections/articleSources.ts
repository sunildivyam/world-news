/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArticleSource } from "../../types";
import { getCollections } from "../collections";
import { InsertOneResult, UpdateResult } from "mongodb";
import { error, success } from "../response";

export async function createArticleSource(articleSource: ArticleSource) {
  if (!articleSource?.slug)
    return error("Empty ArticleSource slug can not be created.");

  try {
    const { articleSources } = await getCollections();

    const result: InsertOneResult =
      await articleSources.insertOne(articleSource);

    if (!result.insertedId) {
      return error("Failed to create ArticleSource");
    }

    return success({ ...articleSource, id: result.insertedId });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function updateArticleSource(
  slug: string,
  updates: Partial<ArticleSource>,
) {
  if (!slug) return error("Empty ArticleSource slug, can not be updated.");
  try {
    const { articleSources } = await getCollections();
    const result: UpdateResult = await articleSources.updateOne(
      { slug },
      { $set: updates },
    );

    if (result.modifiedCount === 0) {
      return error("Failed to update ArticleSource", 500);
    }

    return success({ slug });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function deleteArticleSource(slug: string) {
  if (!slug) return error("Empty ArticleSource slug, can not be deleted.");
  try {
    const { articleSources } = await getCollections();
    const result = await articleSources.deleteOne({ slug });

    if (result.deletedCount === 0) {
      return error("Failed to delete ArticleSource", 404);
    }

    return success({ slug });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findArticleSource(slug: string, name?: string) {
  if (!slug) return error("Empty ArticleSource slug");

  try {
    const { articleSources } = await getCollections();
    const q = name
      ? {
          $or: [
            { slug: slug.toLowerCase() },
            { name: { $regex: `^${name}`, $options: "i" } },
          ],
        }
      : { slug };

    const articleSource = await articleSources.findOne(q);

    if (!articleSource) {
      return error("ArticleSource not found", 404);
    }

    return success(articleSource);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findArticleSourceByName(name: string) {
  if (!name) return error("Empty ArticleSource name");

  try {
    const { articleSources } = await getCollections();
    const articleSource = await articleSources.findOne({
      name: { $regex: `^${name}`, $options: "i" },
    });

    if (!articleSource) {
      return error("ArticleSource not found", 404);
    }

    return success(articleSource);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findArticleSources() {
  try {
    const { articleSources } = await getCollections();
    const result = await articleSources.find<ArticleSource>({}).toArray();

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function createArticleSources(articleSources: ArticleSource[]) {
  if (!articleSources?.length)
    return error("Empty ArticleSources array can not be created.");

  try {
    const { articleSources: collection } = await getCollections();

    const result = await collection.insertMany(articleSources);

    if (!result.insertedCount) {
      return error("Failed to create ArticleSources");
    }

    return success(
      articleSources.map((source, index) => ({
        ...source,
        id: result.insertedIds[index],
      })),
    );
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
