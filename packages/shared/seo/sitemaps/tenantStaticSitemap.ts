import { AlternateLanguageLink, Country, SitemapUrlEntry } from "../../types";
import { buildHrefLang, generateSitemapXml } from "./sitemap";

export function generateTenantStaticSitemap(
  domain: string,
  tenantCountries: Country[],
  staticPages: string[],
) {
  const entries: SitemapUrlEntry[] = [];

  staticPages.map((staticPage) => {
    const alternates = generateAlternates(staticPage);
    alternates.forEach((alternate) => {
      const entry = {
        loc: alternate.href,
        lastmod: new Date(),
        priority: 1,
        changefreq: "monthly",
        alternates:
          alternates?.length > 1
            ? [...alternates, { ...alternates[0], hreflang: "x-default" }]
            : [],
      } as SitemapUrlEntry;
      entries.push(entry);
    });
  });

  function generateAlternates(staticPage: string) {
    const alternates: AlternateLanguageLink[] = [];

    tenantCountries.forEach((c: Country) => {
      c.languages.forEach((l) => {
        const alternate = {
          hreflang: buildHrefLang(c.code, l),
          href: `https://${domain}/${c.code}/${l}/${staticPage}`,
        };
        alternates.push(alternate);
      });
    });

    return alternates;
  }

  return generateSitemapXml(entries);
}
