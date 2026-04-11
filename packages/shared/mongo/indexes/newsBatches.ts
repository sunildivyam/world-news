import { IndexDescription } from "mongodb";

export const NewsBatchIndexes: IndexDescription[] = [
  // Multi-tenant and multi-country filtering
  { key: { tenants: 1 }, name: "idx_batch_tenants" },
  { key: { country: 1 }, name: "idx_batch_countries" },

  // Status and Timeline tracking
  { key: { scheduledAt: -1 }, name: "idx_batch_scheduled" },

  // Compound index for finding active/running batches
  {
    key: { startedAt: 1, finishedAt: 1 },
    name: "idx_batch_active_lookup",
  },
];
