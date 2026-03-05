import { Article, ArticleResponse } from "@/types/article";
import { UserContext } from "./types";
import { AppError } from "@/types/AppError";

export interface FetchOptions {
  articleId?: string;
  limit?: number;
  nextPage?: string;
  keywords?: Array<string>;
  categories?: Array<string>;
}

export interface NewsProvider {
  name: string;

  fetchArticles(
    context: UserContext,
    options?: FetchOptions,
  ): Promise<ArticleResponse | AppError>;

  fetchRelated(
    context: UserContext,
    article: Article | null,
  ): Promise<ArticleResponse | AppError>;

  fetchArticle(context: UserContext, slug: string): Promise<Article | AppError>;
}
