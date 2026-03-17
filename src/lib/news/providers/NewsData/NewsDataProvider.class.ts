import { ArticleQueryParams } from "@/types/ArticleQueryParams";
import { UserContext } from "@/lib/contexts/user/UserContext.interface";
import {
  BaseArticleProvider,
  setQueryParams,
} from "../BaseArticleProvider.class";
import { Article } from "@/types/Article.interface";
import { ApiArticle, ApiArticlesResponse } from "./NewsData.interface";
import { ArticleSource } from "@/types/ArticleSource.interface";
import { OriginalArticle } from "@/types/OriginalArticle.interface";
import { ArticleCollection } from "@/types/ArticleCollection.interface";
import { SentimentEnum, SentimentMetrics } from "@/types/SentimentMetrics";
import { getRandomIntInclusive } from "@/lib/Utils";
import { getLanguageCode } from "@/lib/contexts/language/Language.validators";
import { getCountryCode } from "@/lib/contexts/geo/Geo.validators";
import { DEFAULT_TENANT } from "@/app-constants/tenants.constant";

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

  createRequest(
    userContext: UserContext,
    articleQueryParams: ArticleQueryParams,
  ): Request {
    const url = new URL(this.baseUrl);
    const { country, language } = userContext?.geo || {};

    // set only supported geo to query params
    const sp = setQueryParams(
      this.apiKey,
      { geo: { country, language } },
      { ...articleQueryParams },
    );

    if (!articleQueryParams.articleId) {
      sp.set("removeduplicate", "1");
      sp.set(
        "excludefield",
        "ai_summary,ai_org,ai_region,sentiment_stats,ai_tag,sentiment,content,video_url,source_priority,source_icon,source_url,source_name,source_id",
      );
      sp.set("sort", "pubdateasc");
      sp.set("image", "1");
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
      id: rawArticle.article_id,
      slug: rawArticle.article_id,
      tenant: DEFAULT_TENANT,
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
