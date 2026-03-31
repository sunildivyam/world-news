/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewsEvent, SuccessResponse } from "../types";
import { NEWSENGINE_BASE } from "./apiUrls";

export async function fetchNewsEvent(
  name?: string,
  label?: string,
): Promise<NewsEvent | null> {
  if (!name && !label) return null;

  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  let query;
  if (name && label) {
    query = `name=${name}&label=${label}`;
  } else if (name) {
    query = `name=${name}`;
  } else {
    query = `label=${label}`;
  }

  const url = `${baseApiUrl}/api/events?${query}`;
  console.log(url);
  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<NewsEvent> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchNewsEvents(): Promise<NewsEvent[]> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const url = `${baseApiUrl}/api/events`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<NewsEvent[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createNewsEvent(
  newsEvent: NewsEvent,
): Promise<NewsEvent> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const url = `${baseApiUrl}/api/events`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newsEvent),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<NewsEvent> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function updateNewsEvent(
  name: string,
  updates: Partial<NewsEvent>,
): Promise<{ name: string }> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const url = `${baseApiUrl}/api/events/${name}`;
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

    const res: SuccessResponse<{ name: string }> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function deleteNewsEvent(name: string): Promise<{ name: string }> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const url = `${baseApiUrl}/api/events/${name}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<{ name: string }> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createNewsEvents(
  newsEvents: NewsEvent[],
): Promise<NewsEvent[]> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const url = `${baseApiUrl}/api/events`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newsEvents),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<NewsEvent[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
