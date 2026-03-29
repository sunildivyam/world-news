import { SITEMAP_FILE_NAME } from "./seo.constants";

export const isDomainSitemap = (
  tenantId: string,
  domain: string,
  pathName: string,
  host: string,
): string => {
  if (!pathName || !tenantId) return "";
  pathName = pathName.toLowerCase();

  const sitemap = pathName.endsWith(SITEMAP_FILE_NAME) ? SITEMAP_FILE_NAME : "";
  if (!sitemap) return "";

  const segments = pathName.split("/");
  if (segments.length > 3) return "";

  const isRoot =
    (host === domain && segments[1] === SITEMAP_FILE_NAME) ||
    (segments[1] === tenantId && segments[2] === SITEMAP_FILE_NAME);

  if (isRoot) {
    const parts = ["sitemaps", tenantId, sitemap];
    return "/" + parts.join("/");
  }

  return "";
};
