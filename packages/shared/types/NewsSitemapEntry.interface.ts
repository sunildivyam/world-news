import { NewsPublication } from "./NewsPublication.interface";

export interface NewsSitemapEntry {
  /** Full URL of the news article */
  loc: string;
  /** Publication metadata */
  publication: NewsPublication;
  /** Article title (as it appears on the article page) */
  title: string;
  /** Article publication date (Must be ISO 8601 format, e.g. YYYY-MM-DD or YYYY-MM-DDThh:mm:ssTZD) */
  publicationDate: string | Date;
}
