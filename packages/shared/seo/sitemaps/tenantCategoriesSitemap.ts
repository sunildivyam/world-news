import {
  AlternateLanguageLink,
  Category,
  Country,
  SitemapUrlEntry,
} from "../../types";
import { buildHrefLang, generateSitemapXml } from "./sitemap";

/**
 * Helper to construct formatted URL paths cleanly.
 * Example: buildPath('us', 'en', 'tech') -> '/us-en/tech' or '/us/en/tech'
 * Adjust path formatting based on your router structure (e.g. `/${countryCode}-${langCode}/${categoryCode}`)
 */
function buildUrlPath(
  domain: string,
  countryCode: string,
  langCode: string,
  categoryCode: string,
): string {
  const cleanDomain = domain.replace(/\/+$/, "");

  const geoLangSegment = countryCode ? `${countryCode}/${langCode}` : langCode;

  return `https://${cleanDomain}/${geoLangSegment}/category/${categoryCode}`;
}

export function generateTenantCategoriesSitemap(
  domain: string,
  tenantCountries: Country[],
  categories: Category[],
) {
  const entries: SitemapUrlEntry[] = [];

  categories.map((cat) => {
    const alternates = generateAlternates(cat);
    alternates.forEach((alternate) => {
      const entry = {
        loc: alternate.href,
        lastmod: new Date(),
        priority: 0.8,
        changefreq: "daily",
        alternates:
          alternates?.length > 1
            ? [...alternates, { ...alternates[0], hreflang: "x-default" }]
            : [],
      } as SitemapUrlEntry;
      entries.push(entry);
    });
  });

  function generateAlternates(cat: Category) {
    const alternates: AlternateLanguageLink[] = [];

    tenantCountries.forEach((c: Country) => {
      c.languages.forEach((l) => {
        const alternate = {
          hreflang: buildHrefLang(c.code, l),
          href: `https://${domain}/${c.code}/${l}/${cat.name}`,
        };
        alternates.push(alternate);
      });
    });

    return alternates;
  }

  return generateSitemapXml(entries);
}
