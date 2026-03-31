/* eslint-disable @typescript-eslint/no-explicit-any */
import { Article, SuccessResponse } from "../types";
import { NEWSENGINE_BASE } from "./apiUrls";

export async function fetchArticle(
  slug?: string,
  title?: string,
): Promise<Article | null> {
  if (!slug && !title) return null;

  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  let query;
  if (slug && title) {
    query = `slug=${slug}&title=${title}`;
  } else if (slug) {
    query = `slug=${slug}`;
  } else {
    query = `title=${title}`;
  }

  const url = `${baseApiUrl}/api/articles?${query}`;
  console.log(url);
  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Article> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchArticles(limit?: number): Promise<Article[]> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const query = limit ? `?limit=${limit}` : "";
  const url = `${baseApiUrl}/api/articles${query}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Article[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchArticlesByTenant(
  tenantId: string,
  limit?: number,
): Promise<Article[]> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const query = limit ? `&limit=${limit}` : "";
  const url = `${baseApiUrl}/api/articles?tenantId=${tenantId}${query}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Article[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchArticlesByCategory(
  category: string,
  limit?: number,
): Promise<Article[]> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const query = limit ? `&limit=${limit}` : "";
  const url = `${baseApiUrl}/api/articles?category=${category}${query}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Article[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchArticlesBySource(
  sourceId: string,
  limit?: number,
): Promise<Article[]> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const query = limit ? `&limit=${limit}` : "";
  const url = `${baseApiUrl}/api/articles?sourceId=${sourceId}${query}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Article[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createArticle(article: Article): Promise<Article> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const url = `${baseApiUrl}/api/articles`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(article),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Article> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function updateArticle(
  slug: string,
  updates: Partial<Article>,
): Promise<{ slug: string }> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const url = `${baseApiUrl}/api/articles/${slug}`;
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

export async function deleteArticle(slug: string): Promise<{ slug: string }> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const url = `${baseApiUrl}/api/articles/${slug}`;
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

export async function createArticles(articles: Article[]): Promise<Article[]> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const url = `${baseApiUrl}/api/articles`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(articles),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Article[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
