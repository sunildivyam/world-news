import { AppError } from "@/types/AppError.class";
import { Article } from "@/types/Article.interface";
import { ArticleCollection } from "@/types/ArticleCollection.interface";
import { ArticleProvider } from "@/types/ArticleProvider.interface";
import { ArticleQueryParams } from "@/types/ArticleQueryParams";
import { UserContext } from "@/lib/contexts/user/UserContext.interface";

export class BaseArticleProvider implements ArticleProvider {
  name: string = "BaseArticleProvider";
  apiKey: string = process.env.DEFAULT_ARTICLE_PROVIDER_API_KEY ?? "";
  baseUrl: string = process.env.DEFAULT_ARTICLE_PROVIDER_API_URL ?? "";

  createRequest(
    userContext: UserContext,
    articleQueryParams: ArticleQueryParams,
  ): Request {
    const url = new URL(this.baseUrl);
    const sp = setQueryParams(this.apiKey, userContext, articleQueryParams);
    // Merge sp into url.searchParams
    sp.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    const req = new Request(url);
    return req;
  }

  parseArticle(rawArticle: any): Article | null {
    if (!rawArticle) return null;
    const {
      id,
      slug,
      tenant,
      title,
      description,
      author,
      category,
      country,
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
      country,
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

  parseArticleCollection(rawArticleCollection: any): ArticleCollection {
    const { totalResults, articles, nextPage } = rawArticleCollection;
    const articleCollection: ArticleCollection = {
      articles: articles.map((a: any) => this.parseArticle(a)),
      totalResults,
      nextPage,
    };

    return articleCollection;
  }

  public async fetchArticles(
    context: UserContext,
    options?: ArticleQueryParams,
  ): Promise<ArticleCollection | AppError> {
    const req = this.createRequest(context, options || {});
    console.log(`${this.name} | fetchArticles()`, req.url);

    try {
      const res = await fetch(req, {
        next: { revalidate: 60 },
      });

      const json = await res.json();

      if (!res.ok || json?.status === "error") {
        const error = new AppError(
          `${this.name} | fetchRelatedArticles()`,
          res.statusText || json?.results?.message,
          res.status || json?.results?.code,
        );
        return error;
      }

      const articleCollection = this.parseArticleCollection(json);
      if (
        !articleCollection.totalResults ||
        !articleCollection.articles?.length
      ) {
        const error = new AppError(
          `${this.name} | fetchArticles() post parsing`,
          "No Articles found",
          404,
        );
        return error;
      }

      return articleCollection;
    } catch (err: any) {
      const error = new AppError(
        `${this.name} | fetchArticles()`,
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
    const req = this.createRequest(context, {
      articleId: slug,
    });

    try {
      console.log(`${this.name} | fetchArticle()`, req.url);
      const res = await fetch(req, {
        next: { revalidate: 300 },
      });

      const json = await res.json();

      if (!res.ok || json?.status === "error") {
        const error = new AppError(
          `${this.name} | fetchArticle()`,
          res.statusText || json?.results?.message,
          res.status || json?.results?.code,
        );
        return error;
      }

      const article = this.parseArticle(
        (json.results?.length && json.results[0]) || null,
      );

      if (!article || !article.title) {
        const error = new AppError(
          `${this.name} | fetchArticle() | Post Parsing`,
          "Article is empty",
          404,
        );
        return error;
      }

      return article;
    } catch (err: any) {
      const error = new AppError(
        `${this.name} | fetchArticle()`,
        err.message,
        err.status,
      );
      return error;
    }
  }

  public async fetchRelatedArticles(
    context: UserContext,
    article: Article,
  ): Promise<ArticleCollection | AppError> {
    if (!article)
      return new AppError(
        `${this.name} | fetchRelatedArticles()`,
        "Expected article for related articles",
        400,
      );

    try {
      const req = this.createRequest(context, {
        category: article?.category ? [article.category] : undefined,
        keywords: article?.keywords ?? undefined,
        tags: article?.tags ?? undefined,
      });

      console.log(`${this.name} | fetchRelatedArticles()`, req.url);
      const res = await fetch(req, {
        next: { revalidate: 120 },
      });

      const json = await res.json();

      if (!res.ok || json?.status === "error") {
        const error = new AppError(
          `${this.name} | fetchRelatedArticles()`,
          res.statusText || json?.results?.message,
          res.status || json?.results?.code,
        );
        return error;
      }

      const articleCollection = this.parseArticleCollection(json);
      if (
        !articleCollection.totalResults ||
        !articleCollection.articles?.length
      ) {
        const error = new AppError(
          `${this.name} | fetchRelatedArticles() Post parsing`,
          "Related Articles is empty",
          404,
        );
        return error;
      }

      return articleCollection;
    } catch (err: any) {
      const error = new AppError(
        `${this.name} | fetchRelatedArticles()`,
        err.message,
        err.status,
      );
      return error;
    }
  }
}

export function setQueryParams(
  apiKey: string,
  userContext: UserContext,
  articleQueryParams: ArticleQueryParams,
): URLSearchParams {
  const { sessionId, geo } = userContext;
  const { country, language, region, city, ip } = geo!;
  const { articleId, pageSize, nextPage, keywords, category } =
    articleQueryParams;

  const searchParams = new URLSearchParams();

  searchParams.set("apikey", apiKey);

  if (articleId) {
    // Fetches Single article By Id
    searchParams.set("id", articleId);
  } else {
    // Fetch 1 page of articles (latest or by other search params)
    // Dynamic Params
    if (country) searchParams.set("country", country);
    if (region) searchParams.set("region", region);
    if (city) searchParams.set("city", city);
    if (language) searchParams.set("language", language);
    if (category?.length) searchParams.set("category", category.join(","));
    if (keywords?.length) searchParams.set("q", keywords.join(","));
    if (nextPage) searchParams.set("page", nextPage as string);

    // Query Params that are static and required
    searchParams.set("size", pageSize ? pageSize.toString() : "" + 10);
  }

  return searchParams;
}
