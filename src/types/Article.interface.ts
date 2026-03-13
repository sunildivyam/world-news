import { ArticleContent } from "./ArticleContent.type";
import { ArticleSource } from "./ArticleSource.interface";
import { OriginalArticle } from "./OriginalArticle.interface";

export type Sentiment = "positive" | "negative" | "neutral";

export interface SentimentStats {
  score?: number | string;
  confidence?: number | string;
}

export interface Article {
  id: string;
  slug?: string;
  title: string;
  description: string;
  author: string;
  category: string;
  country: string;
  language: string;
  keywords: string[];
  tags: string[];
  publishTZ: string;
  publishDate: Date | string;
  updateDate: Date | string;
  imageUrl?: string;
  videoUrl?: string;
  content?: ArticleContent;
  sentiment?: Sentiment;
  sentimentStats?: SentimentStats;
  source?: ArticleSource;
  orginal?: OriginalArticle;
}
