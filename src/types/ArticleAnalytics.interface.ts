import { EngagementMetrics } from "./EngagementMetrics.interface";
import { SentimentMetrics } from "./SentimentMetrics.interface";
import { TrendMetrics } from "./TrendMatrics.interface";

export interface ArticleAnalytics {
  popularity?: number; // 0–100 normalized score
  priority?: number; // editorial / algorithmic priority
  sentiment?: SentimentMetrics;
  engagement?: EngagementMetrics;
  trend?: TrendMetrics;
}
