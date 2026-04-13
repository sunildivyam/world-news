import { IndexDescription } from "mongodb";

export const ArticleIndexes: IndexDescription[] = [
  // SEO and Identification
  { key: { slug: 1 }, name: "idx_art_slug_unique", unique: true },
  { key: { url: 1 }, name: "idx_art_url_unique", unique: true },

  // Foreign Key Lookups (Reference fields)
  { key: { tenantId: 1 }, name: "idx_art_tenant" },
  { key: { sourceId: 1 }, name: "idx_art_source" },
  { key: { headlineId: 1 }, name: "idx_art_headline", sparse: true },

  // Compound Index for the Main Feed:
  // Filtering by tenant + language while sorting by date
  {
    key: { tenantId: 1, "geo.country": 1, language: 1, publishedAt: -1 },
    name: "idx_art_feed_optimized",
  },

  // Geo-spatial filtering
  { key: { "geo.country": 1, "geo.region": 1 }, name: "idx_art_geo_location" },

  // Taxonomy Multikey indexes
  { key: { tags: 1 }, name: "idx_art_tags" },
  { key: { keywords: 1 }, name: "idx_art_keywords" },

  // Text Search for the Search Bar
  {
    key: { title: "text", description: "text" },
    name: "idx_art_search_text",
    weights: { title: 10, description: 5 },
  },
];
