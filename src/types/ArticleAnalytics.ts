import { EngagementMetrics } from "./EngagementMetrics";
import { SentimentMetrics } from "./SentimentMetrics";
import { TrendMetrics } from "./TrendMatrics";

export interface ArticleAnalytics {
  popularity?: number; // 0–100 normalized score
  priority?: number; // editorial / algorithmic priority
  sentiment?: SentimentMetrics;
  engagement?: EngagementMetrics;
  trend?: TrendMetrics;
}
