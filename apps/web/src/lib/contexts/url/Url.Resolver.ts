import { PageTypeEnum } from "@worldnews/shared/types";
import { UserContext } from "@worldnews/shared/types";
import { Article } from "@worldnews/shared/types";

export const resolveHomeUrl = (userCtx: UserContext | null): string => {
  if (!userCtx) return "";

  const segments = [
    userCtx.domain ? "" : userCtx.tenantId,
    userCtx.geo?.country,
    userCtx.geo?.region,
    userCtx.geo?.city,
    userCtx.language,
  ].filter(Boolean);
  return `/${segments.join("/")}`;
};

export const resolveUrl = (
  userCtx: UserContext | null,
  pageType?: PageTypeEnum,
  pageId?: string,
): string => {
  if (!userCtx) return "";
  const homeUrl = resolveHomeUrl(userCtx);
  const segments = [pageType, pageId].filter(Boolean);
  return `${homeUrl}/${segments.join("/")}`;
};

export function resolveUrlFromArticle(
  article: Article,
  userCtx?: UserContext,
): string {
  const segments = [
    userCtx?.domain ? "" : userCtx?.tenantId || article.tenantId,
    article.geo?.country || userCtx?.geo?.country,
    article.geo?.region || userCtx?.geo?.region,
    article.geo?.city || userCtx?.geo?.city,
    article.language || userCtx?.geo?.language,
    PageTypeEnum.article,
    article.slug,
  ].filter(Boolean);
  return `/${segments.join("/")}`;
}
