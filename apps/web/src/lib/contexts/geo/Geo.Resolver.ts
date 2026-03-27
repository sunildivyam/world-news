import { geoService } from "@worldnews/shared/server";
import { GeoContext } from "@worldnews/shared/types";
import { NextRequest } from "next/server";

export async function resolveGeoContext(
  request: NextRequest,
): Promise<GeoContext> {
  const l = (request.headers.get("accept-language") || "").toLowerCase();
  const language = await geoService.getLanguageCode(l);
  const country = (
    request.headers.get("x-vercel-ip-country") || ""
  ).toLowerCase();
  const region = (
    request.headers.get("x-vercel-ip-country-region") || ""
  ).toLowerCase();
  const city = (request.headers.get("x-vercel-ip-city") || "").toLowerCase();
  const ip = (request.headers.get("x-forwarded-for") || "").toLowerCase();

  return {
    country,
    region,
    city,
    ip,
    language,
  };
}
