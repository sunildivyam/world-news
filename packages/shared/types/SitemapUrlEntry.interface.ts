import { AlternateLanguageLink } from "./AlternateLanguageLink.interface";
import { ChangeFrequency } from "./ChangeFrequency.type";

export interface SitemapUrlEntry {
  /** The full URL of the page (required) */
  loc: string;
  /** Optional array of alternate language versions for this page */
  alternates?: AlternateLanguageLink[];
  /** The date of last modification (YYYY-MM-DD or Date object) */
  lastmod?: string | Date;
  /** How frequently the page is likely to change */
  changefreq?: ChangeFrequency;
  /** The priority of this URL relative to other URLs on your site (0.0 to 1.0) */
  priority?: number;
}
