/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCollections } from "../collections";
import { randomBytes } from "crypto";
import { InsertOneResult, UpdateResult } from "mongodb";
import { error, success } from "../response";
import { ApiKey, ErrorResponse, SuccessResponse } from "../../types";

export function generateApiKey(): string {
  return randomBytes(32).toString("hex");
}

export async function createApiKey(tenantId: string) {
  if (!tenantId) return error("TenantId is required to generate Api Key.");
  // TODO: Verify the tenantId with Tenant collection
  // TODO: Verify the tenant's payment/subscription
  try {
    const { apiKeys } = await getCollections();
    const apiKey: ApiKey = {
      key: generateApiKey(),
      tenantId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result: InsertOneResult = await apiKeys.insertOne(apiKey);

    if (!result.insertedId) {
      return error("Failed to create API key");
    }

    return success({ ...apiKey, id: result.insertedId });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function updateApiKey(key: string, updates: Partial<ApiKey>) {
  if (!key) return error("Empty Api Key, can not be updated.");
  try {
    const { apiKeys } = await getCollections();
    const result: UpdateResult = await apiKeys.updateOne(
      { key },
      { $set: updates },
    );

    if (result.modifiedCount === 0) {
      return error("Failed to update API key", 404);
    }

    return success({ apiKey: key });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function deleteApiKey(key: string) {
  if (!key) return error("Empty Api Key, can not be deleted.");
  try {
    const { apiKeys } = await getCollections();
    const result = await apiKeys.deleteOne({ key });

    if (result.deletedCount === 0) {
      return error("Failed to delete API key", 404);
    }

    return success({ apiKey: key });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function expireApiKey(key: string) {
  if (!key) return error("Empty Api Key, can not be expired.");
  try {
    const { apiKeys } = await getCollections();
    const result: UpdateResult = await apiKeys.updateOne(
      { key },
      { $set: { isActive: false, updatedAt: new Date() } },
    );

    if (result.modifiedCount === 0) {
      return error("Failed to expire API key", 404);
    }

    return success({ apiKey: key });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findTenantApiKeys(tenantId: string) {
  if (!tenantId) return error("TenantId is required to find API keys.");
  try {
    const { apiKeys } = await getCollections();
    const result = await apiKeys.find({ tenantId, isActive: true }).toArray();

    if (result.length === 0) {
      return error("No active API keys found for this tenant", 404);
    }

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findInactiveTenantApiKeys(tenantId: string) {
  if (!tenantId) return error("TenantId is required to find API keys.");
  try {
    const { apiKeys } = await getCollections();
    const result = await apiKeys.find({ tenantId, isActive: false }).toArray();

    if (result.length === 0) {
      return error("No inactive API keys found for this tenant", 404);
    }

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findApiKey(key: string) {
  if (!key) return error("Empty Api key.");
  try {
    const { apiKeys } = await getCollections();
    const result = await apiKeys.findOne<ApiKey>({ key });

    if (!result) {
      return error("No API key found with this key.", 404);
    }

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function validateApiKey(key: string) {
  if (!key) return error("Empty Api key.");
  try {
    const { apiKeys } = await getCollections();
    const result = await apiKeys.findOne<ApiKey>({ key, isActive: true });

    if (!result) {
      return error("INVALID_API_KEY", 404);
    }

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
