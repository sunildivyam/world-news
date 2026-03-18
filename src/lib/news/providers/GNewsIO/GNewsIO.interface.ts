export interface ApiArticle {
  id?: string;
  title?: string;
  description?: string;
  content?: string;
  url?: string;
  image?: string;
  publishedAt?: string;
  lang?: string;
  source?: {
    id?: string;
    name?: string;
    url?: string;
    country?: string;
  };
}

export interface ApiArticlesResponse {
  totalArticles: number;
  articles: Array<ApiArticle>;
}
