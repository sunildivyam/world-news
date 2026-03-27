// Global Home - sitemap.xml
import { fetchTenants } from "@worldnews/shared/news-engine-apis";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache for 1 hour to protect DB

export async function GET() {
  const tenants = await fetchTenants();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${tenants
      .map(
        (t) => `
      <sitemap>
        <loc>https://${t.domain}/sitemap.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </sitemap>
    `,
      )
      .join("")}
  </sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
    },
  });
}
