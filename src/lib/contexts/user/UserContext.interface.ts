import { GeoContext } from "../geo/GeoContext.interface";

export interface UserContext {
  tenantId?: string;
  language?: string;
  sessionId?: string;
  interests?: string[];
  keywords?: string[];
  geo?: GeoContext;
  pageType?: string;
  pageId?: string;
}
