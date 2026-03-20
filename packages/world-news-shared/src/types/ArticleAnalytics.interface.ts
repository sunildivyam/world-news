import type { EngagementMetrics } from "./EngagementMetrics.interface";
import type { SentimentMetrics } from "./SentimentMetrics.interface";
import type { TrendMetrics } from "./TrendMatrics.interface";

export interface ArticleAnalytics {
  popularity?: number; // 0–100 normalized score
  priority?: number; // editorial / algorithmic priority
  sentiment?: SentimentMetrics;
  engagement?: EngagementMetrics;
  trend?: TrendMetrics;
}
