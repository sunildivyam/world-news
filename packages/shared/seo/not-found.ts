import { NOT_FOUND_NAME } from "./seo.constants";

export const isDomainNotFoundPage = (
  tenantId: string,
  domain: string,
  pathName: string,
  host: string,
): string => {
  if (!pathName) return "";

  pathName = pathName.toLowerCase();
  const notFoundPage = pathName.endsWith(NOT_FOUND_NAME) ? NOT_FOUND_NAME : "";
  if (!notFoundPage) return "";

  const segments = pathName.split("/");
  if (segments.length > 3) return "";

  // Check for global root
  const isGlobalRoot = !tenantId && segments[1] === NOT_FOUND_NAME;
  if (isGlobalRoot) return "";

  // Check for domain root
  const isDomainRoot =
    (host === domain && segments[1] === NOT_FOUND_NAME) ||
    (segments[1] === tenantId && segments[2] === NOT_FOUND_NAME);

  if (isDomainRoot) {
    const parts = ["not-founds", tenantId];
    return "/" + parts.join("/");
  }

  return "";
};
