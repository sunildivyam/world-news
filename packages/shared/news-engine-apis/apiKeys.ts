/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiKey, SuccessResponse } from "../types";
import { newsEngineBaseApiUrl } from "./apiUrls";

export async function fetchApiKey(key: string): Promise<ApiKey | null> {
  const url = `${newsEngineBaseApiUrl}/api/apikeys?key=${key}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<ApiKey> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function validateApiKey(key: string): Promise<ApiKey | null> {
  const url = `${newsEngineBaseApiUrl}/api/apikeys?key=${key}&validate=true`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<ApiKey> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchTenantApiKeys(tenantId: string): Promise<ApiKey[]> {
  const url = `${newsEngineBaseApiUrl}/api/apikeys?tenantId=${tenantId}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<ApiKey[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchInactiveTenantApiKeys(
  tenantId: string,
): Promise<ApiKey[]> {
  const url = `${newsEngineBaseApiUrl}/api/apikeys?tenantId=${tenantId}&inactive=true`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<ApiKey[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createApiKey(tenantId: string): Promise<ApiKey> {
  const url = `${newsEngineBaseApiUrl}/api/apikeys`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tenantId }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<ApiKey> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function updateApiKey(
  key: string,
  updates: Partial<ApiKey>,
): Promise<{ apiKey: string }> {
  const url = `${newsEngineBaseApiUrl}/api/apikeys/${key}`;
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

    const res: SuccessResponse<{ apiKey: string }> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function expireApiKey(key: string): Promise<{ apiKey: string }> {
  const url = `${newsEngineBaseApiUrl}/api/apikeys/${key}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expire: true }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<{ apiKey: string }> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function deleteApiKey(key: string): Promise<{ apiKey: string }> {
  const url = `${newsEngineBaseApiUrl}/api/apikeys/${key}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<{ apiKey: string }> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
