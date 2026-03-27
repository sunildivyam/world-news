import type { ArticleAnalytics } from "./ArticleAnalytics.interface";
import type { ArticleContent } from "./ArticleContent.type";
import type { ArticleGeo } from "./ArticleGeo.interface";
import type { ArticleSource } from "./ArticleSource.interface";
import type { OriginalArticle } from "./OriginalArticle.interface";
import type { Tenant } from "./Tenant.interface";

export interface Article {
  // metadata fields
  id: string;
  slug: string;
  title: string;
  description: string;
  author: string;
  category: string;
  geo: ArticleGeo;
  language: string;
  keywords: string[];
  tags: string[];
  publishTZ: string;
  publishDate: Date | string;
  updateDate: Date | string;
  // optional fields
  tenant?: Tenant; // TODO: later make this mandatory
  imageUrl?: string;
  videoUrl?: string;
  content?: ArticleContent;
  source?: ArticleSource;
  orginal?: OriginalArticle;
  // Analytical fields
  analytics?: ArticleAnalytics;
}
