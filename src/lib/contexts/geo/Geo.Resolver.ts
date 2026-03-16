import { GeoContext } from "@/lib/contexts/geo/GeoContext.interface";
import { NextRequest } from "next/server";

export function resolveGeoContext(request: NextRequest): GeoContext {
  return {
    country: request.headers.get("x-vercel-ip-country") || undefined,
    region: request.headers.get("x-vercel-ip-country-region") || undefined,
    city: request.headers.get("x-vercel-ip-city") || undefined,
    ip: request.headers.get("x-forwarded-for") || undefined,
  };
}
