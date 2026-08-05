import { Metadata } from "next";
import { STATIC_PAGE_META } from "./static.constants";
import { SiteMetaData } from "./types/site-meta";
import { Country, TenantConfig, UserContext } from "../../types";
import { AlternateURLs } from "next/dist/lib/metadata/types/alternative-urls-types";
import { fetchCountries } from "../../news-engine-apis";
import { formatTitle, generateMetadata, parseMetaString } from "./meta-utils";

export async function generateStaticPageMeta(
  userCtx: UserContext,
): Promise<Metadata> {
  const pageId: string = userCtx.pageId || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const staticMetaData = (STATIC_PAGE_META as any)[pageId];

  const { title, description, keywords } = staticMetaData;

  const domain = userCtx.tenantCtx?.tenant?.domain;
  // const siteName: string = userCtx.tenantCtx?.tenant?.name || "";
  const displayName = (userCtx.tenantCtx?.tenant?.settings as TenantConfig)
    .branding.displayName;

  const tenantCountries = await fetchCountries(
    userCtx.tenantCtx?.tenant?.country,
  ).catch((err) => []);

  const siteMetaData: SiteMetaData = {
    title: formatTitle(displayName, title),
    description: parseMetaString(description, displayName),
    keywords: keywords.map((k: string) => parseMetaString(k, displayName)),
    url: `https://${domain}/${tenantCountries[0]?.code || "us"}/${tenantCountries[0]?.languages[0] || "en"}/${pageId}`,
    siteName: displayName,
    alternates: generateAlternates(domain!, tenantCountries, pageId),
  };

  const metaData = generateMetadata(siteMetaData);

  return metaData;
}

function generateAlternates(
  domain: string,
  countries: Country[],
  pageId: string,
): AlternateURLs | null {
  const alternates: AlternateURLs | null = {
    canonical: `https://${domain}/${countries[0]?.code || "us"}/${countries[0]?.languages[0] || "en"}/${pageId}`,
    languages: {},
  };
  countries.forEach((c) => {
    c.languages.forEach((l) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      alternates.languages![`${l}-${c.code.toUpperCase()}` as any] =
        `https://${domain}/${c.code}/${l}/${pageId}`;
    });
  });
  return alternates;
}
