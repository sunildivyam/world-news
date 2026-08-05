import { Article, ArticleCollection } from "@worldnews/shared/types";

import {
  fetchCountries,
  fetchLatestArticles,
  fetchTenant,
} from "@worldnews/shared/news-engine-apis";
import {
  ARTICLE_PAGE_LIMIT,
  formatSitemapResponse,
  generateTenantArticlesSitemap,
  SITEMAP_CACHE,
} from "@worldnews/shared/seo/sitemaps";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tenantId: string; page: string }> },
) {
  const pathParams = await params;

  const tenantId = pathParams.tenantId;
  const pageNo = Number(pathParams.page.split(".")[0]);
  const tenant = await fetchTenant(tenantId);
  const domain = tenant?.domain;
  const countries = await fetchCountries(tenant?.country);
  const articlesCollection: ArticleCollection | null =
    await fetchLatestArticles({
      tenantId: tenantId,
      hours: 200 * 24,
      limit: ARTICLE_PAGE_LIMIT,
      page: pageNo,
      fields: ["slug", "updatedAt"],
    }).catch((err) => {
      return null;
    }); // 10 Days

  let articles: Article[] = [];
  if (articlesCollection) {
    articles = articlesCollection.articles;
  }

  const sitemapXml = generateTenantArticlesSitemap(
    domain || "",
    countries[0],
    articles,
  );

  return formatSitemapResponse(sitemapXml, SITEMAP_CACHE.ARTICLES);
}
