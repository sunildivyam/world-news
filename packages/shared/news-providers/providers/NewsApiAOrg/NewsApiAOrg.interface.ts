export interface ApiArticle {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface ApiArticlesResponse {
  status: string;
  totalResults: number;
  articles: Array<ApiArticle>;
}
