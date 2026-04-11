import { IndexDescription } from "mongodb";

export const LanguageIndexes: IndexDescription[] = [
  { key: { code: 1 }, name: "idx_lang_code_unique", unique: true },
  { key: { name: 1 }, name: "idx_lang_name" },
  { key: { code2: 1 }, name: "idx_lang_code2", sparse: true }, // sparse because code2 is optional
];
