import { Article, Country, NewsPublication, NewsSitemapEntry } from "../../types";
import { generateNewsSitemapXml } from "./sitemap";

export function generateTenantNewsSitemap(
  domain: string,
  googlePubliherName: string,
  tenantCountry: Country,
  articles: Article[],
) {
  const defaultCountry = tenantCountry?.code || "us";
  const defaultLanguage =
    (tenantCountry?.languages && tenantCountry?.languages[0]) || "en";

  const entries = articles?.map(
    (article) =>
      ({
        loc: `https://${domain}/${article.geo?.country || defaultCountry || "us"}/${article.language || defaultLanguage}/article/${article.slug}`,
        title: article.title,
        publicationDate: article.updatedAt,
        publication: {
          name: googlePubliherName,
          language: defaultLanguage,
        } as NewsPublication,
      }) as NewsSitemapEntry,
  );

  return generateNewsSitemapXml(entries);
}
