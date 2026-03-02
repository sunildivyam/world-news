import { ApiArticle, ApiArticlesResponse } from "@/types/ApiResponse";
import { Article, ArticleSEO, NewsResponse } from "@/types/article";
import { defaultLanguage, shortLanguage } from "./languages";

export const parseToNewsResponse = (
  json: ApiArticlesResponse,
): NewsResponse => {
  const { nextPage, results } = json;

  return {
    nextCursor: nextPage || "",
    articles: results.map(
      (article: ApiArticle) =>
        ({
          id: article.article_id,
          title: article.title,
          description: article.description,
          imageUrl: article.image_url,
          publishedAt: article.pubDate,
          publishedBy: article.creator && article.creator[0],
          slug: article.article_id,
          seo: {
            title: article.title,
            description: article.description,
          } as ArticleSEO,
          language: shortLanguage(article.language) || defaultLanguage,
        }) as Article,
    ),
  } as NewsResponse;
};
