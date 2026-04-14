/* eslint-disable @typescript-eslint/no-explicit-any */

import { apiSuccess, apiError } from "@/lib/api-response";
import {
  createCountry,
  createCountries,
  findCountry,
  findCountryByName,
  getAllCountries,
  findCountryById,
} from "@worldnews/shared/mongo/collections/countries";

export const revalidate = 120;
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const code = searchParams.get("code");
    const name = searchParams.get("name");
    const codes = searchParams.get("codes");
    let response;
    if (id) {
      response = await findCountryById(id);
    } else if (code && name) {
      response = await findCountry(code.toLowerCase(), name);
    } else if (code) {
      response = await findCountry(code.toLowerCase());
    } else if (name) {
      response = await findCountryByName(name);
    } else if (codes) {
      response = await getAllCountries(codes.split(","));
    } else {
      response = await getAllCountries();
    }

    return apiSuccess(response);
  } catch (err: any) {
    return apiError(err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's an array for bulk insert
    let response;

    if (Array.isArray(body)) {
      response = await createCountries(body);
    } else {
      // Single country insert
      response = await createCountry(body);
    }

    return apiSuccess(response);
  } catch (err: any) {
    return apiError(err);
  }
}
