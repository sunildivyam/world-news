import { NextRequest, NextResponse } from "next/server";
import { resolveUserContext } from "./lib/contexts/user/UserContext.Resolver";
import { buildCanonicalPath } from "./lib/contexts/route-segments/RouteSegments.Service";
import { setResponseHeadersWithUserContext } from "./lib/contexts/user/UserContext.service";

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
  setResponseHeadersWithUserContext(res, userCtx);

  return res;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|not-found).*)"],
};
