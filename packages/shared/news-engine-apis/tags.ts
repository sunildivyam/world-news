/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tag, SuccessResponse } from "../types";

export async function fetchTag(
  name?: string,
  label?: string,
): Promise<Tag | null> {
  if (!name && !label) return null;

  const baseApiUrl = process.env.NEWSENGINE_BASE;
  let query;
  if (name && label) {
    query = `name=${name}&label=${label}`;
  } else if (name) {
    query = `name=${name}`;
  } else {
    query = `label=${label}`;
  }

  const url = `${baseApiUrl}/tags?${query}`;
  console.log(url);
  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Tag> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchTags(): Promise<Tag[]> {
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/tags`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Tag[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createTag(tag: Tag): Promise<Tag> {
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/tags`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tag),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Tag> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function updateTag(
  name: string,
  updates: Partial<Tag>,
): Promise<{ name: string }> {
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/tags/${name}`;
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

export async function deleteTag(name: string): Promise<{ name: string }> {
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/tags/${name}`;
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

export async function createTags(tags: Tag[]): Promise<Tag[]> {
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/tags`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tags),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Tag[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
