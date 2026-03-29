import { UserContext } from "@worldnews/shared/types";
import { resolveGeoContext } from "../geo/Geo.Resolver";
import { resolveTenantContext } from "../tenant/Tenant.Resolver";
import { resolveLanguageContext } from "../language/Language.Resolver";
import { resolveRouteSegmentsContext } from "../route-segments/RouteSegments.Resolver";
import { geoService } from "@worldnews/shared/server";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

export async function resolveUserContext(
  host: string,
  pathname: string,
  headers: Headers,
  cookies: RequestCookies,
): Promise<UserContext> {
  const routeSegmentsCtx = await resolveRouteSegmentsContext(pathname);
  const geoCtx = await resolveGeoContext(headers);
  // Add Geo to countries DB, if not already there, this should not wait
  geoService
    .addGeotoDB({ ...geoCtx })
    .then(() => console.log("Geo Saved To DB"))
    .catch((err) => console.log("Error Saving Geo: ", err.message));

  const tenantCtx = await resolveTenantContext(host, pathname);
  routeSegmentsCtx.tenantId = tenantCtx?.tenant?.tenantId;
  const langCtx = await resolveLanguageContext(
    routeSegmentsCtx.language,
    tenantCtx?.language || "",
    geoCtx.language || "",
  );

  const userContext: UserContext = {
    sessionId:
      headers.get("x-session-id") || cookies.get("x-session-id")?.value,
    tenantId: tenantCtx?.tenant?.tenantId,
    domain: tenantCtx?.domain,
    geo: {
      country:
        routeSegmentsCtx.country ?? geoCtx.country ?? tenantCtx?.geo.country,
      region: routeSegmentsCtx.region ?? geoCtx.region ?? tenantCtx?.geo.region,
      city: routeSegmentsCtx.city ?? geoCtx.city ?? tenantCtx?.geo.city,
      ip: geoCtx.ip ?? tenantCtx?.geo.ip,
    },
    language: langCtx,
    pageType: routeSegmentsCtx.pageType,
    pageId: routeSegmentsCtx.pageId,
  };

  return userContext;
}
