import { getUserContext } from "@/lib/contexts/user/UserContext.service";
import { PageTypeEnum } from "@/types/PageType.enum";
import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import StaticPage from "@/pages/StaticPage";
import EventPage from "@/pages/EventPage";
import TagPage from "@/pages/TagPage";
import ArticlePage from "@/pages/ArticlePage";
import { getTenantConfig } from "@/lib/contexts/tenant/Tenant.validators";

export default async function RouterPage() {
  const ctx = await getUserContext();
  const tenantConfig = await getTenantConfig(ctx.tenantId || "");

  if (!ctx.pageType) {
    if (ctx.pageId) {
      return <StaticPage userContext={ctx} slug={ctx.pageId} />;
    }

    return <HomePage userContext={ctx} tenantConfig={tenantConfig} />;
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
      return <HomePage userContext={ctx} tenantConfig={tenantConfig} />;
  }
}
