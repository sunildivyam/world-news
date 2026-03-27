import { fetchTenant } from "@worldnews/shared/news-engine-apis";
import type { Tenant } from "@worldnews/shared/types";
import type { TenantContext } from "@worldnews/shared/types";
import type { TenantConfig } from "@worldnews/shared/types";

export async function populateContextFromTenant(
  tenant?: Tenant,
): Promise<TenantContext> {
  const ctx: TenantContext = {
    tenant: tenant,
    language: tenant?.primaryLanguage,
    geo: {
      country: tenant?.primaryCountry,
    },
  };

  return ctx;
}

export async function findTenantFromSegments(
  segments: Array<string>,
): Promise<TenantContext | null> {
  // 3️⃣ path-based tenant
  if (segments.length > 0) {
    const tenant = await fetchTenant(segments[0]);
    if (tenant) return await populateContextFromTenant(tenant);
  }

  return null;
}

export async function getTenantConfig(
  tenantId: string,
): Promise<TenantConfig | null> {
  const tenant = await fetchTenant(tenantId);
  return tenant?.settings || null;
}
