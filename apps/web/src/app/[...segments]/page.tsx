// export const dynamic = "force-dynamic";

import { getUserContext } from "@/lib/contexts/user/UserContext.service";
import { PageTypeEnum } from "@worldnews/shared/types";
import HomePage from "@/pages-components/HomePage";
import CategoryPage from "@/pages-components/CategoryPage";
import StaticPage from "@/pages-components/StaticPage";
import EventPage from "@/pages-components/EventPage";
import TagPage from "@/pages-components/TagPage";
import ArticlePage from "@/pages-components/ArticlePage";
import { generatePageMeta } from "@worldnews/shared/seo/site-meta/meta";
import { resolveTenantContext } from "@/lib/contexts/tenant/Tenant.Resolver";
import { headers } from "next/headers";

export default async function RouterPage() {
  const ctx = await getUserContext();

  if (!ctx) return null;

  const isStaticPage = !ctx.pageType && ctx.pageId;
  const isHomePage = !ctx.pageType && !ctx.pageId;

  if (isHomePage) return <HomePage userContext={ctx} />;
  if (isStaticPage) return <StaticPage userContext={ctx} slug={ctx.pageId!} />;

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

  const userCtx = await getUserContext();
  const tenantCtx = await resolveTenantContext(host, pathname);

  if (!userCtx || !tenantCtx) return {};
  userCtx.tenantCtx = tenantCtx;
  const metaData = await generatePageMeta(userCtx);
  return metaData;
}
