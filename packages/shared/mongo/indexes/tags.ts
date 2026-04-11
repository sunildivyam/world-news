import { IndexDescription } from "mongodb";

export const TagIndexes: IndexDescription[] = [
  // Names are usually unique (e.g., "politics", "tech")
  { key: { name: 1 }, name: "idx_tag_name_unique", unique: true },

  // Label lookup for UI display
  { key: { label: 1 }, name: "idx_tag_label" },

  // Sort by newest tags
  { key: { createdAt: -1 }, name: "idx_tag_created" },
];
