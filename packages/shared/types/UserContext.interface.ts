import type { GeoContext } from "./GeoContext.interface";
import { TenantContext } from "./TenantContext.interface";

export interface UserContext {
  tenantId?: string;
  domain?: string;
  language?: string;
  sessionId?: string;
  interests?: string[];
  keywords?: string[];
  geo?: GeoContext;
  pageType?: string;
  pageId?: string;
  tenantCtx?: TenantContext;
}
