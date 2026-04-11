/* eslint-disable @typescript-eslint/no-explicit-any */
import { Headline } from "../types";
import { newsEngineBaseApiUrl } from "./apiUrls";

export async function fetchHeadline(
  slug?: string,
  title?: string,
): Promise<Headline | null> {
  if (!slug && !title) return null;

  let query;
  if (slug && title) {
    query = `slug=${slug}&title=${title}`;
  } else if (slug) {
    query = `slug=${slug}`;
  } else {
    query = `title=${title}`;
  }

  const url = `${newsEngineBaseApiUrl}/api/headlines?${query}`;
  console.log(url);
  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(response.statusText);
    }

    const res: Headline = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchHeadlines(limit?: number): Promise<Headline[]> {
  const query = limit ? `?limit=${limit}` : "";
  const url = `${newsEngineBaseApiUrl}/api/headlines${query}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: Headline[] = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchHeadlinesByTenant(
  tenantId: string,
  limit?: number,
): Promise<Headline[]> {
  const query = limit ? `&limit=${limit}` : "";
  const url = `${newsEngineBaseApiUrl}/api/headlines?tenantId=${tenantId}${query}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: Headline[] = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchHeadlinesByContentGenerated(
  contentGeneratedAt: Date | string | null,
  limit?: number,
): Promise<Headline[]> {
  const query = limit ? `&limit=${limit}` : "";
  const url = `${newsEngineBaseApiUrl}/api/headlines?contentGeneratedAt=${contentGeneratedAt}${query}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: Headline[] = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchHeadlinesByCategory(
  category: string,
  limit?: number,
): Promise<Headline[]> {
  const query = limit ? `&limit=${limit}` : "";
  const url = `${newsEngineBaseApiUrl}/api/headlines?category=${category}${query}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: Headline[] = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchHeadlinesBySource(
  sourceId: string,
  limit?: number,
): Promise<Headline[]> {
  const query = limit ? `&limit=${limit}` : "";
  const url = `${newsEngineBaseApiUrl}/api/headlines?sourceId=${sourceId}${query}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: Headline[] = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchHeadlinesByProvider(
  providerName: string,
  limit?: number,
): Promise<Headline[]> {
  const query = limit ? `&limit=${limit}` : "";
  const url = `${newsEngineBaseApiUrl}/api/headlines?providerName=${providerName}${query}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: Headline[] = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchHeadlinesByCountryAndCategory(
  country: string[],
  category: string[],
  limit?: number,
): Promise<Headline[]> {
  const queryParts: string[] = [];

  if (country && country.length > 0) {
    country.forEach((c) => queryParts.push(`country=${encodeURIComponent(c)}`));
  }

  if (category && category.length > 0) {
    category.forEach((c) =>
      queryParts.push(`category=${encodeURIComponent(c)}`),
    );
  }

  if (limit) {
    queryParts.push(`limit=${limit}`);
  }

  const query = queryParts.length > 0 ? "?" + queryParts.join("&") : "";
  const url = `${newsEngineBaseApiUrl}/api/headlines${query}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: Headline[] = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createHeadline(headline: Headline): Promise<Headline> {
  const url = `${newsEngineBaseApiUrl}/api/headlines`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(headline),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: Headline = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function updateHeadline(
  id: string,
  updates: Partial<Headline>,
): Promise<{ id: string }> {
  const url = `${newsEngineBaseApiUrl}/api/headlines/${id}`;
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

    const res: { id: string } = await response.json();
    return res;
  } catch (err: any) {
    console.log(err?.message);
    throw new Error(err);
  }
}

export async function deleteHeadline(id: string): Promise<{ id: string }> {
  const url = `${newsEngineBaseApiUrl}/api/headlines/${id}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: { id: string } = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createHeadlines(
  headlines: Headline[],
): Promise<{ insertedCount: number; insertedIds: string[] }> {
  const url = `${newsEngineBaseApiUrl}/api/headlines`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(headlines),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: {
      insertedCount: number;
      insertedIds: string[];
    } = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function startNewsBatches(): Promise<{ success: boolean }> {
  const url = `${newsEngineBaseApiUrl}/api/headlines/start`;
  console.log(url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: {
      success: boolean;
    } = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}
