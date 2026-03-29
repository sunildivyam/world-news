import { geoService } from "@worldnews/shared/server";
import { GeoContext } from "@worldnews/shared/types";

export async function resolveGeoContext(
  headers: Headers,
): Promise<GeoContext> {
  const l = (headers.get("accept-language") || "").toLowerCase();
  const language = await geoService.getLanguageCode(l);
  const country = (headers.get("x-vercel-ip-country") || "").toLowerCase();
  const region = (
    headers.get("x-vercel-ip-country-region") || ""
  ).toLowerCase();
  const city = (headers.get("x-vercel-ip-city") || "").toLowerCase();
  const ip = (headers.get("x-forwarded-for") || "").toLowerCase();

  return {
    country,
    region,
    city,
    ip,
    language,
  };
}
