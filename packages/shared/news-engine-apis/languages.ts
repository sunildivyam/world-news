/* eslint-disable @typescript-eslint/no-explicit-any */
import { Language, GeoContext, SuccessResponse } from "../types";

export async function fetchLanguage(
  code2?: string,
  code?: string,
  name?: string,
): Promise<Language | null> {
  if (!code && !name && !code2) return null;

  const baseApiUrl = process.env.NEWSENGINE_BASE;
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

  const url = `${baseApiUrl}/languages?${query}`;
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
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/languages`;
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
