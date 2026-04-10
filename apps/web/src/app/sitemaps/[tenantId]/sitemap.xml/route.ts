// Global Home - sitemap.xml
import { PageTypeEnum } from "@worldnews/shared";
import {
  fetchCategories,
  fetchCountries,
  fetchLatestArticles,
  fetchTenant,
} from "@worldnews/shared/news-engine-apis";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache for 1 hour to protect Db

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  const tenantId = (await params).tenantId;
  const tenant = await fetchTenant(tenantId);
  const domain = tenant?.domain;
  const countries = await fetchCountries(tenant?.country);
  const cats = await fetchCategories(tenant?.category);
  const articles = await fetchLatestArticles({
    tenantId: tenantId,
    hours: 10 * 24,
    limit: 5000,
    page: 1,
    fields: ["slug", "title", "description"],
  }); // 10 Days

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${countries
      .map((c) => {
        let cSet = `
      <url>
        <loc>https://${domain}/${c.code}/${c.languages[0]}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1</priority>
      </url>
    `;
        cSet += cats
          .map(
            (cat) => `
      <url>
        <loc>https://${domain}/${c.code}/${c.languages[0]}/category/${cat.name}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>
    `,
          )
          .join("");
        return cSet;
      })
      .join("")}
      ${articles.map((a) => {
        return `<url>
        <loc>${a.url}</loc>
        <lastmod>${a.updatedAt || new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`;
      })}
 </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
    },
  });
}
