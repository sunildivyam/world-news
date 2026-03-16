import { PageTypeEnum } from "@/types/PageType.enum";

export interface RouteSegmentContext {
  tenantId?: string;
  country?: string;
  region?: string;
  city?: string;
  language?: string;
  pageType?: PageTypeEnum;
  pageId?: string;
}
