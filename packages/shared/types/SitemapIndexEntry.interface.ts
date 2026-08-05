export interface SitemapIndexEntry {
  /** The full URL of the sitemap (required) */
  loc: string;
  /** The date the sitemap was last modified (YYYY-MM-DD or Date object) */
  lastmod?: string | Date;
}
