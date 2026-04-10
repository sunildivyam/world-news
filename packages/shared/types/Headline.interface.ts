import { Article } from "./Article.interface";

export interface Headline extends Article {
  tenantIds?: string[];
  providerName: string;
  contentGenerated?: {
    language: string[];
    tenantId: string[];
  };
  contentGeneratedAt?: Date | string | null;
}
