import { ArticleQueryParams } from "@/types/ArticleQueryParams.interface";
import { UserContext } from "@/lib/contexts/user/UserContext.interface";
import {
  BaseArticleProvider,
  setQueryParams,
} from "../BaseArticleProvider.class";
import { Article } from "@/types/Article.interface";
import { ApiArticle, ApiArticlesResponse } from "./NewsApiAOrg.interface";
import { ArticleSource } from "@/types/ArticleSource.interface";
import { OriginalArticle } from "@/types/OriginalArticle.interface";
import { ArticleCollection } from "@/types/ArticleCollection.interface";
import { DEFAULT_TENANT } from "@/app-constants/tenants.constant";

export class NewsApiAOrgProvider extends BaseArticleProvider {
  name: string = "NewsApi.org";
  baseUrl: string = process.env.NEWSAPIORG_API_URL ?? "";
  apiKey: string = process.env.NEWSAPIORG_API_KEY ?? "";

  createRequest(
    userContext: UserContext,
    articleQueryParams: ArticleQueryParams,
  ): Request {
    const url = new URL(this.baseUrl);
    const { language } = userContext?.geo || {};
    const { articleId, pageSize, nextPage, keywords } =
      articleQueryParams || {};

    // set only supported geo to query params
    const sp = setQueryParams(
      this.apiKey,
      { geo: { language } },
      { articleId, pageSize, nextPage, keywords },
    );

    if (!articleId) {
      // Query Params that are static and required
      sp.set("sortBy", "publishedAt");
      sp.set("searchIn", "title,description,content");
    }

    // Merge sp into url.searchParams
    sp.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    const req = new Request(url);
    return req;
  }

  parseArticle(rawArticle: ApiArticle): Article | null {
    if (!rawArticle) return null;
    const article: Article = {
      id: "",
      slug: "",
      tenant: undefined, // DEFAULT_TENANT,
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
      publishTZ: "",
      publishDate: rawArticle.publishedAt,
      updateDate: "",
      imageUrl: rawArticle.urlToImage,
      videoUrl: "",
      content: undefined,
      analytics: undefined,
      source: {
        id: rawArticle.source.id,
        name: rawArticle.source.name,
        description: undefined,
        url: undefined,
        iconUrl: undefined,
        imageUrl: undefined,
        category: undefined,
        language: undefined,
      } as ArticleSource,
      orginal: undefined,
    };

    article.orginal = {
      id: article.id,
      title: article.title,
      description: article.description,
      url: rawArticle.url,
      imageUrl: article.imageUrl,
      videoUrl: article.videoUrl,
      publishTZ: article.publishTZ,
      publishDate: article.publishDate,
      author: article.author,
      source: article.source,
      articeProviderName: this.name,
    } as OriginalArticle;

    return article;
  }

  parseArticleCollection(
    rawArticleCollection: ApiArticlesResponse,
  ): ArticleCollection {
    const { totalResults, articles } = rawArticleCollection;
    const articleCollection: ArticleCollection = {
      articles: articles
        .map((a: any) => this.parseArticle(a))
        .filter((a) => a !== null),
      totalResults,
      nextPage: 0,
    };

    return articleCollection;
  }
}
