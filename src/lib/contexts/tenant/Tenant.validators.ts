import { tenants } from "@/app-constants/tenants.constant";
import { Tenant } from "@/types/Tenant";
import { TenantContext } from "./TenantContext.interface";

export async function populateContextFromTenant(
  tenant?: Tenant,
): Promise<TenantContext> {
  const ctx: TenantContext = {
    tenant: tenant,
    language: tenant?.primaryLanguage,
    domain: tenant?.domain,
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
