/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError, ArticleSource } from "../../types";
import { getCollections } from "../collections";
import { InsertOneResult, UpdateResult } from "mongodb";
import { toDbFormat, toNormalFormat } from "../mongo-utils";

const moduleError = new AppError("ArticleSources Collection", "");

export async function createArticleSource(articleSource: ArticleSource) {
  if (!articleSource?.slug)
    throw moduleError.set("Empty ArticleSource slug can not be created.", 400);

  try {
    const { articleSources } = await getCollections();

    const result: InsertOneResult = await articleSources.insertOne(
      toDbFormat(articleSource, true),
    );

    if (!result.insertedId) {
      throw moduleError.set("Failed to create ArticleSource", 500);
    }

    return toNormalFormat({ ...articleSource, _id: result.insertedId });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function updateArticleSource(
  slug: string,
  updates: Partial<ArticleSource>,
) {
  if (!slug)
    throw moduleError.set("Empty ArticleSource slug, can not be updated.", 400);
  try {
    const { articleSources } = await getCollections();
    const result: UpdateResult = await articleSources.updateOne(
      { slug },
      { $set: updates },
    );

    if (result.modifiedCount === 0) {
      throw moduleError.set("Failed to update ArticleSource", 500);
    }

    return toNormalFormat({ slug });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function deleteArticleSource(slug: string) {
  if (!slug)
    throw moduleError.set("Empty ArticleSource slug, can not be deleted.", 400);
  try {
    const { articleSources } = await getCollections();
    const result = await articleSources.deleteOne({ slug });

    if (result.deletedCount === 0) {
      throw moduleError.set("Failed to delete ArticleSource", 404);
    }

    return toNormalFormat({ slug });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findArticleSource(slug: string, name?: string) {
  if (!slug) throw moduleError.set("Empty ArticleSource slug", 400);

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
      throw moduleError.set("ArticleSource not found", 404);
    }

    return toNormalFormat(articleSource);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findArticleSourceByName(name: string) {
  if (!name) throw moduleError.set("Empty ArticleSource name", 400);

  try {
    const { articleSources } = await getCollections();
    const articleSource = await articleSources.findOne({
      name: { $regex: `^${name}`, $options: "i" },
    });

    if (!articleSource) {
      throw moduleError.set("ArticleSource not found", 404);
    }

    return toNormalFormat(articleSource);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findArticleSources() {
  try {
    const { articleSources } = await getCollections();
    const result = await articleSources.find<ArticleSource>({}).toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function createArticleSources(articleSources: ArticleSource[]) {
  if (!articleSources?.length)
    throw moduleError.set(
      "Empty ArticleSources array can not be created.",
      400,
    );

  try {
    const { articleSources: collection } = await getCollections();

    const result = await collection.insertMany(articleSources);

    if (!result.insertedCount) {
      throw moduleError.set("Failed to create ArticleSources", 500);
    }

    return toNormalFormat(
      articleSources.map((source, index) => ({
        ...source,
        _id: result.insertedIds[index],
      })),
    );
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}
