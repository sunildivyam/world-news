/* eslint-disable @typescript-eslint/no-explicit-any */
import { SuccessResponse, Tenant } from "../types";

export async function fetchTenant(
  tenantId?: string,
  domain?: string,
): Promise<Tenant | null> {
  if (!tenantId && !domain) return null;

  const baseApiUrl = process.env.NEWSENGINE_BASE;
  let query;
  if (tenantId && domain) {
    query = `tenantId=${tenantId}&domain=${domain}`;
  } else if (tenantId) {
    query = `tenantId=${tenantId}`;
  } else {
    query = `domain=${domain}`;
  }

  const url = `${baseApiUrl}/tenants?${query}`;
  console.log(url);
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Tenant> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchTenants(): Promise<Tenant[]> {
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/tenants`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Tenant[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
