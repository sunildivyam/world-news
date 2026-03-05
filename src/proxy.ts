import { NextRequest, NextResponse } from "next/server";
import { buildUserContext } from "./lib/news/context";

export async function proxy(request: NextRequest) {
  const headers = request.headers;
  const userContext = await buildUserContext();

  const requestHeaders = new Headers(headers);
  console.log("PROXY Session ID: ", userContext.sessionId);
  requestHeaders.set("x-session-id", userContext.sessionId);
  requestHeaders.set("x-user-country", userContext.country || "us");
  requestHeaders.set("x-user-region", userContext.region || "");
  requestHeaders.set("x-user-city", userContext.city || "");
  requestHeaders.set("x-user-ip", userContext.ip || "");
  requestHeaders.set("x-user-language", userContext.language);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
