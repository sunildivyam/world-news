export interface ArticleSEO {
  title: string;
  description: string;
}

export type ArticleBody = Array<ArticleSection>;

export interface ArticleSection {
  type: "heading" | "paragraph" | "unorderedList" | "OrderedList";
  richText: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  content?: ArticleBody;
  language: string;
  description: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
  category: string;
  tags: Array<string>;
}

export interface ArticleResponse {
  articles: Article[];
  nextPage: string | null;
  totalCount?: number;
}
