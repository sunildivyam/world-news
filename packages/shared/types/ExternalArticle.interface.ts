export interface ExternalArticle {
  title: string;
  byline: string | null;
  dir: string | null;
  lang: string | null;
  excerpt: string | null;
  siteName: string | null;
  content: string;
  textContent: string;
  length: number;
  sourceUrl: string;
  publishedAt?: string | null;
}
