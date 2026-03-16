import { NextRequest, NextResponse } from "next/server";
import { resolveUserContext } from "./lib/contexts/user/UserContext.Resolver";
import { buildCanonicalPath } from "./lib/contexts/route-segments/RouteSegments.Service";

export async function proxy(request: NextRequest) {
  const current = request.nextUrl.pathname;
  const userCtx = await resolveUserContext(request);

  // If tenantId is missing, redirect to global error page
  if (!userCtx.tenantId) {
    const url = new URL("/not-found", request.url);
    return NextResponse.redirect(url);
  }

  const canonical = buildCanonicalPath(userCtx);

  if (current !== canonical) {
    const url = new URL(canonical, request.url);

    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();

  res.headers.set("x-session-id", userCtx.sessionId ?? "");
  res.headers.set("x-user-tenant-id", userCtx.tenantId ?? "");
  res.headers.set("x-user-country", userCtx.geo?.country ?? "");
  res.headers.set("x-user-region", userCtx.geo?.region ?? "");
  res.headers.set("x-user-city", userCtx.geo?.city ?? "");
  res.headers.set("x-user-ip", userCtx.geo?.ip ?? "");
  res.headers.set("x-user-language", userCtx.language ?? "");
  res.headers.set("x-user-page-type", userCtx.pageType ?? "");
  res.headers.set("x-user-page-id", userCtx.pageId ?? "");

  return res;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|not-found).*)"],
};
