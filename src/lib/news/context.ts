import { headers, cookies } from "next/headers";
// import { randomUUID } from "crypto";
import { UserContext } from "./types";
import { DEFAULT_LANGUAGE } from "@/app-constants";

function extractLanguage(language: string | null) {
  if (!language) return DEFAULT_LANGUAGE;

  const primary = language.split(",")[0];
  const lang = primary.split("-")[0];

  return lang || DEFAULT_LANGUAGE;
}

export async function buildUserContext(
  languageFromUrl?: string,
): Promise<UserContext> {
  const h = await headers();
  const c = await cookies();

  const sessionId =
    (h.get("x-session-id") || c.get("x-session-id")?.value) ??
    globalThis.crypto.randomUUID();
  const country = h.get("x-vercel-ip-country") ?? "us";
  const region = h.get("x-vercel-ip-country-region") ?? undefined;
  const city = h.get("x-vercel-ip-city") ?? undefined;
  const ip = h.get("x-forwarded-for") ?? undefined;
  let language = languageFromUrl || h.get("accept-language");
  language = extractLanguage(language);

  return {
    country,
    region,
    city,
    language,
    ip,
    sessionId,
  };
}

export const getUserContext = async (): Promise<UserContext> => {
  const h = await headers();
  return {
    sessionId: h.get("x-session-id"),
    country: h.get("x-user-country"),
    region: h.get("x-user-region"),
    city: h.get("x-user-city"),
    ip: h.get("x-user-ip"),
    language: h.get("x-user-language"),
  } as UserContext;
};
