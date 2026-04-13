/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSuccess, apiError } from "@/lib/api-response";
import { findTenantCategories } from "@worldnews/shared/mongo/collections/tenants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    const result = await findTenantCategories(tenantId?.toLowerCase() || "");

    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}
