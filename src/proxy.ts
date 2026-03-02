import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LANGUAGE = "en";

function extractLanguage(acceptLanguage: string | null) {
  if (!acceptLanguage) return DEFAULT_LANGUAGE;

  const primary = acceptLanguage.split(",")[0];
  const lang = primary.split("-")[0];

  return lang || DEFAULT_LANGUAGE;
}

export function proxy(request: NextRequest) {
  const headers = request.headers;

  // Extract from Vercel headers
  const country = headers.get("x-vercel-ip-country") || "US";
  const region = headers.get("x-vercel-ip-country-region") || "";
  const city = headers.get("x-vercel-ip-city") || "";
  const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";

  const acceptLanguage = headers.get("accept-language");
  const language = extractLanguage(acceptLanguage);

  const requestHeaders = new Headers(headers);

  requestHeaders.set("x-user-country", country);
  requestHeaders.set("x-user-region", region);
  requestHeaders.set("x-user-city", city);
  requestHeaders.set("x-user-ip", ip);
  requestHeaders.set("x-user-language", language);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
