import { fetchArticles } from "@/lib/news-service";
import HeroArticle from "@/components/HeroArticle";
import NewsGrid from "@/components/NewsGrid";
import InfiniteScroll from "@/components/InfiniteScroll";
import { SectionError } from "@/components/SectionError";
import { AppError } from "@worldnews/shared/types";
import type { ArticleCollection } from "@worldnews/shared/types";
import type { UserContext } from "@worldnews/shared/types";
import type { TenantConfig } from "@worldnews/shared/types";

export default async function HomePage({
  userContext,
}: {
  userContext: UserContext;
}) {
  const tenantConfig: TenantConfig = userContext?.tenantCtx?.tenant?.settings!;

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

        {hero && <HeroArticle article={hero} />}

        <div className="max-w-7xl mx-auto px-4 py-8">
          {rest.length > 0 && (
            <NewsGrid
              articles={rest}
              className="md:grid-cols-2 lg:grid-cols-3"
            />
          )}

          {/* Pass the server-fetched cursor to the client-side scroll component */}
          {articleCollection.nextPage && (
            <InfiniteScroll
              initialCursor={articleCollection.nextPage as string}
            />
          )}
        </div>
      </main>
    </>
  );
}
