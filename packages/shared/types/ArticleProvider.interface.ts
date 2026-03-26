import type { AppError } from "./AppError.class";
import type { Article } from "./Article.interface";
import type { ArticleCollection } from "./ArticleCollection.interface";
import type { ArticleQueryParams } from "./ArticleQueryParams.interface";
import type { UserContext } from "./UserContext.interface";

export interface ArticleProvider {
  name: string;
  baseUrl: string;
  apiKey: string;

  /**
   * Generates the API's request using userContext and article's query parameters
   * @param userContext
   * @param articleQueryParams
   */
  createRequest(
    userContext: UserContext,
    articleQueryParams: ArticleQueryParams,
  ): Request;

  /**
   * Parses the raw article from API response to Article
   * @param rawArticle
   */
  parseArticle(rawArticle: any): Promise<Article | null>;

  /**
   * Parses the raw article's collection from API response to ArticleCollection
   * @param rawArticle
   */
  parseArticleCollection(rawArticleCollection: any): Promise<ArticleCollection>;

  /**
   * Fetch Articles based on query params
   * @param context
   * @param options
   */
  fetchArticles(
    context: UserContext,
    options?: ArticleQueryParams,
  ): Promise<ArticleCollection | AppError>;

  /**
   * Fetch single article by id/slug
   * @param context
   * @param slug
   */
  fetchArticle(context: UserContext, slug: string): Promise<Article | AppError>;

  /**
   * Fetch Articles based on query params
   * @param context
   * @param article
   */
  fetchRelatedArticles(
    context: UserContext,
    article?: Article,
  ): Promise<ArticleCollection | AppError>;

  setQueryParams(
    apiKey: string,
    userContext: UserContext,
    articleQueryParams: ArticleQueryParams,
  ): URLSearchParams;
}
