import { fetchArticles } from "@/lib/news-service";
import HeroArticle from "@/components/HeroArticle";
import { SectionError } from "@/components/SectionError";
import { AppError } from "@worldnews/shared/types";
import type { ArticleCollection } from "@worldnews/shared/types";
import type { UserContext } from "@worldnews/shared/types";
import type { TenantConfig } from "@worldnews/shared/types";
import PaginatedNewsGrid from "@/components/PaginatedNewsGrid";

export default async function HomePage({
  userContext,
}: {
  userContext: UserContext;
}) {
  // 2. Perform the fetch directly
  const articlesRes = await fetchArticles(userContext, {}).catch(
    (err: AppError) => err,
  );

  // 3. Handle Errors immediately without state
  if (AppError.isError(articlesRes)) {
    return <SectionError error={articlesRes as AppError} />;
  }

  // 4. Extract data (articlesRes is now guaranteed to be ArticleResponse)
  const articleCollection = articlesRes as ArticleCollection;
  const [hero, ...rest] = articleCollection.articles || [];

  return (
    <>
      <main className="max-w-full mx-auto px-0 py-0">
        {/* {tenantConfig.homepage.sections.map((section, i) => {
          switch (section.type) {
            case "hero":
              return <HeroSection key={i} />;

            case "trending":
              return <TrendingSection key={i} />;

            case "latest":
              return <LatestSection key={i} />;

            case "category":
              return (
                <CategorySection key={i} category={section.config.category} />
              );

            default:
              return null;
          }
        })} */}

        {hero && (
          <div className="h-[70vh]">
            <HeroArticle article={hero} />
          </div>
        )}

        <div className="max-w-full mx-auto px-1 md:px-4 py-8">
          <PaginatedNewsGrid
            initialArticles={rest}
            nextPage={articleCollection.nextPage as string}
            maxAutoloadCount={2}
            category={undefined}
            className=""
          />
        </div>
      </main>
    </>
  );
}
