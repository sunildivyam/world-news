import type { ArticleAnalytics } from "./ArticleAnalytics.interface";
import type { ArticleContent } from "./ArticleContent.type";
import type { ArticleGeo } from "./ArticleGeo.interface";
import type { ArticleSource } from "./ArticleSource.interface";
import { Tenant } from "./Tenant.interface";

export interface Article {
  id?: string;
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
