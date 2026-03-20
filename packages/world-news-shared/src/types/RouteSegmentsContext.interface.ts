import type { PageTypeEnum } from "./PageType.enum";

export interface RouteSegmentContext {
  tenantId?: string;
  country?: string;
  region?: string;
  city?: string;
  language?: string;
  pageType?: PageTypeEnum;
  pageId?: string;
}
