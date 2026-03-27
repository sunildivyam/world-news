/* eslint-disable @typescript-eslint/no-explicit-any */

import { GeoContext } from "@worldnews/shared";
import { updateCountryByGeo } from "@worldnews/shared/mongo/collections/countries";
import { error } from "@worldnews/shared/mongo/response";

export async function POST(request: Request) {
  try {
    const geoCtx: GeoContext = await request.json();
    const { country, region, city, language } = geoCtx;

    const result = await updateCountryByGeo(country, region, city, language);
    return result;
  } catch (err: any) {
    return error(err?.message || err, 500);
  }
}
