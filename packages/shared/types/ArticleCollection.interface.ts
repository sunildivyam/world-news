import type { Article } from "./Article.interface";

export interface ArticleCollection {
  articles: Article[];
  totalResults: number;
  nextPage: string | number | null;
}
