export const isSitemapRequested = (
  tenantId: string,
  domain: string,
  pathName: string,
  host: string,
): string => {
  if (!pathName || !tenantId) return "";
  pathName = pathName.toLowerCase();

  const sitemap = pathName.endsWith("sitemap.xml") ? "sitemap.xml" : "";
  if (!sitemap) return "";

  const segments = pathName.split("/");
  if (segments.length > 3) return "";

  const isRoot =
    (host === domain && segments[1] === "sitemap.xml") ||
    (segments[1] === tenantId && segments[2] === "sitemap.xml");

  if (isRoot) {
    const parts = ["sitemaps", tenantId, sitemap];
    return "/" + parts.join("/");
  }

  return "";
};
