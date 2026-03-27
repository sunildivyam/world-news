import { NextRequest } from "next/server";
import {
  findTenantFromSegments,
  populateContextFromTenant,
} from "./Tenant.validators";
import type { TenantContext } from "@worldnews/shared/types";
import { fetchTenant } from "@worldnews/shared";

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
  const host = (request.headers.get("host") || "").toLowerCase();

  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);

  // 1️⃣ custom domain
  console.log("Host: ", host);
  const domainTenant = await fetchTenant("", host);
  console.log(
    "Cuustom Domain: (D:",
    domainTenant?.domain,
    " , T: ",
    domainTenant?.id,
    ")",
  );
  if (domainTenant) {
    const tenantCtx = await populateContextFromTenant(domainTenant);
    tenantCtx.domain = host;
    return tenantCtx;
  }

  // 2️⃣ subdomain
  const parts = host.split(".");
  if (parts.length > 2) {
    const subdomain = parts[0];
    const tenant = await fetchTenant(subdomain);
    if (tenant) return await populateContextFromTenant(tenant);
  }

  return await findTenantFromSegments(segments);

  // No tenant found in the url, means an invalid url

  // // 4️⃣ fallback
  // const defaultTenant = await findTenantById("globalnews");
  // return await populateContextFromTenant(defaultTenant);
}
