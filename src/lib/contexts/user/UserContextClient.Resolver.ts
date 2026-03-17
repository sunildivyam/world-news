"use client";

import { UserContext } from "./UserContext.interface";

export async function setUserContextToRequestHeaders(
  req: Request,
  userCtx?: UserContext,
) {
  if (!userCtx) return;
  req.headers.set("x-user-tenant-id", userCtx.tenantId ?? "");
  req.headers.set("x-user-domain", userCtx.domain ?? "");
  req.headers.set("x-user-country", userCtx.geo?.country ?? "");
  req.headers.set("x-user-region", userCtx.geo?.region ?? "");
  req.headers.set("x-user-city", userCtx.geo?.city ?? "");
  req.headers.set("x-user-language", userCtx.language ?? "");
  req.headers.set("x-user-page-type", userCtx.pageType ?? "");
  req.headers.set("x-user-page-id", userCtx.pageId ?? "");
}
