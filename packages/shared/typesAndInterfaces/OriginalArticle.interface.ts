import type { ArticleSource } from "./ArticleSource.interface";

export interface OriginalArticle {
  id: string;
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  videoUrl?: string;
  publishTZ: string;
  publishDate: Date | string;
  author?: string;
  source?: ArticleSource;
  articeProviderName?: string;
}
