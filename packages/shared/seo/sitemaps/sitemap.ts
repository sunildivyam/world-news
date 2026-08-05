import {
  NewsSitemapEntry,
  SitemapIndexEntry,
  SitemapUrlEntry,
} from "../../types";
import {
  ARTICLES_SITEMAP_FILE_PREFIX,
  SITEMAP_FILE_NAMES,
} from "../seo.constants";
export function buildHrefLang(
  countryCode: string,
  languageCode: string,
): string {
  return `${languageCode.toLowerCase()}-${countryCode.toUpperCase()}`;
}

export const isDomainSitemap = (
  tenantId: string,
  domain: string,
  pathName: string,
  host: string,
): string => {
  if (!pathName || !tenantId) return "";
  pathName = pathName.toLowerCase();
  const segments = pathName.split("/");
  if (segments.length > 3) return "";

  const sitemapFile = segments[segments.length - 1];
  const isArticleSitemap = sitemapFile.includes(ARTICLES_SITEMAP_FILE_PREFIX);

  const sitemap =
    SITEMAP_FILE_NAMES.includes(sitemapFile) || isArticleSitemap
      ? sitemapFile
      : "";
  if (!sitemap) return "";

  const isRoot =
    (host === domain && segments[1] === sitemap) ||
    (segments[1] === tenantId && segments[2] === sitemap);

  if (isRoot) {
    const parts = isArticleSitemap
      ? ["sitemaps", tenantId, "articles", sitemap]
      : ["sitemaps", tenantId, sitemap];
    return "/" + parts.join("/");
  }

  return "";
};

/**
 * Escapes special characters to ensure valid XML text nodes.
 */
export function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generates an XML sitemap supporting XHTML language alternates.
 */
export function generateSitemapXml(urls: SitemapUrlEntry[]): string {
  const urlElements = urls
    .map((entry) => {
      let xml = "  <url>\n";
      xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;

      // 1. Add Alternate Language Links (xhtml:link)
      if (entry.alternates && entry.alternates.length > 0) {
        entry.alternates.forEach((alt) => {
          xml += `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(alt.href)}" />\n`;
        });
      }

      // 2. Add standard fields
      if (entry.lastmod) {
        const dateString =
          entry.lastmod instanceof Date
            ? entry.lastmod.toISOString().split("T")[0]
            : entry.lastmod;
        xml += `    <lastmod>${dateString}</lastmod>\n`;
      }

      if (entry.changefreq) {
        xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      }

      if (entry.priority !== undefined) {
        const clampedPriority = Math.max(0.0, Math.min(1.0, entry.priority));
        xml += `    <priority>${clampedPriority.toFixed(1)}</priority>\n`;
      }

      xml += "  </url>";
      return xml;
    })
    .join("\n");

  // Important: Must include the 'xmlns:xhtml' namespace in the root <urlset> tag!
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlElements}
</urlset>`;
}
/**
 * Generates a standard XML sitemap index string from an array of sitemap entries.
 */
export function generateSitemapIndexXml(sitemaps: SitemapIndexEntry[]): string {
  const sitemapElements = sitemaps
    .map((entry) => {
      let xml = "  <sitemap>\n";
      xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;

      if (entry.lastmod) {
        // Formats Date objects to ISO 8601 string or uses the provided string
        const dateString =
          entry.lastmod instanceof Date
            ? entry.lastmod.toISOString()
            : entry.lastmod;
        xml += `    <lastmod>${dateString}</lastmod>\n`;
      }

      xml += "  </sitemap>";
      return xml;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapElements}
</sitemapindex>`;
}

/**
 * Generates an XML string compliant with Google News Sitemap guidelines.
 * Note: Google News sitemaps should only include articles published in the last 48 hours.
 */
export function generateNewsSitemapXml(articles: NewsSitemapEntry[]): string {
  const urlElements = articles
    .map((entry) => {
      const pubDateIso =
        entry.publicationDate instanceof Date
          ? entry.publicationDate.toISOString()
          : entry.publicationDate;

      let xml = "  <url>\n";
      xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;
      xml += "    <news:news>\n";
      xml += "      <news:publication>\n";
      xml += `        <news:name>${escapeXml(entry.publication.name)}</news:name>\n`;
      xml += `        <news:language>${escapeXml(entry.publication.language)}</news:language>\n`;
      xml += "      </news:publication>\n";
      xml += `      <news:publication_date>${pubDateIso}</news:publication_date>\n`;
      xml += `      <news:title>${escapeXml(entry.title)}</news:title>\n`;
      xml += "    </news:news>\n";
      xml += "  </url>";

      return xml;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlElements}
</urlset>`;
}

export function formatSitemapResponse(
  xmlContent: string,
  maxAge: number = 0,
): Response {
  return new Response(xmlContent, {
    status: 200,
    headers: {
      "Content-Type": `application/xml; charset=utf-8`, // <-- MUST BE SET
      "Cache-Control": maxAge
        ? `public, max-age=${maxAge}, s-maxage=${maxAge}`
        : "no-cache",
    },
  });
}
