export interface LatestArticlesQueryParams {
  id?: string;
  slug?: string;
  country?: string;
  language?: string;
  tenantId?: string;
  keywords?: string[];
  tags?: string[];
  category?: string;
  page?: number;
  limit?: number;
  fields?: string[];
  hours?: number;
}
