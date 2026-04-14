/* eslint-disable @typescript-eslint/no-explicit-any */

import { apiError, apiSuccess } from "@/lib/api-response";
import { GeoContext } from "@worldnews/shared";
import { updateCountryByGeo } from "@worldnews/shared/mongo/collections/countries";

export async function POST(request: Request) {
  try {
    const geoCtx: GeoContext = await request.json();
    const { country, region, city, language } = geoCtx;

    const result = await updateCountryByGeo(country, region, city, language);
    return apiSuccess(result);
  } catch (err: any) {
    return apiError(err);
  }
}
