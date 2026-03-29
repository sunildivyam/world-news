import { NextRequest, NextResponse } from "next/server";
import { resolveUserContext } from "./lib/contexts/user/UserContext.Resolver";
import { buildCanonicalPath } from "./lib/contexts/route-segments/RouteSegments.Service";
import { setResponseHeadersWithUserContext } from "./lib/contexts/user/UserContext.service";
import {
  isInvalidPath,
  isDomainRobotsTxt,
  isDomainSitemap,
  isDomainNotFoundPage,
} from "@worldnews/shared/seo";

export async function proxy(request: NextRequest) {
  const current = request.nextUrl.pathname;
  const host = (request.nextUrl.host || "").toLowerCase();
  console.log("Cur:", current);

  // if a file with extension is requested, it should be rejected
  if (isInvalidPath(current, [".xml", ".txt"])) {
    const url = new URL("/not-found", request.url);
    return NextResponse.redirect(url);
  }

  const userCtx = await resolveUserContext(request);

  // If tenantId is missing, redirect to global error page
  if (!userCtx.tenantId && current !== "/not-found") {
    const url = new URL("/not-found", request.url);
    return NextResponse.redirect(url);
  }

  // If not-found page is requested
  const domainNotFoundPage = isDomainNotFoundPage(
    userCtx.tenantId || "",
    userCtx.domain || "",
    current,
    host,
  );

  if (domainNotFoundPage) {
    const url = new URL(domainNotFoundPage, request.url);
    const res = NextResponse.rewrite(url);
    setResponseHeadersWithUserContext(res, userCtx);
    return res;
  }

  // If sitemap.xml is requested
  const sitemapUrl = isDomainSitemap(
    userCtx.tenantId || "",
    userCtx.domain || "",
    current,
    host,
  );

  if (sitemapUrl) {
    const url = new URL(sitemapUrl, request.url);
    const res = NextResponse.rewrite(url);
    return res;
  }

  // If robots.txt is requested
  const robotsTxtUrl = isDomainRobotsTxt(
    userCtx.tenantId || "",
    userCtx.domain || "",
    current,
    host,
  );

  if (robotsTxtUrl) {
    const url = new URL(robotsTxtUrl, request.url);
    const res = NextResponse.rewrite(url);
    return res;
  }

  const canonical = buildCanonicalPath(userCtx);

  console.log(
    "Proxy - CustomD: ",
    userCtx.domain,
    " | T: ",
    userCtx.tenantId,
    " | C Url: ",
    current,
    " | Cano Url: ",
    canonical,
  );

  if (current !== canonical) {
    const url = new URL(canonical, request.url);

    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  setResponseHeadersWithUserContext(res, userCtx);

  return res;
}

export const config = {
  // matcher: [
  //   "/((?!_next|api|sitemaps|sitemap.xml|favicon.ico|not-found|robots.txt|.*\\..*).*)",
  // ],
  matcher: ["/((?!_next|api|sitemaps|robots|not-founds|favicon.ico).*)"],
};
