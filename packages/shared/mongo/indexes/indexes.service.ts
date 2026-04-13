/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "../../types";
import { getCollections } from "../collections";
import { ApiKeyIndexes } from "./apiKeys";
import { ArticleIndexes } from "./articles";
import { TenantIndexes } from "./tenants";
import { CategoryIndexes } from "./categories";
import { ArticleSourceIndexes } from "./articleSources";
import { countryIndexConfig } from "./countries";
import { LanguageIndexes } from "./languages";
import { NewsBatchIndexes } from "./newsBatches";
import { NewsEventIndexes } from "./newsEvents";
import { TagIndexes } from "./tags";
import { HeadlineIndexes } from "./headlines";
// ... import other index configs here

// 1. Map collection names to their exported IndexDescription arrays
const IndexRegistry: Record<string, any[]> = {
  apiKeys: ApiKeyIndexes,
  articles: ArticleIndexes,
  articleSources: ArticleSourceIndexes,
  categories: CategoryIndexes,
  countries: countryIndexConfig,
  languages: LanguageIndexes,
  newsBatches: NewsBatchIndexes,
  newsEvents: NewsEventIndexes,
  tags: TagIndexes,
  tenants: TenantIndexes,
  headlines: HeadlineIndexes,
  // Add other mappings as you create files
};

interface ListIndexesResponse {
  success: Record<string, any[]>;
  failed: Record<string, AppError>;
}

export async function createIndexes(collectionNames?: string[]) {
  const result: ListIndexesResponse = {
    success: {},
    failed: {},
  };
  const collections: any = await getCollections();

  // 2. Determine which collections to process
  const targets = collectionNames?.length
    ? collectionNames
    : Object.keys(IndexRegistry);

  // 3. Execute index creation in parallel
  await Promise.all(
    targets.map(async (name) => {
      const collection: any = collections[name];
      const configs = IndexRegistry[name];

      if (!collection) {
        result.failed[name] = new AppError(
          "Create Indexes",
          "Collection not found in initialized database",
          404,
        );
      }

      if (!configs) {
        result.failed[name] = new AppError(
          "Create Indexes",
          "No Index Config to create",
          404,
        );
      }

      try {
        // createIndexes returns an array of the names of the created indexes
        const createdNames = await collection.createIndexes(configs);
        result.success[name] = createdNames;
      } catch (err: any) {
        result.failed[name] = new AppError(
          "Create Indexes",
          `Error fetching indexes: ${err?.message || ""}`,
          500,
        );
      }
    }),
  );

  return result;
}

export async function listIndexes(collectionNames?: string[]) {
  const collections: any = await getCollections();
  const result: ListIndexesResponse = {
    success: {},
    failed: {},
  };

  // 1. Determine which collections to target
  // If collectionNames is provided, use it; otherwise, take all keys from the collections object
  const targets = collectionNames?.length
    ? collectionNames
    : Object.keys(collections);

  // 2. Map through targets and fetch indexes
  await Promise.all(
    targets.map(async (name) => {
      const collection: any = collections[name];

      if (collection) {
        try {
          const indexes = await collection.listIndexes().toArray();
          result.success[name] = indexes;
        } catch (err: any) {
          result.failed[name] = new AppError(
            "List Indexes",
            `Error fetching indexes: ${err?.message || ""}`,
            500,
          );
        }
      } else {
        result.failed[name] = new AppError(
          "List Indexes",
          "Collection not found in initialized database",
          404,
        );
      }
    }),
  );

  return result;
}
