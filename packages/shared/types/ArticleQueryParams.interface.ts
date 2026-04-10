export interface ArticleQueryParams {
  articleId?: string;
  slug?: string;
  pageSize?: number;
  nextPage?: string | number | null;
  keywords?: Array<string>;
  tags?: Array<string>;
  category?: Array<string>;
  event?: string;
}
