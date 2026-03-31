import { executeWithFailover } from "@worldnews/shared/news-providers/provider-manager";
import { articleProviders } from "@worldnews/shared/news-providers";
import { ArticleCollection } from "@worldnews/shared/types";
import { Article } from "@worldnews/shared/types";
import { UserContext } from "@worldnews/shared/types";
import { ArticleQueryParams } from "@worldnews/shared/types";
import { AppError } from "@worldnews/shared/types";

export const fetchArticles = async (
  context: UserContext,
  options?: ArticleQueryParams,
): Promise<ArticleCollection | AppError> => {
  const data = await executeWithFailover((provider) => {
    return provider.fetchArticles(context, options);
  }, articleProviders);

  return data;
};

export const fetchRelatedArticles = async (
  context: UserContext,
  article: Article | null,
): Promise<ArticleCollection | AppError> => {
  const data = await executeWithFailover((provider) => {
    return provider.fetchRelatedArticles(context, article!);
  }, articleProviders);

  return data;
};

export const fetchArticle = async (
  context: UserContext,
  slug: string,
): Promise<Article | AppError> => {
  const data = await executeWithFailover((provider) => {
    return provider.fetchArticle(context, slug);
  }, articleProviders);

  return data;
};
