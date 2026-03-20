import { ArticleQueryParams } from "@/types/ArticleQueryParams.interface";
import { UserContext } from "@/lib/contexts/user/UserContext.interface";
import { BaseArticleProvider } from "../BaseArticleProvider.class";
import { Article } from "@/types/Article.interface";
import { ApiArticle, ApiArticlesResponse } from "./NewsData.interface";
import { ArticleSource } from "@/types/ArticleSource.interface";
import { OriginalArticle } from "@/types/OriginalArticle.interface";
import { ArticleCollection } from "@/types/ArticleCollection.interface";
import { SentimentMetrics } from "@/types/SentimentMetrics.interface";
import { getRandomIntInclusive } from "@/lib/Utils";
import { getLanguageCode } from "@/lib/contexts/language/Language.validators";
import { getCountryCode } from "@/lib/contexts/geo/Geo.validators";
import { SentimentEnum } from "@/types/SentimentMetrics.enum";

export class NewsdataProvider extends BaseArticleProvider {
  name: string = "NewsData";
  baseUrl: string = process.env.NEWSDATA_API_URL ?? "";
  apiKey: string = process.env.NEWSDATA_API_KEY ?? "";

  private parseSentimentMetric(rawArticle: ApiArticle) {
    const label = Object.keys(SentimentEnum).includes(rawArticle.sentiment)
      ? (rawArticle.sentiment as SentimentEnum)
      : SentimentEnum.neutral;
    let score = 0;

    try {
      score = parseFloat(rawArticle.sentiment_stats);
    } catch (error) {}

    const sentiment: SentimentMetrics = { label, score };

    return sentiment;
  }

  public setQueryParams(
    apiKey: string,
    userContext: UserContext,
    articleQueryParams: ArticleQueryParams,
  ): URLSearchParams {
    const { geo } = userContext;
    const { country, language } = geo!;
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
      if (language) sp.set("language", language);
      if (category?.length) sp.set("category", category.join(","));
      if (keywords?.length) sp.set("q", keywords.join(","));
      if (nextPage) sp.set("page", nextPage as string);
      if (pageSize) sp.set("size", pageSize ? pageSize.toString() : "" + 10);
      sp.set("removeduplicate", "1");
      sp.set(
        "excludefield",
        "ai_summary,ai_org,ai_region,sentiment_stats,ai_tag,sentiment,content,video_url",
      );
      sp.set("sort", "pubdateasc");
      sp.set("image", "1");
    }

    return sp;
  }

  parseArticle(rawArticle: ApiArticle): Article | null {
    if (!rawArticle) return null;
    const article: Article = {
      id: rawArticle.article_id,
      slug: rawArticle.article_id,
      tenant: undefined, //DEFAULT_TENANT,
      title: rawArticle.title,
      description: rawArticle.description,
      author: (rawArticle.creator?.length && rawArticle.creator[0]) || "",
      category: (rawArticle.category?.length && rawArticle.category[0]) || "",
      geo: {
        country: getCountryCode(
          (rawArticle.country?.length && rawArticle.country[0]) || "",
        ),
      },
      language: getLanguageCode(rawArticle.language),
      keywords: rawArticle.keywords,
      tags: [],
      publishTZ: rawArticle.pubDateTZ,
      publishDate: rawArticle.pubDate,
      updateDate: rawArticle.pubDate,
      imageUrl: rawArticle.image_url,
      videoUrl: rawArticle.video_url,
      content: undefined,
      analytics: {
        sentiment: this.parseSentimentMetric(rawArticle),
        priority: 0,
        popularity: getRandomIntInclusive(0, 100),
        trend: {
          velocity: getRandomIntInclusive(0, 100),
          momentum: getRandomIntInclusive(0, 100),
          isBreaking: false,
        },
        engagement: {
          views: 0,
          shares: 0,
          comments: 0,
        },
      },
      source: {
        id: rawArticle.source_id,
        name: rawArticle.source_name,
        description: undefined,
        url: rawArticle.source_url,
        iconUrl: rawArticle.source_icon,
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
      url: rawArticle.link,
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
    const { totalResults, results, nextPage } = rawArticleCollection;
    const articleCollection: ArticleCollection = {
      articles: results
        .map((a: any) => this.parseArticle(a))
        .filter((a) => a !== null),
      totalResults,
      nextPage: nextPage!,
    };

    return articleCollection;
  }
}
