import { NextRequest } from "next/server";
import {
  findTenantByDomain,
  findTenantById,
  populateContextFromTenant,
} from "./Tenant.Service";
import { TenantContext } from "./TenantContext.interface";
import { findTenantFromSegments } from "./Tenant.helper";

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
  request: NextRequest,
): Promise<TenantContext | null> {
  const host = request.headers.get("host") || "";

  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);

  // 1️⃣ custom domain
  const domainTenant = await findTenantByDomain(host);
  if (domainTenant) return await populateContextFromTenant(domainTenant);

  // 2️⃣ subdomain
  const parts = host.split(".");
  if (parts.length > 2) {
    const subdomain = parts[0];
    const tenant = await findTenantById(subdomain);
    if (tenant) return await populateContextFromTenant(tenant);
  }

  return await findTenantFromSegments(segments);

  // No tenant found in the url, means an invalid url

  // // 4️⃣ fallback
  // const defaultTenant = await findTenantById("globalnews");
  // return await populateContextFromTenant(defaultTenant);
}
