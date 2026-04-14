/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createApiKey,
  findApiKey,
  findTenantApiKeys,
  findInactiveTenantApiKeys,
  validateApiKey,
} from "@worldnews/shared/mongo/collections/apiKeys";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const tenantId = searchParams.get("tenantId");
    const validate = searchParams.get("validate");
    const inactive = searchParams.get("inactive");

    let result;

    if (validate === "true" && key) {
      result = await validateApiKey(key);
    }

    if (tenantId) {
      if (inactive === "true") {
        result = await findInactiveTenantApiKeys(tenantId);
      } else {
        result = await findTenantApiKeys(tenantId);
      }
    } else {
      result = await findApiKey(key || "");
    }

    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}

export async function POST(request: Request) {
  try {
    const { tenantId } = await request.json();

    const result = await createApiKey(tenantId);
    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}
