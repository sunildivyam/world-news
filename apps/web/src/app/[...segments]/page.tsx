import { getUserContext } from "@/lib/contexts/user/UserContext.service";
import { PageTypeEnum } from "@worldnews/shared/types";
import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import StaticPage from "@/pages/StaticPage";
import EventPage from "@/pages/EventPage";
import TagPage from "@/pages/TagPage";
import ArticlePage from "@/pages/ArticlePage";
import { getTenantConfig } from "@/lib/contexts/tenant/Tenant.validators";
import { generatePageMeta } from "@worldnews/shared/seo";
import { resolveTenantContext } from "@/lib/contexts/tenant/Tenant.Resolver";
import { headers } from "next/headers";

export default async function RouterPage() {
  const ctx = await getUserContext();

  if (!ctx) return null;

  if (!ctx.pageType) {
    if (ctx.pageId) {
      return <StaticPage userContext={ctx} slug={ctx.pageId} />;
    }

    return <HomePage userContext={ctx} />;
  }

  switch (ctx.pageType) {
    case PageTypeEnum.article:
      return <ArticlePage userContext={ctx} slug={ctx.pageId!} />;

    case PageTypeEnum.category:
      return <CategoryPage userContext={ctx} slug={ctx.pageId!} />;

    case PageTypeEnum.event:
      return <EventPage userContext={ctx} slug={ctx.pageId!} />;

    case PageTypeEnum.tag:
      return <TagPage userContext={ctx} slug={ctx.pageId!} />;

    default:
      return <HomePage userContext={ctx} />;
  }
}

export async function generateMetadata() {
  const h = await headers();
  const host = h.get("host") || "";
  const pathname = h.get("x-pathname") || "";
  console.log(host, " *** ", pathname);
  const userCtx = await getUserContext();
  const tenantCtx = await resolveTenantContext(host, pathname);

  if (!userCtx || !tenantCtx) return {};
  userCtx.tenantCtx = tenantCtx;
  const metaData = await generatePageMeta(userCtx);
  return metaData;
}
