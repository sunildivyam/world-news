/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArticleSource, SuccessResponse } from "../types";

export async function fetchArticleSource(
  slug?: string,
  name?: string,
): Promise<ArticleSource | null> {
  if (!slug && !name) return null;

  const baseApiUrl = process.env.NEWSENGINE_BASE;
  let query;
  if (slug && name) {
    query = `slug=${slug}&name=${name}`;
  } else if (slug) {
    query = `slug=${slug}`;
  } else {
    query = `name=${name}`;
  }

  const url = `${baseApiUrl}/sources?${query}`;
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
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/sources`;
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
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/sources`;
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
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/sources/${slug}`;
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
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/sources/${slug}`;
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
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/sources`;
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
