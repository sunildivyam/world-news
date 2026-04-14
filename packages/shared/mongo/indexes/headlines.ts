import { IndexDescription } from "mongodb";

export const HeadlineIndexes: IndexDescription[] = [
  // SEO and Identification
  { key: { slug: 1 }, name: "idx_hdl_slug_unique", unique: true },
  { key: { url: 1 }, name: "idx_hdl_url_unique", unique: true },

  // Foreign Key Lookups (Reference fields)
  { key: { tenantId: 1 }, name: "idx_hdl_tenant" },
  { key: { sourceId: 1 }, name: "idx_hdl_source" },
  { key: { contentGeneratedAt: 1 }, name: "idx_hdl_content_generated_at" },

  // Compound Index for the Main Feed:
  // Filtering by tenant + language while sorting by date
  {
    key: { tenantId: 1, "geo.country": 1, language: 1, publishedAt: -1 },
    name: "idx_hdl_feed_optimized",
  },

  // Geo-spatial filtering
  { key: { "geo.country": 1, "geo.region": 1 }, name: "idx_hdl_geo_location" },

  // Taxonomy Multikey indexes
  { key: { tags: 1 }, name: "idx_hdl_tags" },
  { key: { keywords: 1 }, name: "idx_hdl_keywords" },

  // Text Search for the Search Bar
  {
    key: { title: "text", description: "text" },
    name: "idx_hdl_search_text",
    weights: { title: 10, description: 5 },
    language_override: "dummy_field", // Tells Mongo to ignore the 'language' array
  },
];
