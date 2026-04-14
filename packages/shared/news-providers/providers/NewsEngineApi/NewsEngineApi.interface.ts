import {
  ArticleAnalytics,
  ArticleContent,
  ArticleGeo,
  ArticleSource,
  Tenant,
} from "../../../types";

export interface ApiArticle {
  _id?: string;
  slug: string;
  title: string;
  description: string;
  author: string;
  category: string;
  geo: ArticleGeo;
  language: string;
  keywords: string[];
  tags: string[];
  tenantId: string;
  sourceId: string;
  url: string; // article's full url with tenant's https://domain/country/region/city/article-slug-id
  imageUrl?: string;
  videoUrl?: string;
  content?: ArticleContent;
  analytics?: ArticleAnalytics;
  publishedAt?: Date | string;
  updatedAt?: Date | string;
  createdAt?: Date | string;
  // non db properties. These can be populated on demand
  tenant?: Tenant;
  source?: ArticleSource;
}

export interface ApiArticlesResponse {
  status: string;
  totalResults: number;
  articles: Array<ApiArticle>;
  nextPage?: string;
}
