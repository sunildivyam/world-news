/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewsBatch, SuccessResponse } from "../types";
import { newsEngineBaseApiUrl } from "./apiUrls";

export async function fetchNewsBatch(id: string): Promise<NewsBatch | null> {
  const url = `${newsEngineBaseApiUrl}/api/news-batches?id=${id}`;
  console.log(url);
  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<NewsBatch> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchActiveNewsBatches(): Promise<NewsBatch[]> {
  const url = `${newsEngineBaseApiUrl}/api/news-batches?active=true`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<NewsBatch[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchNewsBatches(): Promise<NewsBatch[]> {
  const url = `${newsEngineBaseApiUrl}/api/news-batches`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<NewsBatch[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createNewsBatch(
  newsBatch: NewsBatch,
): Promise<NewsBatch> {
  const url = `${newsEngineBaseApiUrl}/api/news-batches`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newsBatch),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<NewsBatch> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function updateNewsBatch(
  id: string,
  updates: Partial<NewsBatch>,
): Promise<NewsBatch> {
  const url = `${newsEngineBaseApiUrl}/api/news-batches/${id}`;
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

    const res: SuccessResponse<NewsBatch> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function deleteNewsBatch(id: string): Promise<{ id: string }> {
  const url = `${newsEngineBaseApiUrl}/api/news-batches/${id}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<{ id: string }> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createNewsBatches(
  newsBatches: NewsBatch[],
): Promise<NewsBatch[]> {
  const url = `${newsEngineBaseApiUrl}/api/news-batches`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newsBatches),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<NewsBatch[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
