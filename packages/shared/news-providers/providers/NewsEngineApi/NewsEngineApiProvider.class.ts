/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArticleQueryParams,
  UserContext,
  Article,
  ArticleCollection,
} from "../../../types";
import { BaseArticleProvider } from "../BaseArticleProvider.class";
import { ApiArticle, ApiArticlesResponse } from "./NewsEngineApi.interface";

export class NewsEngineApiProvider extends BaseArticleProvider {
  name: string = "NewsEngineApi";
  baseUrl: string =
    `${process.env.NEWSENGINE_API_URL}/api/articles/latest` || "";
  apiKey: string = process.env.NEWSENGINE_API_KEY ?? "";

  public setQueryParams(
    apiKey: string,
    userContext: UserContext,
    articleQueryParams: ArticleQueryParams,
  ): URLSearchParams {
    const { geo, tenantId } = userContext || {};
    const { country, language } = geo || {};
    const { articleId, slug, pageSize, nextPage, keywords, category, tags } =
      articleQueryParams;

    const sp = new URLSearchParams();
    sp.set("apikey", apiKey);

    if (articleId) {
      // Fetches Single article By Id
      sp.set("slug", articleId);
    } else if (slug) {
      // Fetches Single article By slug
      sp.set("slug", slug);
    } else {
      // Fetch 1 page of articles (latest or by other search params)
      // Dynamic Params
      if (tenantId) sp.set("tenantId", tenantId);
      if (country) sp.set("country", country);
      if (language) sp.set("language", language);
      if (category?.length) sp.set("category", category.join(","));
      if (keywords?.length) sp.set("q", keywords.join(","));
      if (tags?.length) sp.set("q", tags.join(","));
      if (nextPage) sp.set("page", nextPage as string);
      if (pageSize) sp.set("size", pageSize ? pageSize.toString() : "" + 10);
    }

    return sp;
  }

  async parseArticle(rawArticle: ApiArticle): Promise<Article | null> {
    if (!rawArticle) return null;
    const article: Article = {
      id: rawArticle._id,
      slug: rawArticle.slug,
      tenantId: rawArticle.tenantId,
      sourceId: rawArticle.sourceId,
      url: rawArticle.url,
      tenant: rawArticle.tenant,
      title: rawArticle.title,
      description: rawArticle.description,
      author: rawArticle.author,
      category: rawArticle.category,
      geo: { ...rawArticle.geo },
      language: rawArticle.language,
      keywords: rawArticle.keywords,
      tags: rawArticle.tags,
      publishedAt: rawArticle.publishedAt,
      updatedAt: rawArticle.updatedAt,
      imageUrl: rawArticle.imageUrl,
      videoUrl: rawArticle.videoUrl,
      content: rawArticle.content,
      analytics: rawArticle.analytics ? { ...rawArticle.analytics } : undefined,
      source: rawArticle.source ? { ...rawArticle.source } : undefined,
    };

    return article;
  }

  async parseArticleCollection(
    rawArticleCollection: ApiArticlesResponse,
  ): Promise<ArticleCollection> {
    const { totalResults, articles, nextPage } = rawArticleCollection;

    const articlesP = (
      await Promise.all(
        articles.map(async (a: any) => await this.parseArticle(a)),
      )
    ).filter((a) => a !== null);

    const articleCollection: ArticleCollection = {
      articles: articlesP,
      totalResults,
      nextPage: nextPage!,
    };

    return articleCollection;
  }
}
