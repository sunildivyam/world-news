import { UserContext } from "../user/UserContext.interface";

export function buildCanonicalPath(ctx: UserContext) {
  const parts = ctx.domain ? [] : [ctx.tenantId];

  if (ctx.geo?.country) parts.push(ctx.geo?.country);

  if (ctx.geo?.region) parts.push(ctx.geo?.region);

  if (ctx.geo?.city) parts.push(ctx.geo?.city);

  parts.push(ctx.language);

  if (ctx.pageType && ctx.pageId) {
    parts.push(ctx.pageType);
    parts.push(ctx.pageId);
  } else if (!ctx.pageType && ctx.pageId) {
    parts.push(ctx.pageId);
  }

  return "/" + parts.join("/");
}
