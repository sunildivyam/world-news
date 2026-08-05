export interface SiteMetaData {
  siteName: string;
  title: string;
  description: string;
  keywords: string[];
  url: string;
  images?: string[];
  authors?: string[];
  creator?: string;
  publisher?: string;
  category?: string;
  publishedAt?: string;
  updatedAt?: string;
  alternates?: AlternateURLs;
}
