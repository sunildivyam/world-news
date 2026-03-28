/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category, SuccessResponse } from "../types";

export async function fetchCategory(
  name?: string,
  label?: string,
): Promise<Category | null> {
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

  const url = `${baseApiUrl}/categories?${query}`;
  console.log(url);
  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Category> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchCategories(): Promise<Category[]> {
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/categories`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Category[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createCategory(category: Category): Promise<Category> {
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/categories`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Category> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function updateCategory(
  name: string,
  updates: Partial<Category>,
): Promise<Category> {
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/categories/${name}`;
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

    const res: SuccessResponse<Category> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function deleteCategory(name: string): Promise<{ name: string }> {
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/categories/${name}`;
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

export async function createCategories(
  categoriesArray: Category[],
): Promise<{ insertedCount: number; insertedIds: string[] }> {
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/categories`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoriesArray),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<{
      insertedCount: number;
      insertedIds: string[];
    }> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
