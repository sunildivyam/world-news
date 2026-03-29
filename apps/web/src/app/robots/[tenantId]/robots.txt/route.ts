// Global Home - sitemap.xml
import { CACHE_1_WEEK } from "@worldnews/shared/seo";
import { fetchTenant } from "@worldnews/shared/news-engine-apis";
export const dynamic = "force-dynamic";
export const revalidate = CACHE_1_WEEK;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  const tenantId = (await params).tenantId;
  const tenant = await fetchTenant(tenantId);
  const domain = tenant?.domain;

  const txt = `User-agent: *
  Allow: /
  Disallow: /admin
  Disallow: /api
  User-agent: Googlebot-News
  Allow: /
  Sitemap: https://${domain}/sitemap.xml`;

  return new Response(txt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": `public, s-maxage=${CACHE_1_WEEK}, stale-while-revalidate=59`,
    },
  });
}
