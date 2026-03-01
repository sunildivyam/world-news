export interface ArticleSEO {
  title: string;
  description: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  publishedAt: string;
  publishedBy: string;
  slug: string;
  seo: ArticleSEO;
}

export interface NewsResponse {
  articles: Article[];
  nextCursor: string | null;
}
