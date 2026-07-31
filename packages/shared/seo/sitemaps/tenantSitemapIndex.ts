import { SitemapIndexEntry } from "@/types";
import { generateSitemapIndexXml } from "./sitemap";
import { ARTICLE_PAGE_LIMIT, SITEMAPS } from "./sitemap.constant";

export function generateTenantSitemapIndex(
  domain: string,
  articlePagesCount: number,
) {
  const articleXmlFilesCount = Math.ceil(
    articlePagesCount / ARTICLE_PAGE_LIMIT,
  );

  const articlesEntries = Array.from({ length: articleXmlFilesCount }).map(
    (_, i) =>
      ({
        loc: `https://${domain}/articles/${i + 1}.xml`,
        lastmod: new Date(),
      }) as SitemapIndexEntry,
  );

  const entries: SitemapIndexEntry[] = SITEMAPS.map(
    (fileName) =>
      ({
        loc: `https://${domain}/${fileName}`,
        lastmod: new Date(),
      }) as SitemapIndexEntry,
  );

  return generateSitemapIndexXml([...entries, ...articlesEntries]);
}
