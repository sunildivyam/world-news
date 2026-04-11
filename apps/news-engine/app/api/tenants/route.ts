/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createTenant,
  createTenants,
  findTenant,
  findTenantByDomain,
  findTenants,
} from "@worldnews/shared/mongo/collections/tenants";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const domain = searchParams.get("domain");

    let result;
    if (tenantId && domain) {
      result = await findTenant(tenantId.toLowerCase(), domain);
    } else if (tenantId) {
      result = await findTenant(tenantId.toLowerCase());
    } else if (domain) {
      result = await findTenantByDomain(domain);
    } else {
      result = await findTenants();
    }

    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's an array for bulk insert
    if (Array.isArray(body)) {
      const result = await createTenants(body);
      return apiSuccess(result);
    } else {
      // Single tenant insert
      const result = await createTenant(body);
      return apiSuccess(result);
    }
  } catch (err: any) {
    return apiError(err);
  }
}
