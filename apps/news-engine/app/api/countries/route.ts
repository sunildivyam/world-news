/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Country } from "@worldnews/shared";
import {
  createCountry,
  createCountries,
  findCountry,
  findCountryByName,
  getAllCountries,
} from "@worldnews/shared/mongo/collections/countries";
import { error } from "@worldnews/shared/mongo/response";

export const revalidate = 120;
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const name = searchParams.get("name");
    const codes = searchParams.get("codes");

    if (code && name) {
      return await findCountry(code.toLowerCase(), name);
    } else if (code) {
      return await findCountry(code.toLowerCase());
    } else if (name) {
      return await findCountryByName(name);
    } else if (codes) {
      return await getAllCountries(codes.split(","));
    } else {
      return await getAllCountries();
    }
  } catch (e: any) {
    return error(e?.message || e, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's an array for bulk insert
    if (Array.isArray(body)) {
      const result = await createCountries(body);
      return result;
    } else {
      // Single country insert
      const result = await createCountry(body);
      return result;
    }
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
