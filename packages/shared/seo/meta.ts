import {
  PageTypeEnum,
  TenantConfig,
  TenantContext,
  UserContext,
} from "../types";
import { Metadata } from "next";
import { fetchArticle } from "../news-engine-apis/articles";
import { fetchCategory } from "../news-engine-apis/categories";
import { fetchTag } from "../news-engine-apis/tags";
import { fetchNewsEvent } from "../news-engine-apis/newsEvents";

export async function generatePageMeta(
  userCtx: UserContext,
  tenantCtx: TenantContext,
): Promise<Metadata> {
  const { pageType, pageId } = userCtx;
  const { branding } = tenantCtx.tenant?.settings as TenantConfig;
  const { displayName } = branding;

  const baseTitle = `${displayName} - World News`;
  const baseDescription = `Stay updated with the latest news from ${displayName}. Get breaking news, world news, and local news coverage.`;

  if (!pageType) {
    if (pageId) {
      // Static page - for now, use generic metadata
      return {
        title: `${pageId} - ${baseTitle}`,
        description: baseDescription,
      };
    }

    // Home page
    return {
      title: baseTitle,
      description: baseDescription,
    };
  }

  try {
    switch (pageType) {
      case PageTypeEnum.article: {
        const article = await fetchArticle(pageId);
        if (article) {
          return {
            title: `${article.title} - ${baseTitle}`,
            description: article.description || baseDescription,
            keywords: article.keywords?.join(", "),
            openGraph: {
              title: article.title,
              description: article.description,
              images: article.imageUrl
                ? [{ url: article.imageUrl }]
                : undefined,
            },
            twitter: {
              card: "summary_large_image",
              title: article.title,
              description: article.description,
              images: article.imageUrl ? [article.imageUrl] : undefined,
            },
          };
        }
        break;
      }

      case PageTypeEnum.category: {
        const category = await fetchCategory(pageId);
        if (category) {
          return {
            title: `${category.label} News - ${baseTitle}`,
            description:
              category.description ||
              `Latest news in ${category.label} category from ${displayName}.`,
          };
        }
        break;
      }

      case PageTypeEnum.event: {
        const event = await fetchNewsEvent(pageId);
        if (event) {
          return {
            title: `${event.label} - ${baseTitle}`,
            description:
              event.description ||
              `News and updates about ${event.label} from ${displayName}.`,
          };
        }
        break;
      }

      case PageTypeEnum.tag: {
        const tag = await fetchTag(pageId);
        if (tag) {
          return {
            title: `${tag.label} News - ${baseTitle}`,
            description:
              tag.description ||
              `Latest news tagged with ${tag.label} from ${displayName}.`,
          };
        }
        break;
      }
    }
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }

  // Fallback
  return {
    title: baseTitle,
    description: baseDescription,
  };
}
