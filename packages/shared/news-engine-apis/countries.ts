/* eslint-disable @typescript-eslint/no-explicit-any */
import { Country, GeoContext, SuccessResponse } from "../types";

export async function fetchCountry(
  code?: string,
  name?: string,
): Promise<Country | null> {
  if (!code && !name) return null;

  const baseApiUrl = process.env.NEWSENGINE_BASE;
  let query;
  if (code && name) {
    query = `code=${code}&name=${name}`;
  } else if (code) {
    query = `code=${code}`;
  } else {
    query = `name=${name}`;
  }

  const url = `${baseApiUrl}/countries?${query}`;
  console.log(url);
  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Country> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchCountries(): Promise<Country[]> {
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/countries`;
  console.log(url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Country[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchAddGeo(
  geoCtx: GeoContext,
): Promise<{ code: string }> {
  const baseApiUrl = process.env.NEWSENGINE_BASE;
  const url = `${baseApiUrl}/countries/geo`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geoCtx),
    });

    if (!response.ok) {
      if (response.status === 404) return { code: "" };
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<{ code: string }> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
