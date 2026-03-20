import { headers } from "next/headers";

import { UserContext } from "@worldnews/shared";
import { getGeoContext } from "../geo/Geo.Service";
import { NextResponse } from "next/server";

export const getUserContext = async (): Promise<UserContext> => {
  const h = await headers();
  return {
    tenantId: h.get("x-user-tenant-id") ?? undefined,
    domain: h.get("x-user-domain") ?? undefined,
    sessionId: h.get("x-session-id") ?? undefined,
    language: h.get("x-user-language") ?? undefined,
    pageType: h.get("x-user-page-type") ?? undefined,
    pageId: h.get("x-user-page-id") ?? undefined,
    geo: { ...(await getGeoContext()) },
  } as UserContext;
};

export const setResponseHeadersWithUserContext = (
  res: NextResponse<unknown>,
  userCtx: UserContext,
): void => {
  res.headers.set("x-session-id", userCtx.sessionId ?? "");
  res.headers.set("x-user-tenant-id", userCtx.tenantId ?? "");
  res.headers.set("x-user-domain", userCtx.domain ?? "");
  res.headers.set("x-user-country", userCtx.geo?.country ?? "");
  res.headers.set("x-user-region", userCtx.geo?.region ?? "");
  res.headers.set("x-user-city", userCtx.geo?.city ?? "");
  res.headers.set("x-user-ip", userCtx.geo?.ip ?? "");
  res.headers.set("x-user-language", userCtx.language ?? "");
  res.headers.set("x-user-page-type", userCtx.pageType ?? "");
  res.headers.set("x-user-page-id", userCtx.pageId ?? "");
};
