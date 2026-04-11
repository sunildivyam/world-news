import { IndexDescription } from "mongodb";

const commonMetadataIndexes: IndexDescription[] = [
  { key: { name: 1 }, name: "idx_name_unique", unique: true },
  { key: { label: 1 }, name: "idx_label" },
  { key: { createdAt: -1 }, name: "idx_created_at" },
];

export const CategoryIndexes = commonMetadataIndexes;
