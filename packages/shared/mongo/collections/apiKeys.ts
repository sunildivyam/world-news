/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCollections } from "../collections";
import { randomBytes } from "crypto";
import { InsertOneResult, UpdateResult } from "mongodb";
import { toDbFormat, toNormalFormat } from "../mongo-utils";
import { ApiKey, AppError } from "../../types";

const moduleError = new AppError("ApiKeys Collection", "");

export function generateApiKey(): string {
  return randomBytes(32).toString("hex");
}

export async function createApiKey(tenantId: string) {
  if (!tenantId)
    throw moduleError.set("TenantId is required to generate Api Key.", 400);
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

    const result: InsertOneResult = await apiKeys.insertOne(
      toDbFormat(apiKey, true),
    );

    if (!result.insertedId) {
      throw moduleError.set("Failed to create API key", 500);
    }

    return toNormalFormat({ ...apiKey, _id: result.insertedId });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function updateApiKey(key: string, updates: Partial<ApiKey>) {
  if (!key) throw moduleError.set("Empty Api Key, can not be updated.", 400);
  try {
    const { apiKeys } = await getCollections();
    const result: UpdateResult = await apiKeys.updateOne(
      { key },
      { $set: toDbFormat(updates, true) },
    );

    if (result.modifiedCount === 0) {
      throw moduleError.set("Failed to update API key", 404);
    }

    return toNormalFormat({ apiKey: key });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function deleteApiKey(key: string) {
  if (!key) throw moduleError.set("Empty Api Key, can not be deleted.", 400);
  try {
    const { apiKeys } = await getCollections();
    const result = await apiKeys.deleteOne({ key });

    if (result.deletedCount === 0) {
      throw moduleError.set("Failed to delete API key", 404);
    }

    return toNormalFormat({ apiKey: key });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function expireApiKey(key: string) {
  if (!key) throw moduleError.set("Empty Api Key, can not be expired.", 400);
  try {
    const { apiKeys } = await getCollections();
    const result: UpdateResult = await apiKeys.updateOne(
      { key },
      { $set: { isActive: false, updatedAt: new Date() } },
    );

    if (result.modifiedCount === 0) {
      throw moduleError.set("Failed to expire API key", 404);
    }

    return toNormalFormat({ apiKey: key });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findTenantApiKeys(tenantId: string) {
  if (!tenantId)
    throw moduleError.set("TenantId is required to find API keys.", 400);
  try {
    const { apiKeys } = await getCollections();
    const result = await apiKeys.find({ tenantId, isActive: true }).toArray();

    if (result.length === 0) {
      throw moduleError.set("No active API keys found for this tenant", 404);
    }

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findInactiveTenantApiKeys(tenantId: string) {
  if (!tenantId)
    throw moduleError.set("TenantId is required to find API keys.", 400);
  try {
    const { apiKeys } = await getCollections();
    const result = await apiKeys.find({ tenantId, isActive: false }).toArray();

    if (result.length === 0) {
      throw moduleError.set("No inactive API keys found for this tenant", 404);
    }

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findApiKey(key: string) {
  if (!key) throw moduleError.set("Empty Api key.", 400);
  try {
    const { apiKeys } = await getCollections();
    const result = await apiKeys.findOne<ApiKey>({ key });

    if (!result) {
      throw moduleError.set("No API key found with this key.", 404);
    }

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function validateApiKey(key: string) {
  if (!key) throw moduleError.set("Empty Api key.", 400);
  try {
    const { apiKeys } = await getCollections();
    const result = await apiKeys.findOne<ApiKey>({ key, isActive: true });

    if (!result) {
      throw moduleError.set("INVALID_API_KEY", 404);
    }

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}
