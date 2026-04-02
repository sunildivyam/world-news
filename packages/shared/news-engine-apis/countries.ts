/* eslint-disable @typescript-eslint/no-explicit-any */
import { Country, GeoContext, SuccessResponse } from "../types";
import { newsEngineBaseApiUrl } from "./apiUrls";

export async function fetchCountry(
  code?: string,
  name?: string,
): Promise<Country | null> {
  if (!code && !name) return null;

  let query;
  if (code && name) {
    query = `code=${code}&name=${name}`;
  } else if (code) {
    query = `code=${code}`;
  } else {
    query = `name=${name}`;
  }

  const url = `${newsEngineBaseApiUrl}/api/countries?${query}`;
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
  const url = `${newsEngineBaseApiUrl}/api/countries`;
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
  const url = `${newsEngineBaseApiUrl}/api/countries/geo`;
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

export async function createCountry(country: Country): Promise<Country> {
  const url = `${newsEngineBaseApiUrl}/api/countries`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(country),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Country> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function updateCountry(
  code: string,
  updates: Partial<Country>,
): Promise<Country> {
  const url = `${newsEngineBaseApiUrl}/api/countries/${code}`;
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

    const res: SuccessResponse<Country> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function deleteCountry(code: string): Promise<{ code: string }> {
  const url = `${newsEngineBaseApiUrl}/api/countries/${code}`;
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

export async function createCountries(
  countries: Country[],
): Promise<Country[]> {
  const url = `${newsEngineBaseApiUrl}/api/countries`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(countries),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res: SuccessResponse<Country[]> = await response.json();
    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
