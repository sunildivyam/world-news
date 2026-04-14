/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category } from "../types";
import { newsEngineBaseApiUrl } from "./apiUrls";

export async function fetchCategory(
  name?: string,
  label?: string,
): Promise<Category | null> {
  if (!name && !label) return null;

  let query;
  if (name && label) {
    query = `name=${name}&label=${label}`;
  } else if (name) {
    query = `name=${name}`;
  } else {
    query = `label=${label}`;
  }

  const url = `${newsEngineBaseApiUrl}/api/categories?${query}`;
  console.log(url);
  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(response.statusText);
    }

    const res: Category = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchCategories(names?: string[]): Promise<Category[]> {
  let q = "";
  if (names?.length) {
    q = `?names=${names.join(",")}`;
  }

  const url = `${newsEngineBaseApiUrl}/api/categories${q}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: Category[] = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createCategory(category: Category): Promise<Category> {
  const url = `${newsEngineBaseApiUrl}/api/categories`;
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

    const res: Category = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function updateCategory(
  name: string,
  updates: Partial<Category>,
): Promise<Category> {
  const url = `${newsEngineBaseApiUrl}/api/categories/${name}`;
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

    const res: Category = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function deleteCategory(name: string): Promise<{ name: string }> {
  const url = `${newsEngineBaseApiUrl}/api/categories/${name}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: { name: string } = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createCategories(
  categoriesArray: Category[],
): Promise<{ insertedCount: number; insertedIds: string[] }> {
  const url = `${newsEngineBaseApiUrl}/api/categories`;
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

    const res: {
      insertedCount: number;
      insertedIds: string[];
    } = await response.json();
    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}
