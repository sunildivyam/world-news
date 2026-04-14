/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tenant } from "@worldnews/shared";
import {
  deleteTenant,
  updateTenant,
} from "@worldnews/shared/mongo/collections/tenants";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  try {
    const tenantId = (await params).tenantId;
    const updates: Partial<Tenant> = await request.json();

    const result = await updateTenant(tenantId.toLowerCase(), updates);

    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  try {
    const tenantId = (await params).tenantId;
    const result = await deleteTenant(tenantId.toLowerCase());
    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}
