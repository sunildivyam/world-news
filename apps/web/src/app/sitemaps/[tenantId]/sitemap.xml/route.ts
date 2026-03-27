// Global Home - sitemap.xml
import { categories } from "@/app-constants/categories.constants";
import {
  fetchCountries,
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
  const countries = await fetchCountries();
  const cats = [...categories];

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
        <loc>https://${domain}/${c.code}/${c.languages[0]}/category/${cat.value}</loc>
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
 </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
    },
  });
}
