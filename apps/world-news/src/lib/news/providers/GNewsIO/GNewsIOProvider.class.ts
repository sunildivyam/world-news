import { ArticleQueryParams } from "@worldnews/shared";
import { UserContext } from "@worldnews/shared";
import { BaseArticleProvider } from "../BaseArticleProvider.class";
import { Article } from "@worldnews/shared";
import { ApiArticle, ApiArticlesResponse } from "./GNewsIO.interface";
import { ArticleSource } from "@worldnews/shared";
import { OriginalArticle } from "@worldnews/shared";
import { ArticleCollection } from "@worldnews/shared";
import { getLanguageCode } from "@/lib/contexts/language/Language.validators";
import { getRandomIntInclusive } from "@/lib/Utils";

export class GNewsIOProvider extends BaseArticleProvider {
  name: string = "GNews.io";
  baseUrl: string = process.env.GNEWSIO_API_URL ?? "";
  apiKey: string = process.env.GNEWSIO_API_KEY ?? "";

  public setQueryParams(
    apiKey: string,
    userContext: UserContext,
    articleQueryParams: ArticleQueryParams,
  ): URLSearchParams {
    const { geo } = userContext;
    const { language } = geo!;
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
      nextPage: getRandomIntInclusive(1, Math.max(1, totalArticles / 10)),
    };

    return articleCollection;
  }
}
