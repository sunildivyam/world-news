import { Article, ArticleResponse } from "@/types/article";

export interface ApiArticle {
  article_id: string;
  link: string;
  title: string;
  description: string;
  content: string;
  keywords: Array<string>;
  creator: Array<string>;
  language: string;
  country: Array<string>;
  category: Array<string>;
  datatype: string;
  pubDate: string;
  pubDateTZ: string;
  fetched_at: string;
  image_url: string;
  video_url: string;
  source_id: string;
  source_name: string;
  source_priority: number;
  source_url: string;
  source_icon: string;
  sentiment: string;
  sentiment_stats: string;
  ai_tag: string;
  ai_region: string;
  ai_org: string;
  ai_summary: string;
  duplicate: boolean;
}

export interface ApiArticlesResponse {
  status: string;
  totalResults: number;
  results: Array<ApiArticle>;
  nextPage?: string;
}

export const parseArticle = (raw: ApiArticle): Article => {
  if (!raw) throw new Error("Parsing Error: Empty Article");

  return {
    id: raw.article_id,
    slug: raw.article_id, // for now use id as slug
    title: raw.title,
    description: raw.description,
    content:
      raw.content === "ONLY AVAILABLE IN PAID PLANS" ? undefined : raw.content,
    imageUrl: raw.image_url,
    source: raw.source_name,
    publishedAt: raw.pubDate,
    category: (raw.category && raw.category[0]) || "",
    tags: raw.keywords ?? [],
    language: raw.language ?? "en",
  } as Article;
};

export const parseArticlesResponse = (
  raw: ApiArticlesResponse,
): ArticleResponse => {
  if (!raw || (raw && !raw.results?.length))
    return { articles: [], totalCount: 0, nextPage: null };

  const articleRes: ArticleResponse = {
    totalCount: raw.totalResults || 0,
    nextPage: raw.nextPage || null,
    articles: raw.results.map((item: ApiArticle) => parseArticle(item)) || [],
  };

  return articleRes;
};
