import { findTenantById, populateContextFromTenant } from "./Tenant.Service";
import { TenantContext } from "./TenantContext.interface";

export async function findTenantFromSegments(
  segments: Array<string>,
): Promise<TenantContext | null> {
  // 3️⃣ path-based tenant
  if (segments.length > 0) {
    const tenant = await findTenantById(segments[0]);
    if (tenant) return await populateContextFromTenant(tenant);
  }

  // No tenant found in the url, means an invalid url

  return null;

  // // 4️⃣ fallback
  // const defaultTenant = await findTenantById("globalnews");
  // return await populateContextFromTenant(defaultTenant);
}
