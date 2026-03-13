import { headers, cookies } from "next/headers";
import {
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
} from "@/app-constants/app-constants";
import { GeoContext } from "@/types/GeoContext.interface";
import { UserContext } from "@/types/UserContext.interface";

export async function buildGeoContextFromVarcel(): Promise<GeoContext> {
  const h = await headers();
  const geo: GeoContext = {
    country: h.get("x-vercel-ip-country") ?? DEFAULT_COUNTRY,
    region: h.get("x-vercel-ip-country-region") ?? undefined,
    city: h.get("x-vercel-ip-city") ?? undefined,
    ip: h.get("x-forwarded-for") ?? undefined,
    language: extractLanguage(h.get("accept-language")),
  };

  return geo;
}

export async function buildUserContextFromVarcel(): Promise<UserContext> {
  const h = await headers();
  const c = await cookies();

  const userContext: UserContext = {
    geo: await buildGeoContextFromVarcel(),
    sessionId: h.get("x-session-id") || c.get("x-session-id")?.value,
  };

  return userContext;
}

export const getGeoContext = async (): Promise<GeoContext> => {
  const h = await headers();
  const geo: GeoContext = {
    country: h.get("x-user-country") ?? DEFAULT_COUNTRY,
    region: h.get("x-user-region") ?? undefined,
    city: h.get("x-user-city") ?? undefined,
    ip: h.get("x-user-ip") ?? undefined,
    language: h.get("x-user-language") || DEFAULT_LANGUAGE,
  };

  return geo;
};

export const getUserContext = async (): Promise<UserContext> => {
  const h = await headers();
  return {
    sessionId: h.get("x-session-id") ?? undefined,
    geo: await getGeoContext(),
  } as UserContext;
};

// Private function
function extractLanguage(language: string | null) {
  if (!language) return DEFAULT_LANGUAGE;

  const primary = language.split(",")[0];
  const lang = primary.split("-")[0];

  return lang || DEFAULT_LANGUAGE;
}
