import {
  Article,
  ArticleCollection,
  ArticleQueryParams,
  GeoContext,
  Tenant,
  UserContext,
} from "@worldnews/shared/types";
import {
  formatSitemapResponse,
  generateTenantNewsSitemap,
  SITEMAP_CACHE,
} from "@worldnews/shared/seo/sitemaps";

import {
  fetchLatestArticles,
  fetchTenant,
  fetchTenantCategories,
} from "@worldnews/shared/news-engine-apis";
import { EXTERNAL_ARTICLES_MODE } from "@/app-constants/app-constants";
import { fetchArticles } from "@/lib/news-service";
import { encodeObjectToId } from "@worldnews/shared/utils/encryptUrl";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  let sitemapXml = "";
  const tenantId = (await params).tenantId;
  const tenant = await fetchTenant(tenantId);
  const domain = tenant?.domain;
  let articles: Article[] = [];
  if (!tenant) return formatSitemapResponse(sitemapXml, 0);

  if (EXTERNAL_ARTICLES_MODE) {
    articles = await getExternalNewsArticles(tenant);
  } else {
    articles = await getInternalNewsArticles(tenantId);
  }

  sitemapXml = generateTenantNewsSitemap(
    domain!,
    tenant?.name || "",
    tenant?.country && tenant?.country[0],
    articles,
  );

  return formatSitemapResponse(sitemapXml, SITEMAP_CACHE.NEWS);
}

async function getExternalNewsArticles(tenant: Tenant): Promise<Article[]> {
  const newsArticles: Article[] = [];
  const userContext: UserContext = {
    geo: {
      country: (tenant.country && tenant.country[0]) || "in",
      language: (tenant.language && tenant.language[0]) || "en",
    } as GeoContext,
  };

  const categories = await fetchTenantCategories(tenant.tenantId).catch(
    (err) => {
      return null;
    },
  );

  if (!categories) return [];

  for (let i = 0; i < categories?.length; i++) {
    const cat = categories[i];
    const slug = cat.name;
    const fetchOptions: ArticleQueryParams = {
      category: [slug],
    };

    const articleCollection = await fetchArticles(
      userContext,
      fetchOptions,
    ).catch(() => null);
    const articles = articleCollection?.articles || [];
    articles.forEach((article) => {
      const slug = encodeObjectToId(article);
      newsArticles.push({ ...article, slug });
    });
  }

  return newsArticles;
}

async function getInternalNewsArticles(tenantId: string): Promise<Article[]> {
  let newsArticles: Article[] = [];
  const articlesCollection: ArticleCollection | null =
    await fetchLatestArticles({
      tenantId: tenantId,
      hours: 48,
      limit: 1000,
      page: 1,
      fields: ["slug", "title", "description", "url"],
    }).catch((err) => {
      return null;
    }); // 2 Days

  if (articlesCollection) {
    newsArticles = articlesCollection.articles;
  }

  return newsArticles;
}
