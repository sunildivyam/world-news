// Global Home - sitemap.xml
import {
  formatSitemapResponse,
  generateTenantSitemapIndex,
  SITEMAP_CACHE,
} from "@worldnews/shared/seo/sitemaps";

import { fetchTenant } from "@worldnews/shared/news-engine-apis";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  const tenantId = (await params).tenantId;
  const tenant = await fetchTenant(tenantId);
  const domain = tenant?.domain;

  // TODO: fetchTotal Articles Count in the database
  // const totalArticlesCount = await getTenantArticlesCount(tenantId);
  const totalArticlesCount = 2000;
  const sitemapIndexXml = generateTenantSitemapIndex(
    domain!,
    totalArticlesCount,
  );

  return formatSitemapResponse(sitemapIndexXml, SITEMAP_CACHE.ROOT);
}
