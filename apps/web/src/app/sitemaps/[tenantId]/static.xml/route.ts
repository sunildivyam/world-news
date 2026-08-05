// Global Home - sitemap.xml
import {
  formatSitemapResponse,
  generateTenantStaticSitemap,
  SITEMAP_CACHE,
} from "@worldnews/shared/seo/sitemaps";

import {
  fetchCountries,
  fetchTenant,
} from "@worldnews/shared/news-engine-apis";
import { staticPages } from "@/app-constants/staticPages.constant";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  const tenantId = (await params).tenantId;
  const tenant = await fetchTenant(tenantId);
  const domain = tenant?.domain;
  const countries = await fetchCountries(tenant?.country);

  const sitemapXml = generateTenantStaticSitemap(
    domain!,
    countries,
    staticPages,
  );

  return formatSitemapResponse(sitemapXml, SITEMAP_CACHE.STATIC);
}
