import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const geo = request;

  const country = geo?.country || "US";
  const region = geo?.region || "";
  const city = geo?.city || "";
  const ip = request.ip || "";
  const language =
    request.headers.get("accept-language")?.split(",")[0] || "en";

  const requestHeaders = new Headers(request.headers);

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
  matcher: "/:path*",
};
