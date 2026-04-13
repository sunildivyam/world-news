/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tenant } from "../../types/Tenant.interface";
import { getCollections } from "../collections";
import { randomBytes } from "crypto";
import { InsertOneResult, UpdateResult } from "mongodb";
import { toDbFormat, toNormalFormat } from "../mongo-utils";
import { AppError, Category } from "../../types";
import { findCategories } from "./categories";

const moduleError = new AppError("Tenants Collection", "");

export function generateTenant(): string {
  return randomBytes(32).toString("hex");
}

export async function createTenant(tenant: Tenant) {
  if (!tenant?.tenantId)
    throw moduleError.set("Empty Tenant can not be created.", 400);

  try {
    const { tenants } = await getCollections();

    const result: InsertOneResult = await tenants.insertOne(
      toDbFormat(tenant, true),
    );

    if (!result.insertedId) {
      throw moduleError.set("Failed to create Tenant", 500);
    }

    return toNormalFormat({ ...tenant, _id: result.insertedId });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function updateTenant(tenantId: string, updates: Partial<Tenant>) {
  if (!tenantId)
    throw moduleError.set("Empty Tenant, can not be updated.", 400);
  try {
    const { tenants } = await getCollections();
    const result: UpdateResult = await tenants.updateOne(
      { tenantId },
      { $set: updates },
    );

    if (result.modifiedCount === 0) {
      throw moduleError.set("Failed to update Tenant", 500);
    }

    return toNormalFormat({ tenantId });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function deleteTenant(tenantId: string) {
  if (!tenantId)
    throw moduleError.set("Empty Tenant, can not be deleted.", 400);
  try {
    const { tenants } = await getCollections();
    const result = await tenants.deleteOne({ tenantId });

    if (result.deletedCount === 0) {
      throw moduleError.set("Failed to delete Tenant", 404);
    }

    return toNormalFormat({ tenantId });
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findTenant(tenantId: string, domain?: string) {
  if (!tenantId) throw moduleError.set("Empty Tenant tenantId", 400);
  try {
    const { tenants } = await getCollections();
    const q = domain
      ? {
          $or: [
            { tenantId: tenantId.toLowerCase() },
            { domain: { $regex: `^${domain}`, $options: "i" } },
          ],
        }
      : { tenantId };

    const tenant = await tenants.findOne(q);

    if (!tenant) {
      throw moduleError.set("Tenant not found", 404);
    }

    return toNormalFormat(tenant);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findTenantCategories(
  tenantId: string,
): Promise<Category[]> {
  if (!tenantId) throw moduleError.set("Empty Tenant tenantId", 400);
  try {
    const { tenants } = await getCollections();
    const q = { tenantId };

    const tenant = await tenants.findOne(q);

    if (!tenant) {
      throw moduleError.set("Tenant not found", 404);
    }

    const categoryNames = tenant.category || [];
    if (!categoryNames?.length) return [];

    const categories = (await findCategories([...categoryNames])) || [];

    return toNormalFormat(categories);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findTenantByDomain(domain: string) {
  if (!domain) throw moduleError.set("Empty Tenant domain", 400);

  try {
    const { tenants } = await getCollections();
    const tenant = await tenants.findOne({
      domain: { $regex: `^${domain}`, $options: "i" },
    });

    if (!tenant) {
      throw moduleError.set("Tenant not found", 404);
    }

    return toNormalFormat(tenant);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function findTenants(isActive: boolean = false) {
  try {
    const { tenants } = await getCollections();
    const result = await tenants
      .find<Tenant>(isActive ? { isActive } : {})
      .toArray();

    return toNormalFormat(result);
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}

export async function createTenants(tenants: Tenant[]) {
  if (!tenants?.length)
    throw moduleError.set("Empty tenants array can not be created.", 400);

  try {
    const { tenants: collection } = await getCollections();

    const result = await collection.insertMany(tenants, { ordered: false });

    if (!result.insertedCount) {
      throw moduleError.set("Failed to create tenants", 500);
    }

    return toNormalFormat(
      tenants.map((tenant, index) => ({
        ...tenant,
        _id: result.insertedIds[index],
      })),
    );
  } catch (err: any) {
    throw moduleError.parse(err, 500);
  }
}
