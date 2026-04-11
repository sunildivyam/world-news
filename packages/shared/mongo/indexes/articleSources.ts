import { IndexDescription } from "mongodb";

export const ArticleSourceIndexes: IndexDescription[] = [
  {
    key: { slug: 1 },
    name: "idx_source_slug_unique",
    unique: true,
    sparse: true,
  },
  { key: { name: 1 }, name: "idx_source_name" },
  // Multikey indexes for filtering sources by availability
  { key: { category: 1 }, name: "idx_source_categories" },
  { key: { language: 1 }, name: "idx_source_languages" },
  { key: { country: 1 }, name: "idx_source_countries" },
  // Ranking/Ordering
  { key: { priority: -1 }, name: "idx_source_priority" },
];
