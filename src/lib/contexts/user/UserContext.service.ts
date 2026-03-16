import { headers } from "next/headers";

import { UserContext } from "@/lib/contexts/user/UserContext.interface";
import { getGeoContext } from "../geo/Geo.Service";

export const getUserContext = async (): Promise<UserContext> => {
  const h = await headers();
  return {
    tenantId: h.get("x-user-tenant-id") ?? undefined,
    sessionId: h.get("x-session-id") ?? undefined,
    language: h.get("x-user-language") ?? undefined,
    pageType: h.get("x-user-page-type") ?? undefined,
    pageId: h.get("x-user-page-id") ?? undefined,
    geo: { ...(await getGeoContext()) },
  } as UserContext;
};
