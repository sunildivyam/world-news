import { Article, ArticleResponse } from "@/types/article";
import { FetchOptions } from "./news/provider.interface";
import { UserContext } from "./news/types";
import { executeWithFailover } from "./news/provider-manager";
import { AppError } from "@/types/AppError";

export const fetchArticles = async (
  context: UserContext,
  options?: FetchOptions,
): Promise<ArticleResponse | AppError> => {
  const data = await executeWithFailover((provider) => {
    return provider.fetchArticles(context, options);
  });

  return data;
};

export const fetchRelatedArticles = async (
  context: UserContext,
  article: Article | null,
): Promise<ArticleResponse | AppError> => {
  const data = await executeWithFailover((provider) => {
    return provider.fetchRelated(context, article);
  });

  return data;
};

export const fetchArticle = async (
  context: UserContext,
  slug: string,
): Promise<Article | AppError> => {
  const data = await executeWithFailover((provider) => {
    return provider.fetchArticle(context, slug);
  });

  return data;
};
