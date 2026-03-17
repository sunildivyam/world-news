import { NextRequest } from "next/server";
import { UserContext } from "./UserContext.interface";
import { resolveGeoContext } from "../geo/Geo.Resolver";
import { resolveTenantContext } from "../tenant/Tenant.Resolver";
import { resolveLanguageContext } from "../language/Language.Resolver";
import { resolveRouteSegmentsContext } from "../route-segments/RouteSegments.Resolver";

export async function resolveUserContext(
  request: NextRequest,
): Promise<UserContext> {
  const h = request.headers;
  const c = request.cookies;
  const routeSegmentsCtx = await resolveRouteSegmentsContext(request);
  const geoCtx = await resolveGeoContext(request);
  const tenantCtx = await resolveTenantContext(request);
  routeSegmentsCtx.tenantId = tenantCtx?.tenant?.id;
  const langCtx = await resolveLanguageContext(
    routeSegmentsCtx.language,
    tenantCtx?.language || "",
    geoCtx.language || "",
  );

  const userContext: UserContext = {
    sessionId: h.get("x-session-id") || c.get("x-session-id")?.value,
    tenantId: tenantCtx?.tenant?.id,
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
