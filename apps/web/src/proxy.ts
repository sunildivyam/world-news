import { NextRequest, NextResponse } from "next/server";
import { resolveUserContext } from "./lib/contexts/user/UserContext.Resolver";
import { buildCanonicalPath } from "./lib/contexts/route-segments/RouteSegments.Service";
import { setResponseHeadersWithUserContext } from "./lib/contexts/user/UserContext.service";
import { isInvalidPath } from "@worldnews/shared/seo/isInvalidPath";
import { isDomainRobotsTxt } from "@worldnews/shared/seo/robots";
import { isDomainNotFoundPage } from "@worldnews/shared/seo/not-found";
import { isDomainSitemap } from "@worldnews/shared/seo/sitemaps/sitemap-utils";

export async function proxy(request: NextRequest) {
  // const pathname = (request.nextUrl.pathname || "").toLowerCase();
  try {
    const pathname = request.nextUrl.pathname || "";
    const host = (request.nextUrl.host || "").toLowerCase();
    const headers = request.headers;
    const cookies = request.cookies;

    // if a file with extension is requested, it should be rejected
    if (isInvalidPath(pathname, [".xml", ".txt"])) {
      const url = new URL("/not-found", request.url);
      return NextResponse.redirect(url);
    }

    console.log("Invalid Path Check");
    const userCtx = await resolveUserContext(host, pathname, headers, cookies);
    console.log("User Context resolved");

    // If tenantId is missing, redirect to global error page
    if (!userCtx.tenantId && pathname !== "/not-found") {
      const url = new URL("/not-found", request.url);
      return NextResponse.redirect(url);
    }

    console.log("Tenant Id Check done");
    // If not-found page is requested
    const domainNotFoundPage = isDomainNotFoundPage(
      userCtx.tenantId || "",
      userCtx.domain || "",
      pathname,
      host,
    );

    if (domainNotFoundPage) {
      const url = new URL(domainNotFoundPage, request.url);
      const res = NextResponse.rewrite(url);
      setResponseHeadersWithUserContext(res, userCtx);
      return res;
    }

    console.log("Not Found Page Checked");

    // If sitemap.xml is requested
    const sitemapUrl = isDomainSitemap(
      userCtx.tenantId || "",
      userCtx.domain || "",
      pathname,
      host,
    );

    if (sitemapUrl) {
      const url = new URL(sitemapUrl, request.url);

      const res = NextResponse.rewrite(url);
      return res;
    }

    console.log("isDomainSitemap() done");
    // If robots.txt is requested
    const robotsTxtUrl = isDomainRobotsTxt(
      userCtx.tenantId || "",
      userCtx.domain || "",
      pathname,
      host,
    );

    if (robotsTxtUrl) {
      const url = new URL(robotsTxtUrl, request.url);
      const res = NextResponse.rewrite(url);
      return res;
    }

    console.log("isDomainRobotsTxt() done");

    const canonical = buildCanonicalPath(userCtx);

    if (pathname !== canonical) {
      const url = new URL(canonical, request.url);

      return NextResponse.redirect(url);
    }
    console.log("Canonical done");
    const res = NextResponse.next();
    setResponseHeadersWithUserContext(res, userCtx, pathname);
    console.log("Header Setting done");

    return res;
  } catch (error) {
    console.log("PROXY ERROR");
    console.log(error);
    const url = new URL("/not-founds/annuadvent", request.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  // matcher: [
  //   "/((?!_next|api|sitemaps|sitemap.xml|favicon.ico|not-found|robots.txt|.*\\..*).*)",
  // ],
  matcher: [
    "/((?!_next|.well-known|api|sitemaps|robots|not-founds|favicon.ico).*)",
  ],
};
