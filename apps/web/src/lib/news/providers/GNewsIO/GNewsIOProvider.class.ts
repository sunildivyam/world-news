import {
  ArticleQueryParams,
  UserContext,
  Article,
  ArticleSource,
  ArticleCollection,
} from "@worldnews/shared/types";
import { BaseArticleProvider } from "../BaseArticleProvider.class";
import { ApiArticle, ApiArticlesResponse } from "./GNewsIO.interface";
import { getRandomIntInclusive } from "@/lib/Utils";
import { geoService } from "@worldnews/shared/server";

export class GNewsIOProvider extends BaseArticleProvider {
  name: string = "GNews.io";
  baseUrl: string = process.env.GNEWSIO_API_URL ?? "";
  apiKey: string = process.env.GNEWSIO_API_KEY ?? "";

  public setQueryParams(
    apiKey: string,
    userContext: UserContext,
    articleQueryParams: ArticleQueryParams,
  ): URLSearchParams {
    const { geo } = userContext || {};
    const { language } = geo || {};
    const { articleId, pageSize, nextPage, keywords, category } =
      articleQueryParams;

    const sp = new URLSearchParams();
    sp.set("apikey", apiKey);

    if (articleId) {
      // Fetches Single article By Id
      sp.set("id", articleId);
    } else {
      // Fetch 1 page of articles (latest or by other search params)
      // Dynamic Params
      if (language) sp.set("lang", language);
      if (category?.length) sp.set("category", category.join(","));
      if (keywords?.length) sp.set("q", keywords.join(","));
      if (nextPage) sp.set("page", nextPage as string);
      if (pageSize) sp.set("max", pageSize ? pageSize.toString() : "" + 10);
    }

    return sp;
  }

  async parseArticle(rawArticle: ApiArticle): Promise<Article | null> {
    if (!rawArticle) return null;
    const article: Article = {
      id: rawArticle?.id ?? "",
      slug: rawArticle?.id ?? "",
      tenant: undefined,
      tenantId: "",
      sourceId: rawArticle.source?.id || "",
      url: rawArticle.url || "",
      title: rawArticle.title ?? "",
      description: rawArticle.description ?? "",
      author: "",
      category: "",
      geo: {
        country: "",
      },
      language: await geoService.getLanguageCode(rawArticle.lang || ""),
      keywords: [],
      tags: [],
      publishedAt: rawArticle.publishedAt ?? "",
      updatedAt: "",
      imageUrl: rawArticle.image,
      videoUrl: "",
      content: undefined,
      analytics: undefined,
      source: {
        id: rawArticle.source?.id,
        name: rawArticle.source?.name,
        description: undefined,
        url: rawArticle.source?.url,
        iconUrl: undefined,
        imageUrl: undefined,
        category: undefined,
        language: undefined,
      } as ArticleSource,
    };

    return article;
  }

  async parseArticleCollection(
    rawArticleCollection: ApiArticlesResponse,
  ): Promise<ArticleCollection> {
    const { totalArticles, articles } = rawArticleCollection;
    const articlesP = (
      await Promise.all(
        articles.map(async (a: any) => await this.parseArticle(a)),
      )
    ).filter((a) => a !== null);

    const articleCollection: ArticleCollection = {
      articles: articlesP,
      totalResults: totalArticles,
      nextPage: getRandomIntInclusive(1, Math.max(1, totalArticles / 10)),
    };

    return articleCollection;
  }
}
