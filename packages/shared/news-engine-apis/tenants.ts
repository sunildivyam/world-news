/* eslint-disable @typescript-eslint/no-explicit-any */
import { SuccessResponse, Tenant } from "../types";
import { newsEngineBaseApiUrl } from "./apiUrls";

export async function fetchTenant(
  tenantId?: string,
  domain?: string,
): Promise<Tenant | null> {
  if (!tenantId && !domain) return null;

  let query;
  if (tenantId && domain) {
    query = `tenantId=${tenantId}&domain=${domain}`;
  } else if (tenantId) {
    query = `tenantId=${tenantId}`;
  } else {
    query = `domain=${domain}`;
  }

  const url = `${newsEngineBaseApiUrl}/api/tenants?${query}`;
  console.log(url);
  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
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
  const url = `${newsEngineBaseApiUrl}/api/tenants`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
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

export async function createTenant(tenant: Tenant): Promise<Tenant> {
  const url = `${newsEngineBaseApiUrl}/api/tenants`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tenant),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Tenant> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function updateTenant(
  tenantId: string,
  updates: Partial<Tenant>,
): Promise<Tenant> {
  const url = `${newsEngineBaseApiUrl}/api/tenants/${tenantId}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Tenant> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function deleteTenant(
  tenantId: string,
): Promise<{ tenantId: string }> {
  const url = `${newsEngineBaseApiUrl}/api/tenants/${tenantId}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<{ tenantId: string }> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createTenants(tenants: Tenant[]): Promise<Tenant[]> {
  const url = `${newsEngineBaseApiUrl}/api/tenants`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tenants),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Tenant[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
