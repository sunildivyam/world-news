export interface ArticleQueryParams {
  articleId?: string;
  pageSize?: number;
  nextPage?: string | number | null;
  keywords?: Array<string>;
  tags?: Array<string>;
  category?: Array<string>;
}
