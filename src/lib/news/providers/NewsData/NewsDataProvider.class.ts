import { ArticleQueryParams } from "@/types/ArticleQueryParams";
import { UserContext } from "@/types/UserContext.interface";
import {
  BaseArticleProvider,
  setQueryParams,
} from "../BaseArticleProvider.class";
import { Article, Sentiment, SentimentStats } from "@/types/Article.interface";
import { ApiArticle, ApiArticlesResponse } from "./NewsData.interface";
import { ArticleSource } from "@/types/ArticleSource.interface";
import { OriginalArticle } from "@/types/OriginalArticle.interface";
import { ArticleCollection } from "@/types/ArticleCollection.interface";

export class NewsdataProvider extends BaseArticleProvider {
  name: string = "NewsData";
  baseUrl: string = process.env.NEWSDATA_API_URL ?? "";
  apiKey: string = process.env.NEWSDATA_API_KEY ?? "";

  createRequest(
    userContext: UserContext,
    articleQueryParams: ArticleQueryParams,
  ): Request {
    const url = new URL(this.baseUrl);
    const { country, language } = userContext.geo!;

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
      title: rawArticle.title,
      description: rawArticle.description,
      author: (rawArticle.creator?.length && rawArticle.creator[0]) || "",
      category: (rawArticle.category?.length && rawArticle.category[0]) || "",
      country: (rawArticle.country?.length && rawArticle.country[0]) || "",
      language: rawArticle.language,
      keywords: rawArticle.keywords,
      tags: [],
      publishTZ: rawArticle.pubDateTZ,
      publishDate: rawArticle.pubDate,
      updateDate: rawArticle.pubDate,
      imageUrl: rawArticle.image_url,
      videoUrl: rawArticle.video_url,
      content: undefined,
      sentiment: rawArticle.sentiment as Sentiment,
      sentimentStats: {
        score: rawArticle.sentiment_stats ?? undefined,
        confidence: undefined,
      } as SentimentStats,
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
