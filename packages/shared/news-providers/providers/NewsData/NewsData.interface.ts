export interface ApiArticle {
  article_id: string;
  link: string;
  title: string;
  description: string;
  content: string;
  keywords: Array<string>;
  creator: Array<string>;
  language: string;
  country: Array<string>;
  category: Array<string>;
  datatype: string;
  pubDate: string;
  pubDateTZ: string;
  fetched_at: string;
  image_url: string;
  video_url: string;
  source_id: string;
  source_name: string;
  source_priority: number;
  source_url: string;
  source_icon: string;
  sentiment: string;
  sentiment_stats: string;
  ai_tag: string;
  ai_region: string;
  ai_org: string;
  ai_summary: string;
  duplicate: boolean;
}

export interface ApiArticlesResponse {
  status: string;
  totalResults: number;
  results: Array<ApiArticle>;
  nextPage?: string;
}
