/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArticleSource, SuccessResponse } from "../types";
import { newsEngineBaseApiUrl } from "./apiUrls";

export async function fetchArticleSource(
  slug?: string,
  name?: string,
): Promise<ArticleSource | null> {
  if (!slug && !name) return null;

  let query;
  if (slug && name) {
    query = `slug=${slug}&name=${name}`;
  } else if (slug) {
    query = `slug=${slug}`;
  } else {
    query = `name=${name}`;
  }

  const url = `${newsEngineBaseApiUrl}/api/sources?${query}`;
  console.log(url);
  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<ArticleSource> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchArticleSources(): Promise<ArticleSource[]> {
  const url = `${newsEngineBaseApiUrl}/api/sources`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<ArticleSource[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createArticleSource(
  articleSource: ArticleSource,
): Promise<ArticleSource> {
  const url = `${newsEngineBaseApiUrl}/api/sources`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(articleSource),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<ArticleSource> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function updateArticleSource(
  slug: string,
  updates: Partial<ArticleSource>,
): Promise<{ slug: string }> {
  const url = `${newsEngineBaseApiUrl}/api/sources/${slug}`;
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

    const res: SuccessResponse<{ slug: string }> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function deleteArticleSource(
  slug: string,
): Promise<{ slug: string }> {
  const url = `${newsEngineBaseApiUrl}/api/sources/${slug}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<{ slug: string }> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createArticleSources(
  articleSources: ArticleSource[],
): Promise<ArticleSource[]> {
  const url = `${newsEngineBaseApiUrl}/api/sources`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(articleSources),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<ArticleSource[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
