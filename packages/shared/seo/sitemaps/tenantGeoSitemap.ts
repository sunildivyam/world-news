import { AlternateLanguageLink, Country, SitemapUrlEntry } from "../../types";
import { buildHrefLang, generateSitemapXml } from "./sitemap";

export function generateTenantGeoSitemap(
  domain: string,
  tenantCountries: Country[],
) {
  const entries: SitemapUrlEntry[] = [];

  tenantCountries.map((country) => {
    const alternates = generateAlternates(country);
    alternates.forEach((alternate) => {
      const entry = {
        loc: alternate.href,
        lastmod: new Date(),
        priority: 1,
        changefreq: "daily",
        alternates:
          alternates?.length > 1
            ? [...alternates, { ...alternates[0], hreflang: "x-default" }]
            : [],
      } as SitemapUrlEntry;
      entries.push(entry);
    });
  });

  function generateAlternates(country: Country) {
    const alternates: AlternateLanguageLink[] = [];

    country.languages.forEach((l) => {
      const alternate = {
        hreflang: buildHrefLang(country.code, l),
        href: `https://${domain}/${country.code}/${l}`,
      };
      alternates.push(alternate);
    });

    return alternates;
  }

  return generateSitemapXml(entries);
}
