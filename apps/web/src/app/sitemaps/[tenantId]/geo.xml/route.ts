import {
  formatSitemapResponse,
  generateTenantGeoSitemap,
  SITEMAP_CACHE,
} from "@worldnews/shared/seo/sitemaps";

import {
  fetchCountries,
  fetchTenant,
} from "@worldnews/shared/news-engine-apis";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  const tenantId = (await params).tenantId;
  const tenant = await fetchTenant(tenantId);
  const domain = tenant?.domain;
  const countries = await fetchCountries(tenant?.country);

  const sitemapXml = generateTenantGeoSitemap(domain!, countries);

  return formatSitemapResponse(sitemapXml, SITEMAP_CACHE.GEO);
}
