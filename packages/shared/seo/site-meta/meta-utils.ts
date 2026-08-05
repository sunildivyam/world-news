import { Metadata } from "next/types";
import { SiteMetaData } from "./types/site-meta";
import { Author } from "next/dist/lib/metadata/types/metadata-types";

export function parseMetaString(metaStr: string, siteName: string): string {
  return metaStr.replace(/{{siteName}}/g, siteName);
}

export function formatTitle(displayName: string, title: string) {
  return `${displayName} | ${title}`;
}

export function generateMetadata(siteMetaData: SiteMetaData): Metadata {
  const {
    siteName,
    title,
    description,
    keywords,
    url,
    images,
    authors,
    creator,
    publisher,
    category,
    publishedAt,
    updatedAt,
  } = siteMetaData;

  const metaData: Metadata = {
    // ------------------------------------------------------------------
    // BASE METADATA
    // ------------------------------------------------------------------
    title,
    description,
    keywords: [siteName, `${siteName} News`, ...keywords],
    authors: authors?.map((name) => ({ name }) as Author),
    creator,
    publisher,
    category,
    applicationName: siteName,

    // ------------------------------------------------------------------
    // CANONICAL & ALTERNATE LINKS (Essential for News SEO)
    // ------------------------------------------------------------------
    alternates: {
      canonical: url,
      languages: {},
      types: {},
    },

    // ------------------------------------------------------------------
    // ROBOTS & CRAWL INSTRUCTIONS (Google News friendly)
    // ------------------------------------------------------------------
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // ------------------------------------------------------------------
    // OPEN GRAPH / FACEBOOK / LINKEDIN
    // ------------------------------------------------------------------
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: "en_US",
      type: "article", // Crucial for News articles
      publishedTime: publishedAt,
      modifiedTime: updatedAt,
      authors,
      section: undefined,
      tags: [...keywords],
      images: images?.map((imgUrl) => ({
        url: imgUrl,
        width: 1200,
        height: 630,
        alt: title,
        type: "image/jpeg",
      })),
    },

    // ------------------------------------------------------------------
    // TWITTER CARD METADATA
    // ------------------------------------------------------------------
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: siteName,
      creator,
      images: images?.map((imgUrl) => ({
        url: imgUrl,
        alt: title,
      })),
    },

    // ------------------------------------------------------------------
    // APPLE / MOBILE APPS / ICONS
    // ------------------------------------------------------------------
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    // manifest: "/site.webmanifest",

    // ------------------------------------------------------------------
    // OTHER NEWS-SPECIFIC METADATA
    // ------------------------------------------------------------------
    other: {
      // News specific publication dates for aggregators
      "article:published_time": publishedAt || "",
      "article:modified_time": updatedAt || "",
      "article:section": "",

      // Smart App Banner if mobile app exists
      // 'apple-itunes-app': 'app-id=123456789',
    },
  };

  return metaData;
}
