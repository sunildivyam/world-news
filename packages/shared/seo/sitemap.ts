import { UserContext } from "../types";

export const isSitemapRequested = (
  ctx: UserContext,
  pathName: string,
  host: string,
): string => {
  if (!pathName || !ctx || !ctx.tenantId) return "";
  pathName = pathName.toLowerCase();

  const sitemap = pathName.endsWith("sitemap.xml") ? "sitemap.xml" : "";
  if (!sitemap) return "";

  const segments = pathName.split("/");
  if (segments.length > 3) return "";

  const isRoot =
    (host === ctx.domain && segments[1] === "sitemap.xml") ||
    (segments[1] === ctx.tenantId && segments[2] === "sitemap.xml");

  console.log(segments, " | ", isRoot, " | ", host, " | ", ctx);
  if (isRoot) {
    const parts = ["sitemaps", ctx.tenantId, sitemap];
    return "/" + parts.join("/");
  }

  return "";
};
