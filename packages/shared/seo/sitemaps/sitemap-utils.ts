import {
  ARTICLES_SITEMAP_FILE_PREFIX,
  SITEMAP_FILE_NAMES,
} from "../seo.constants";

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
