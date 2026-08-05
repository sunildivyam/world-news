import { UserContext, TenantConfig, Country } from "../../types";
import { Metadata } from "next/dist/types";
import { DEFAULT_PAGE_META } from "./static.constants";
import { SiteMetaData } from "./types/site-meta";
import { formatTitle, generateMetadata, parseMetaString } from "./meta-utils";
import { fetchCountries } from "../../news-engine-apis/countries";
import { AlternateURLs } from "next/dist/lib/metadata/types/alternative-urls-types";

export async function generateDefaultPageMeta(
  userCtx: UserContext,
): Promise<Metadata> {
  const staticMetaData = DEFAULT_PAGE_META;

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
    keywords: keywords.map((k) => parseMetaString(k, displayName)),
    url: `https://${domain}/${tenantCountries[0]?.code || "us"}/${tenantCountries[0]?.languages[0] || "en"}`,
    siteName: displayName,
    alternates: generateAlternates(domain!, tenantCountries),
  };

  const metaData = generateMetadata(siteMetaData);

  return metaData;
}

function generateAlternates(
  domain: string,
  countries: Country[],
): AlternateURLs | null {
  const alternates: AlternateURLs = {
    canonical: `https://${domain}/${countries[0]?.code || "us"}/${countries[0]?.languages[0] || "en"}`,
    languages: {},
  };
  countries.forEach((c) => {
    c.languages.forEach((l) => {
      const key = `${l.toLowerCase()}-${c.code.toUpperCase()}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      alternates.languages![key as any] = `https://${domain}/${c.code}/${l}`;
    });
  });
  return alternates;
}
