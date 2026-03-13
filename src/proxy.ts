import { NextRequest, NextResponse } from "next/server";
import { buildUserContextFromVarcel } from "./lib/UserContext.service";

export async function proxy(request: NextRequest) {
  const headers = request.headers;
  const userContext = await buildUserContextFromVarcel();
  const { geo } = userContext;

  const requestHeaders = new Headers(headers);
  requestHeaders.set("x-session-id", userContext.sessionId!);
  requestHeaders.set("x-user-country", geo?.country!);
  requestHeaders.set("x-user-region", geo?.region!);
  requestHeaders.set("x-user-city", geo?.city!);
  requestHeaders.set("x-user-ip", geo?.ip!);
  requestHeaders.set("x-user-language", geo?.language!);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
