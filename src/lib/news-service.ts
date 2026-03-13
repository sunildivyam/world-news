import { executeWithFailover } from "./news/provider-manager";
import { ArticleCollection } from "@/types/ArticleCollection.interface";
import { Article } from "@/types/Article.interface";
import { UserContext } from "@/types/UserContext.interface";
import { ArticleQueryParams } from "@/types/ArticleQueryParams";
import { AppError } from "@/types/AppError.class";

export const fetchArticles = async (
  context: UserContext,
  options?: ArticleQueryParams,
): Promise<ArticleCollection | AppError> => {
  const data = await executeWithFailover((provider) => {
    return provider.fetchArticles(context, options);
  });

  return data;
};

export const fetchRelatedArticles = async (
  context: UserContext,
  article: Article | null,
): Promise<ArticleCollection | AppError> => {
  const data = await executeWithFailover((provider) => {
    return provider.fetchRelatedArticles(context, article!);
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
