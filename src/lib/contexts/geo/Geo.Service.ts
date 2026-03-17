import { GeoContext } from "@/lib/contexts/geo/GeoContext.interface";
import { headers } from "next/headers";

export const getGeoContext = async (): Promise<GeoContext> => {
  const h = await headers();
  const geo: GeoContext = {
    country: h.get("x-user-country") ?? undefined,
    region: h.get("x-user-region") ?? undefined,
    city: h.get("x-user-city") ?? undefined,
    ip: h.get("x-user-ip") ?? undefined,
    language: h.get("x-user-language") || undefined,
  };

  return geo;
};
