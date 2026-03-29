import { ROBOTS_FILE_NAME } from "./seo.constants";

export const isDomainRobotsTxt = (
  tenantId: string,
  domain: string,
  pathName: string,
  host: string,
): string => {
  if (!pathName || !tenantId) return "";
  pathName = pathName.toLowerCase();

  const robottxt = pathName.endsWith(ROBOTS_FILE_NAME) ? ROBOTS_FILE_NAME : "";
  if (!robottxt) return "";

  const segments = pathName.split("/");
  if (segments.length > 3) return "";

  const isRoot =
    (host === domain && segments[1] === ROBOTS_FILE_NAME) ||
    (segments[1] === tenantId && segments[2] === ROBOTS_FILE_NAME);

  if (isRoot) {
    const parts = ["robots", tenantId, robottxt];
    return "/" + parts.join("/");
  }

  return "";
};
