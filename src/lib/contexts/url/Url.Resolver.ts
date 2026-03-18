import { PageTypeEnum } from "@/types/PageType.enum";
import { UserContext } from "../user/UserContext.interface";
import { Article } from "@/types/Article.interface";

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
    userCtx?.domain ? "" : article.tenant?.id || userCtx?.tenantId,
    article.geo?.country || userCtx?.geo?.country,
    article.geo?.region || userCtx?.geo?.region,
    article.geo?.city || userCtx?.geo?.city,
    article.language || userCtx?.geo?.language,
    PageTypeEnum.article,
    article.slug,
  ].filter(Boolean);
  return `/${segments.join("/")}`;
}
