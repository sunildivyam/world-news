import { AppError } from "@worldnews/shared/types";
import { Article } from "@worldnews/shared/types";
import { ArticleCollection } from "@worldnews/shared/types";
import { ArticleProvider } from "@worldnews/shared/types";
import { ArticleQueryParams } from "@worldnews/shared/types";
import { UserContext } from "@worldnews/shared/types";

export class BaseArticleProvider implements ArticleProvider {
  name: string = "BaseArticleProvider";
  apiKey: string = process.env.DEFAULT_ARTICLE_PROVIDER_API_KEY ?? "";
  baseUrl: string = process.env.DEFAULT_ARTICLE_PROVIDER_API_URL ?? "";

  protected catchError(err: any, fnName: string) {
    const error = new AppError(
      `${this.name} | ${fnName}`,
      err.message,
      err.status,
    );
    return error;
  }

  protected checkArticleCollection(
    articleCollection: ArticleCollection,
    sourceFnName: string,
  ): AppError | null {
    if (!articleCollection?.articles?.length) {
      const error = new AppError(
        `${this.name} | ${sourceFnName} Post parsing`,
        "No Articles found.",
        404,
      );
      return error;
    }

    return null;
  }

  protected checkError(
    res: Response,
    json: any,
    sourceFnName: string,
  ): AppError | null {
    if (!res.ok || json?.status === "error" || json.error || json.errors) {
      const error = new AppError(
        `${this.name} | ${sourceFnName}`,
        json?.error ||
          (json?.errors?.length && json.errors.join("\n")) ||
          json?.error?.message ||
          json?.results?.message ||
          res.statusText,
        json?.results?.code || json?.error?.code || res.status,
      );
      return error;
    }

    return null;
  }

  public createRequest(
    userContext: UserContext,
    articleQueryParams: ArticleQueryParams,
  ): Request {
    const url = new URL(this.baseUrl);
    const sp = this.setQueryParams(
      this.apiKey,
      userContext,
      articleQueryParams,
    );
    // Merge sp into url.searchParams
    sp.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    const req = new Request(url);
    return req;
  }

  public async parseArticle(rawArticle: any): Promise<Article | null> {
    if (!rawArticle) return null;
    const {
      id,
      slug,
      tenant,
      title,
      description,
      author,
      category,
      geo,
      language,
      keywords,
      tags,
      publishTZ,
      publishDate,
      updateDate,
      imageUrl,
      videoUrl,
      content,
      analytics,
      source,
      orginal,
    } = rawArticle;

    const article: Article = {
      id,
      slug,
      tenant,
      title,
      description,
      author,
      category,
      geo,
      language,
      keywords,
      tags,
      publishTZ,
      publishDate,
      updateDate,
      imageUrl,
      videoUrl,
      content,
      analytics,
      source,
      orginal,
    };

    return article;
  }

  public async parseArticleCollection(
    rawArticleCollection: any,
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
      nextPage,
    };

    return articleCollection;
  }

  public async fetchArticles(
    context: UserContext,
    options?: ArticleQueryParams,
  ): Promise<ArticleCollection | AppError> {
    const fnName = "fetchArticles()";
    const req = this.createRequest(context, options || {});
    console.log(`${this.name} | ${fnName}}`, req.url);

    try {
      const res = await fetch(req, {
        next: { revalidate: 600 },
      });

      const json = await res.json();

      const error = this.checkError(res, json, fnName);
      if (error) return error;

      const articleCollection = await this.parseArticleCollection(json);

      const errorC = this.checkArticleCollection(articleCollection, fnName);
      if (errorC) return errorC;

      return articleCollection;
    } catch (err: any) {
      return this.catchError(err, fnName);
    }
  }

  public async fetchArticle(
    context: UserContext,
    slug: string,
  ): Promise<Article | AppError> {
    const fnName = "fetchArticle()";
    const req = this.createRequest(context, {
      articleId: slug,
    });

    try {
      console.log(`${this.name} | ${fnName}`, req.url);
      const res = await fetch(req, {
        next: { revalidate: 600 },
      });

      const json = await res.json();

      const error = this.checkError(res, json, fnName);
      if (error) return error;

      const articleCollection = await this.parseArticleCollection(json);

      const errorC = this.checkArticleCollection(articleCollection, fnName);
      if (errorC) return errorC;

      const article = articleCollection.articles[0];
      return article;
    } catch (err: any) {
      return this.catchError(err, fnName);
    }
  }

  public async fetchRelatedArticles(
    context: UserContext,
    article: Article,
  ): Promise<ArticleCollection | AppError> {
    const fnName = "fetchRelatedArticles()";

    if (!article)
      return new AppError(
        `${this.name} | ${fnName}`,
        "Expected article for related articles",
        400,
      );

    try {
      const req = this.createRequest(context, {
        category: article?.category ? [article.category] : undefined,
        keywords: article?.keywords ? article?.keywords.slice(0, 1) : undefined,
        // keywords: article?.keywords ?? undefined,        TODO: Later remove comments for full related search
        // tags: article?.tags ?? undefined,
      });

      console.log(`${this.name} | ${fnName}`, req.url);
      const res = await fetch(req, {
        next: { revalidate: 600 },
      });

      const json = await res.json();

      const error = this.checkError(res, json, fnName);
      if (error) return error;

      const articleCollection = await this.parseArticleCollection(json);

      const errorC = this.checkArticleCollection(articleCollection, fnName);
      if (errorC) return errorC;

      return articleCollection;
    } catch (err: any) {
      return this.catchError(err, fnName);
    }
  }

  public setQueryParams(
    apiKey: string,
    userContext: UserContext,
    articleQueryParams: ArticleQueryParams,
  ): URLSearchParams {
    const { sessionId, geo } = userContext;
    const { country, language, region, city, ip } = geo!;
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
      if (country) sp.set("country", country);
      if (region) sp.set("region", region);
      if (city) sp.set("city", city);
      if (language) sp.set("language", language);
      if (category?.length) sp.set("category", category.join(","));
      if (keywords?.length) sp.set("q", keywords.join(","));
      if (nextPage) sp.set("page", nextPage as string);

      // Query Params that are static and required
      if (pageSize) sp.set("size", pageSize ? pageSize.toString() : "" + 10);
    }

    return sp;
  }
}
