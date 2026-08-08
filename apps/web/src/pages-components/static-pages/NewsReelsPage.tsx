import { fetchArticles } from "@/lib/news-service";
import HeroArticle from "@/components/HeroArticle";
import { SectionError } from "@/components/SectionError";
import { AppError } from "@worldnews/shared/types";
import type { ArticleCollection } from "@worldnews/shared/types";
import type { UserContext } from "@worldnews/shared/types";
import type { TenantConfig } from "@worldnews/shared/types";
import PaginatedNewsGrid from "@/components/PaginatedNewsGrid";
import { ReelsNewsFeed } from "@/components/reels";
import TenantLogo from "@/components/TenantLogo";
import { fetchTenantCategories } from "@worldnews/shared/news-engine-apis/tenants";

export default async function NewsReelsPage({ userContext }: { userContext: UserContext }) {
  const tenantConfig = userContext.tenantCtx?.tenant?.settings;
  const categories = await fetchTenantCategories(userContext?.tenantId).catch(() => []);
  // 2. Perform the fetch directly
  const articlesRes = await fetchArticles(userContext, {}).catch((err: AppError) => err);

  // 3. Handle Errors immediately without state
  if (AppError.isError(articlesRes)) {
    return <SectionError error={articlesRes as AppError} />;
  }

  // 4. Extract data (articlesRes is now guaranteed to be ArticleResponse)
  const articleCollection = articlesRes as ArticleCollection;
  const [...rest] = articleCollection.articles || [];

  const TLogo = <TenantLogo displayName={""} logoUrl={tenantConfig?.branding.logoUrl || ""} />;
  return <ReelsNewsFeed logo={TLogo} categories={categories || []} initialArticles={rest} nextPage={articleCollection.nextPage as string} />;
}
