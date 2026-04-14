import { IndexDescription } from "mongodb";

export const ApiKeyIndexes: IndexDescription[] = [
  { key: { key: 1 }, name: "idx_apikey_unique", unique: true },
  { key: { tenantId: 1 }, name: "idx_apikey_tenant" },
  { key: { isActive: 1 }, name: "idx_apikey_status" },
];
