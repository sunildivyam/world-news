import { isLocalHost } from "@worldnews/shared";
import {
  findTenantByDomain,
  findTenantById,
  findTenantFromSegments,
  populateContextFromTenant,
} from "./Tenant.validators";
import type { TenantContext } from "@worldnews/shared/types";

/**
 * Resove Tenant with following Priority order:
 *  custom domain
 *  subdomain
 *  path param
 *  default tenant
 *
 * @param request
 * @returns
 */
export async function resolveTenantContext(
  host: string,
  pathname: string,
): Promise<TenantContext | null> {
  if (isLocalHost(host)) {
    const segments = pathname.split("/").filter(Boolean);
    return await findTenantFromSegments(segments);
  }
  // 1️⃣ custom domain
  const domainTenant = await findTenantByDomain(host);
  if (domainTenant) {
    const tenantCtx = await populateContextFromTenant(domainTenant);
    tenantCtx.domain = host;
    return tenantCtx;
  }

  return null;
  // // 2️⃣ subdomain
  // const parts = host.split(".");
  // if (parts.length > 2) {
  //   const subdomain = parts[0];
  //   const tenant = await findTenantById(subdomain);
  //   if (tenant) return await populateContextFromTenant(tenant);
  // }

  // No tenant found in the url, means an invalid url

  // // 4️⃣ fallback
  // const defaultTenant = await findTenantById("globalnews");
  // return await populateContextFromTenant(defaultTenant);
}
