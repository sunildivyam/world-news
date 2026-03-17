import { SentimentEnum } from "./SentimentMetrics.enum";

export interface SentimentMetrics {
  label: SentimentEnum;
  score: number; // -1 to +1
}

/**
   {
    "label": "negative",
    "score": -0.62
  }
*/
