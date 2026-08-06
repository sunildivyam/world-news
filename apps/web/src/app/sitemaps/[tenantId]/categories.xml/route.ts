// Global Home - sitemap.xml
import {
  formatSitemapResponse,
  generateTenantCategoriesSitemap,
  SITEMAP_CACHE,
} from "@worldnews/shared/seo/sitemaps";

import {
  fetchCountries,
  fetchTenant,
  fetchTenantCategories,
} from "@worldnews/shared/news-engine-apis";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  const tenantId = (await params).tenantId;
  const tenant = await fetchTenant(tenantId);
  const domain = tenant?.domain;

  const [countries, categories] = await Promise.all([
    fetchCountries(tenant?.country),
    fetchTenantCategories(tenantId),
  ]);

  const sitemapXml = generateTenantCategoriesSitemap(
    domain!,
    countries,
    categories || [],
  );

  return formatSitemapResponse(sitemapXml, SITEMAP_CACHE.CATEGORIES);
}
