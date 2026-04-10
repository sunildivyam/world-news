export interface ContentEngineProgress {
  logs: string[];
  headlines: Array<{ id: string; title: string }>;
  articles: Array<{
    id: string;
    tenantId: string;
    title: string;
    language: string;
  }>;
}
