/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createApiKey,
  findApiKey,
  findTenantApiKeys,
  findInactiveTenantApiKeys,
  validateApiKey,
} from "@worldnews/shared/mongo/collections/apiKeys";
import { error } from "@worldnews/shared/mongo/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const tenantId = searchParams.get("tenantId");
    const validate = searchParams.get("validate");
    const inactive = searchParams.get("inactive");

    if (validate === "true" && key) {
      return await validateApiKey(key);
    }

    if (tenantId) {
      if (inactive === "true") {
        return await findInactiveTenantApiKeys(tenantId);
      } else {
        return await findTenantApiKeys(tenantId);
      }
    }

    if (key) {
      return await findApiKey(key);
    }

    return error("Invalid query parameters", 400);
  } catch (e: any) {
    return error(e?.message || e, 500);
  }
}

export async function POST(request: Request) {
  try {
    const { tenantId } = await request.json();

    if (!tenantId) {
      return error("tenantId is required", 400);
    }

    const result = await createApiKey(tenantId);
    return result;
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
