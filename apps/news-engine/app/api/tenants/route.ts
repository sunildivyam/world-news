/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tenant } from "@worldnews/shared";
import {
  createTenant,
  createTenants,
  findTenant,
  findTenantByDomain,
  findTenants,
} from "@worldnews/shared/mongo/collections/tenants";
import { error } from "@worldnews/shared/mongo/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const domain = searchParams.get("domain");

    if (tenantId && domain) {
      return await findTenant(tenantId.toLowerCase(), domain);
    } else if (tenantId) {
      return await findTenant(tenantId.toLowerCase());
    } else if (domain) {
      return await findTenantByDomain(domain);
    } else {
      return await findTenants();
    }
  } catch (e: any) {
    return error(e?.message || e, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's an array for bulk insert
    if (Array.isArray(body)) {
      const result = await createTenants(body);
      return result;
    } else {
      // Single tenant insert
      const result = await createTenant(body);
      return result;
    }
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
