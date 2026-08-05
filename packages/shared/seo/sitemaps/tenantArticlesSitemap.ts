import { Article, Country, SitemapUrlEntry } from "../../types";
import { generateSitemapXml } from "./sitemap";

export function generateTenantArticlesSitemap(
  domain: string,
  tenantCountry: Country,
  articles: Article[],
) {
  const entries = articles?.map(
    (article) =>
      ({
        loc: `https://${domain}/${article.geo?.country || tenantCountry.code || "us"}/${article.language || tenantCountry.languages[0] || "en"}/article/${article.slug}`,
        lastmod: article.updatedAt,
        changefreq: "monthly",
        priority: 0.6,
      }) as SitemapUrlEntry,
  );

  return generateSitemapXml(entries);
}
