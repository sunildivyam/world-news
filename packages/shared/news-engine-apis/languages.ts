/* eslint-disable @typescript-eslint/no-explicit-any */
import { Language, SuccessResponse } from "../types";
import { NEWSENGINE_BASE } from "./apiUrls";

export async function fetchLanguage(
  code2?: string,
  code?: string,
  name?: string,
): Promise<Language | null> {
  if (!code && !name && !code2) return null;

  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  let query;
  if (code2) {
    query = `code2=${code2}`;
  } else if (code && name) {
    query = `code=${code}&name=${name}`;
  } else if (code) {
    query = `code=${code}`;
  } else {
    query = `name=${name}`;
  }

  const url = `${baseApiUrl}/api/languages?${query}`;
  console.log(url);
  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Language> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchLanguages(): Promise<Language[]> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const url = `${baseApiUrl}/api/languages`;
  console.log(url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Language[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createLanguage(language: Language): Promise<Language> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const url = `${baseApiUrl}/api/languages`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(language),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Language> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function updateLanguage(
  code: string,
  updates: Partial<Language>,
): Promise<Language> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const url = `${baseApiUrl}/api/languages/${code}`;
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

    const res: SuccessResponse<Language> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function deleteLanguage(code: string): Promise<{ code: string }> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const url = `${baseApiUrl}/api/languages/${code}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<{ code: string }> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createLanguages(
  languages: Language[],
): Promise<Language[]> {
  const baseApiUrl = process.env.NEWSENGINE_BASE || NEWSENGINE_BASE;
  const url = `${baseApiUrl}/api/languages`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(languages),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Language[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
