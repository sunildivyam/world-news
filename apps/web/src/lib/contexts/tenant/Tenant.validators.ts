import { DEFAULT_TENANT, tenants } from "@/app-constants/tenants.constant";
import type { Tenant } from "@worldnews/shared";
import type { TenantContext } from "@worldnews/shared";
import type { TenantConfig } from "@worldnews/shared";

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
export async function findTenantByDomain(
  domain: string,
): Promise<Tenant | undefined> {
  return tenants.find((t) => t.domain === domain);
}

export async function findTenantById(id: string): Promise<Tenant | undefined> {
  return tenants.find((t) => t.id === id);
}

export async function findTenantFromSegments(
  segments: Array<string>,
): Promise<TenantContext | null> {
  // 3️⃣ path-based tenant
  if (segments.length > 0) {
    const tenant = await findTenantById(segments[0]);
    if (tenant) return await populateContextFromTenant(tenant);
  }

  return null;
}

export async function getTenantConfig(
  tenantId: string,
): Promise<TenantConfig | null> {
  const tenant = await findTenantById(tenantId);
  return tenant?.settings || null;
}
