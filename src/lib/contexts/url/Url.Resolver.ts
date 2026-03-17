import { PageTypeEnum } from "@/types/PageType.enum";
import { UserContext } from "../user/UserContext.interface";
import { Article } from "@/types/Article.interface";

export const resolveUrl = (
  userCtx: UserContext | null,
  pageType?: PageTypeEnum,
  pageId?: string,
): string => {
  if (!userCtx) return "";

  const segments = [
    userCtx.tenantId,
    userCtx.geo?.country,
    userCtx.geo?.region,
    userCtx.geo?.city,
    userCtx.language,
    pageType,
    pageId,
  ].filter(Boolean);
  return `/${segments.join("/")}`;
};

export function resolveUrlFromArticle(article: Article): string {
  const segments = [
    article.tenant?.id,
    article.geo?.country,
    article.geo?.region,
    article.geo?.city,
    article.language,
    PageTypeEnum.article,
    article.slug,
  ].filter(Boolean);
  return `/${segments.join("/")}`;
}
