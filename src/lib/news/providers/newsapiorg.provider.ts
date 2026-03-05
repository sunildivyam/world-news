import { Article, ArticleResponse } from "@/types/article";
import { FetchOptions, NewsProvider } from "../provider.interface";
import { UserContext } from "../types";
import {
  parseArticle,
  parseArticlesResponse,
} from "../parsers/newsdata.parser";
import { AppError } from "@/types/AppError";

export class NewsapiorgProvider implements NewsProvider {
  name: string = "NewsApiOrg";
  private baseUrl = process.env.NEWSAPIORG_API_URL!;
  private apiKey = process.env.NEWSAPIORG_API_KEY!;

  private buildUrl(context: UserContext, options?: FetchOptions) {
    const url = new URL(this.baseUrl);
    const {
      sessionId,
      country,
      language,
      region,
      city,
      ip,
      /*, keywords */ interests,
    } = context;

    const { articleId, limit, nextPage, keywords, categories } = options || {};

    url.searchParams.set("apikey", this.apiKey);

    if (articleId) {
      // Fetches Single article By Id
      url.searchParams.set("id", articleId);
    } else {
      // Fetch 1 page of articles (latest or by other search params)
      // Dynamic Params
      if (keywords?.length) url.searchParams.set("q", keywords.join(","));
      if (language) url.searchParams.set("language", language);
      if (nextPage) url.searchParams.set("page", nextPage);

      // Query Params that are static and required
      url.searchParams.set("pageSize", limit ? limit.toString() : "10");
      url.searchParams.set("sortBy", "publishedAt");
      url.searchParams.set("searchIn", "title,description,content");
    }

    return url.toString();
  }

  public async fetchArticles(
    context: UserContext,
    options?: FetchOptions,
  ): Promise<ArticleResponse | AppError> {
    const url = this.buildUrl(context, options);
    console.log("ARTICLES: ", url);

    try {
      const res = await fetch(url, {
        next: { revalidate: 60 },
      });

      const json = await res.json();

      if (!res.ok) {
        const error = new AppError(
          `${this.name} Provider | fetchArticles()`,
          "UNKNOWN",
          res.statusText,
          res.status,
        );
        return error;
      }

      const articlesResP = parseArticlesResponse(json);
      if (!articlesResP.totalCount || !articlesResP.articles?.length) {
        const error = new AppError(
          `${this.name} Provider | fetchArticles() post parsing`,
          "EMPTY_ARTICLES",
          "Articles is empty",
          404,
        );
        return error;
      }

      return articlesResP;
    } catch (err: any) {
      const error = new AppError(
        `${this.name} Provider | fetchArticles()`,
        err.code,
        err.message,
        err.status,
      );
      return error;
    }
  }

  public async fetchRelated(
    context: UserContext,
    article: Article | null,
  ): Promise<ArticleResponse | AppError> {
    try {
      const url = this.buildUrl(context, {
        categories: article?.category ? [article.category] : undefined,
        keywords: article?.tags ? article.tags : undefined,
      });

      console.log("Related: ", url);

      const res = await fetch(url, {
        next: { revalidate: 120 },
      });

      const json = await res.json();

      if (!res.ok) {
        const error = new AppError(
          `${this.name} Provider | fetchRelatedArticles()`,
          "UNKNOWN",
          res.statusText,
          res.status,
        );
        return error;
      }

      const articlesResP = parseArticlesResponse(json);
      if (!articlesResP.totalCount || !articlesResP.articles?.length) {
        const error = new AppError(
          `${this.name} Provider | fetchRelatedArticles() Post parsing`,
          "EMPTY_RELATED_ARTICLES",
          "Related Articles is empty",
          404,
        );
        return error;
      }

      return articlesResP;
    } catch (err: any) {
      const error = new AppError(
        `${this.name} Provider | fetchRelatedArticles()`,
        err.code,
        err.message,
        err.status,
      );
      return error;
    }
  }

  public async fetchArticle(
    context: UserContext,
    slug: string,
  ): Promise<Article | AppError> {
    const url = this.buildUrl(context, {
      articleId: slug,
    });
    try {
      console.log("ARTICLE: ", url);
      const res = await fetch(url, {
        next: { revalidate: 300 },
      });

      const json = await res.json();

      if (!res.ok) {
        const error = new AppError(
          `${this.name} Provider | fetchArticle()`,
          "UNKNOWN",
          res.statusText,
          res.status,
        );
        return error;
      }

      const articleP = parseArticle(json);

      if (!articleP || !articleP.title) {
        const error = new AppError(
          `${this.name} Provider | fetchArticle() | Post Parsing`,
          "EMPTY_ARTICLE",
          "Article is empty",
          404,
        );
        return error;
      }

      return articleP;
    } catch (err: any) {
      const error = new AppError(
        `${this.name} Provider | fetchArticle()`,
        err.code,
        err.message,
        err.status,
      );
      return error;
    }
  }
}
