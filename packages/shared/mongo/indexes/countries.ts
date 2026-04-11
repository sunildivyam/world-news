import { IndexDescription } from "mongodb";

export const countriesIndexConfig: IndexDescription[] = [
  {
    // High-speed lookup for country codes (ISO)
    key: { code: 1 },
    name: "idx_unique_code",
    unique: true,
  },
  {
    // Standard index for alphabetical sorting and exact matching
    key: { name: 1 },
    name: "idx_name_sort",
  },
  {
    // Full-text search capability for the country name
    key: { name: "text" },
    name: "idx_name_text",
    default_language: "english",
  },
];
