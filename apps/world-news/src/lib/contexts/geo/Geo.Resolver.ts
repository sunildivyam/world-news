import { GeoContext } from "@worldnews/shared";
import { NextRequest } from "next/server";
import { parseLanguageCode } from "../language/Language.parser";

export function resolveGeoContext(request: NextRequest): GeoContext {
  const language = request.headers.get("accept-language") || undefined;

  return {
    country: request.headers.get("x-vercel-ip-country") || undefined,
    region: request.headers.get("x-vercel-ip-country-region") || undefined,
    city: request.headers.get("x-vercel-ip-city") || undefined,
    ip: request.headers.get("x-forwarded-for") || undefined,
    language: parseLanguageCode(language) || undefined,
  };
}
