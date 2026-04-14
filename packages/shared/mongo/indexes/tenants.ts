import { IndexDescription } from "mongodb";

export const TenantIndexes: IndexDescription[] = [
  // Primary unique identifier
  { key: { tenantId: 1 }, name: "idx_tenant_id_unique", unique: true },

  // Domain lookups (for multi-tenant routing)
  { key: { domain: 1 }, name: "idx_tenant_domain", sparse: true, unique: true },
  { key: { subdomain: 1 }, name: "idx_tenant_subdomain", sparse: true },

  // Filtering by status and location
  {
    key: { isActive: 1, primaryCountry: 1 },
    name: "idx_tenant_status_country",
  },

  // Text search for admin panels
  {
    key: { name: "text", description: "text" },
    name: "idx_tenant_search",
    language_override: "dummy_field", // Tells Mongo to ignore the 'language' array
  },
];
