import { ArticleQueryParams } from "../../../types";
import { UserContext } from "../../../types";
import { BaseArticleProvider } from "../BaseArticleProvider.class";
import { Article } from "../../../types";
import { ApiArticle, ApiArticlesResponse } from "./NewsApiAOrg.interface";
import { ArticleSource } from "../../../types";
import { ArticleCollection } from "../../../types";
import { getRandomIntInclusive } from "../../../utils/common";

export class NewsApiAOrgProvider extends BaseArticleProvider {
  name: string = "NewsApi.org";
  baseUrl: string = process.env.NEWSAPIORG_API_URL ?? "";
  apiKey: string = process.env.NEWSAPIORG_API_KEY ?? "";

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
      if (language) sp.set("language", language);
      if (category?.length) sp.set("category", category.join(","));
      if (keywords?.length) sp.set("q", keywords.join(","));
      if (nextPage) sp.set("page", nextPage as string);
      if (pageSize) sp.set("size", pageSize ? pageSize.toString() : "" + 10);
      sp.set("sortBy", "publishedAt");
      sp.set("searchIn", "title,description,content");
    }

    return sp;
  }

  async parseArticle(rawArticle: ApiArticle): Promise<Article | null> {
    if (!rawArticle) return null;
    const article: Article = {
      _id: "",
      slug: "",
      tenant: undefined,
      tenantId: "",
      url: rawArticle.url,
      sourceId: rawArticle.source.id,
      title: rawArticle.title,
      description: rawArticle.description,
      author: rawArticle.author,
      category: "",
      geo: {
        country: "",
      },
      language: "",
      keywords: [],
      tags: [],
      publishedAt: rawArticle.publishedAt,
      updatedAt: "",
      imageUrl: rawArticle.urlToImage,
      videoUrl: "",
      content: undefined,
      analytics: undefined,
      source: {
        _id: rawArticle.source.id,
        slug: rawArticle.source.id,
        name: rawArticle.source.name,
        description: undefined,
        url: undefined,
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
    const { totalResults, articles } = rawArticleCollection;
    const articlesP = (
      await Promise.all(
        articles.map(async (a: any) => await this.parseArticle(a)),
      )
    ).filter((a) => a !== null);

    const articleCollection: ArticleCollection = {
      articles: articlesP,
      totalResults,
      nextPage: getRandomIntInclusive(1, Math.max(1, totalResults / 10)),
    };

    return articleCollection;
  }
}
