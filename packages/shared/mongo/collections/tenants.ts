/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tenant } from "../../types/Tenant.interface";
import { getCollections } from "../collections";
import { randomBytes } from "crypto";
import { InsertOneResult, UpdateResult } from "mongodb";
import { error, success } from "../response";

export function generateTenant(): string {
  return randomBytes(32).toString("hex");
}

export async function createTenant(tenant: Tenant) {
  if (!tenant?.tenantId) return error("Empty Tenant can not be created.");

  try {
    const { tenants } = await getCollections();

    const result: InsertOneResult = await tenants.insertOne(tenant);

    if (!result.insertedId) {
      return error("Failed to create Tenant");
    }

    return success({ ...tenant, id: result.insertedId });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function updateTenant(tenantId: string, updates: Partial<Tenant>) {
  if (!tenantId) return error("Empty Tenant, can not be updated.");
  try {
    const { tenants } = await getCollections();
    const result: UpdateResult = await tenants.updateOne(
      { tenantId },
      { $set: updates },
    );

    if (result.modifiedCount === 0) {
      return error("Failed to update Tenant", 500);
    }

    return success({ tenantId });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function deleteTenant(tenantId: string) {
  if (!tenantId) return error("Empty Tenant, can not be deleted.");
  try {
    const { tenants } = await getCollections();
    const result = await tenants.deleteOne({ tenantId });

    if (result.deletedCount === 0) {
      return error("Failed to delete Tenant", 404);
    }

    return success({ tenantId });
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findTenant(tenantId: string, domain?: string) {
  if (!tenantId) return error("Empty Tenant tenantId");

  try {
    const { tenants } = await getCollections();
    const q = domain
      ? {
          $and: [
            { tenantId: tenantId.toLowerCase() },
            { domain: { $regex: `^${domain}`, $options: "i" } },
          ],
        }
      : { tenantId };

    const tenant = await tenants.findOne(q);

    if (!tenant) {
      return error("Tenant not found", 404);
    }

    return success(tenant);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findTenantByDomain(domain: string) {
  if (!domain) return error("Empty Tenant domain");

  try {
    const { tenants } = await getCollections();
    const tenant = await tenants.findOne({
      domain: { $regex: `^${domain}`, $options: "i" },
    });

    if (!tenant) {
      return error("Tenant not found", 404);
    }

    return success(tenant);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function findTenants() {
  try {
    const { tenants } = await getCollections();
    const result = await tenants.find<Tenant>({}).toArray();

    return success(result);
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}

export async function createTenants(tenants: Tenant[]) {
  if (!tenants?.length) return error("Empty tenants array can not be created.");

  try {
    const { tenants: collection } = await getCollections();

    const result = await collection.insertMany(tenants);

    if (!result.insertedCount) {
      return error("Failed to create tenants");
    }

    return success(
      tenants.map((tenant, index) => ({
        ...tenant,
        id: result.insertedIds[index],
      })),
    );
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
