import { ArticleAnalytics } from "./ArticleAnalytics";
import { ArticleContent } from "./ArticleContent.type";
import { ArticleGeo } from "./ArticleGeo.interface";
import { ArticleSource } from "./ArticleSource.interface";
import { OriginalArticle } from "./OriginalArticle.interface";
import { Tenant } from "./Tenant";

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
