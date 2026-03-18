import { ArticleQueryParams } from "@/types/ArticleQueryParams.interface";
import { UserContext } from "@/lib/contexts/user/UserContext.interface";
import {
  BaseArticleProvider,
  setQueryParams,
} from "../BaseArticleProvider.class";
import { Article } from "@/types/Article.interface";
import { ApiArticle, ApiArticlesResponse } from "./GNewsIO.interface";
import { ArticleSource } from "@/types/ArticleSource.interface";
import { OriginalArticle } from "@/types/OriginalArticle.interface";
import { ArticleCollection } from "@/types/ArticleCollection.interface";
import { getLanguageCode } from "@/lib/contexts/language/Language.validators";
import { getRandomIntInclusive } from "@/lib/Utils";

export class GNewsIOProvider extends BaseArticleProvider {
  name: string = "GNews.io";
  baseUrl: string = process.env.GNEWSIO_API_URL ?? "";
  apiKey: string = process.env.GNEWSIO_API_KEY ?? "";

  createRequest(
    userContext: UserContext,
    articleQueryParams: ArticleQueryParams,
  ): Request {
    const url = new URL(this.baseUrl);
    const { language, country } = userContext?.geo || {};
    const { articleId, pageSize, keywords, nextPage } =
      articleQueryParams || {};

    // set only supported geo to query params
    const sp = setQueryParams(
      this.apiKey,
      { geo: { country } },
      { articleId, nextPage, keywords },
    );

    if (!articleId) {
      // Query Params that are static and required
      sp.set("lang", language ?? "en");
      sp.set("max", (pageSize || "10").toString());
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
      id: rawArticle?.id ?? "",
      slug: rawArticle?.id ?? "",
      tenant: undefined, // DEFAULT_TENANT,
      title: rawArticle.title ?? "",
      description: rawArticle.description ?? "",
      author: "",
      category: "",
      geo: {
        country: "",
      },
      language: getLanguageCode(rawArticle.lang || ""),
      keywords: [],
      tags: [],
      publishTZ: "",
      publishDate: rawArticle.publishedAt ?? "",
      updateDate: "",
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
    const { totalArticles, articles } = rawArticleCollection;
    const articleCollection: ArticleCollection = {
      articles: articles
        .map((a: any) => this.parseArticle(a))
        .filter((a) => a !== null),
      totalResults: totalArticles,
      nextPage: getRandomIntInclusive(1, 10),
    };

    return articleCollection;
  }
}
