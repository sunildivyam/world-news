import { GeoContext } from "../geo/GeoContext.interface";

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
}
