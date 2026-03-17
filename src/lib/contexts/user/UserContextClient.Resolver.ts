"use client";

import { UserContext } from "./UserContext.interface";
import { resolveLanguageContext } from "../language/Language.Resolver";
import { resolveRouteSegmentsContext } from "../route-segments/RouteSegments.Resolver";
import { findTenantFromSegments } from "../tenant/Tenant.validators";

export function getUrlSegments() {
  const { pathname } = (window && window?.location) || {};
  // Remove leading/trailing slashes and split by "/"
  return pathname.replace(/^\/|\/$/g, "").split("/");
}

export async function setUserContextToRequestHeaders(
  req: Request,
  userCtx: UserContext | null,
) {
  if (!userCtx) return;
  req.headers.set("x-user-tenant-id", userCtx.tenantId ?? "");
  req.headers.set("x-user-country", userCtx.geo?.country ?? "");
  req.headers.set("x-user-region", userCtx.geo?.region ?? "");
  req.headers.set("x-user-city", userCtx.geo?.city ?? "");
  req.headers.set("x-user-language", userCtx.language ?? "");
  req.headers.set("x-user-page-type", userCtx.pageType ?? "");
  req.headers.set("x-user-page-id", userCtx.pageId ?? "");
}

export async function resolveUserContextClient(
  segments: Array<string>,
): Promise<UserContext> {
  const routeSegmentsCtx = await resolveRouteSegmentsContext(segments);
  const tenantCtx = await findTenantFromSegments(segments);
  routeSegmentsCtx.tenantId = tenantCtx?.tenant?.id;
  const langCtx = await resolveLanguageContext(
    routeSegmentsCtx.language,
    tenantCtx?.language || "",
    "",
  );

  const userContext: UserContext = {
    // sessionId: h.get("x-session-id") || c.get("x-session-id")?.value,
    tenantId: tenantCtx?.tenant?.id,
    geo: {
      country: routeSegmentsCtx.country ?? tenantCtx?.geo.country,
      region: routeSegmentsCtx.region ?? tenantCtx?.geo.region,
      city: routeSegmentsCtx.city ?? tenantCtx?.geo.city,
      ip: tenantCtx?.geo.ip,
    },
    language: langCtx,
    pageType: routeSegmentsCtx.pageType,
    pageId: routeSegmentsCtx.pageId,
  };

  return userContext;
}

export const resolveUserContextFromLocalstorage = (): UserContext | null => {
  if (typeof window !== "undefined" && window.localStorage) {
    const ctxStr = window.localStorage.getItem("userContext") || "";
    try {
      const ctx = JSON.parse(ctxStr);
      return ctx as UserContext;
    } catch (error) {
      return null;
    }
  }
  return null;
};
