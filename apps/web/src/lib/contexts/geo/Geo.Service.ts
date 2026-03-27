import { GeoContext } from "@worldnews/shared/types";
import { headers } from "next/headers";

export const getGeoContext = async (): Promise<GeoContext> => {
  const h = await headers();
  const country = (h.get("x-user-country") ?? "").toLowerCase();
  const region = (h.get("x-user-region") ?? "").toLowerCase();
  const city = (h.get("x-user-city") ?? "").toLowerCase();
  const ip = (h.get("x-user-ip") ?? "").toLowerCase();
  const language = (h.get("x-user-language") || "").toLowerCase();

  const geo: GeoContext = {
    country,
    region,
    city,
    ip,
    language,
  };

  return geo;
};
