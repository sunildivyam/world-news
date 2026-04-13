import { fetchArticles } from "@/lib/news-service";
import HeroArticle from "@/components/HeroArticle";
import NewsGrid from "@/components/NewsGrid";
import InfiniteScroll from "@/components/InfiniteScroll";
import { SectionError } from "@/components/SectionError";
import { AppError } from "@worldnews/shared/types";
import { ArticleQueryParams } from "@worldnews/shared/types";
import { ArticleCollection } from "@worldnews/shared/types";
import LocalisedTitle from "@/components/LocalisedTitle";
import { UserContext } from "@worldnews/shared/types";
import { fetchTenantCategories } from "@worldnews/shared/news-engine-apis";

export default async function CategoryPage({
  userContext,
  slug,
}: {
  userContext: UserContext;
  slug: string;
}) {
  // 1. Await params (Required in Next.js 15)

  // 2. Initial Setup
  const categories = await fetchTenantCategories(userContext?.tenantId).catch(
    (err) => {
      return null;
    },
  );

  const validCategory = categories?.find((c) => c.name === slug);

  // 3. Handle Invalid Category immediately
  if (!validCategory) {
    const error = new AppError("Category Page", `${slug} is not valid`, 400);
    return <SectionError error={error} />;
  }

  // 4. Fetch Articles
  const fetchOptions: ArticleQueryParams = {
    category: [slug],
  };

  const articlesRes = await fetchArticles(userContext, fetchOptions).catch(
    (err: AppError) => err,
  );
  // 5. Check for Fetch Errors
  if (AppError.isError(articlesRes)) {
    return <SectionError error={articlesRes as AppError} />;
  }

  // 6. Type Cast and Destructure
  const articleCollection = articlesRes as ArticleCollection;
  const articles = articleCollection.articles || [];
  const [hero, ...rest] = articles;

  return (
    <>
      <main className="max-w-full mx-auto px-0 py-0">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 capitalize text-brand">
            <LocalisedTitle
              userContext={userContext}
              title={slug}
              postfix="News"
            />
          </h1>
        </div>

        {hero && <HeroArticle article={hero} />}

        <div className="max-w-7xl mx-auto px-4 py-8">
          {rest.length > 0 && (
            <NewsGrid
              articles={rest}
              className="md:grid-cols-2 lg:grid-cols-3"
            />
          )}

          {articleCollection.nextPage && (
            <InfiniteScroll
              initialCursor={articleCollection.nextPage as string}
              category={slug}
            />
          )}
        </div>
      </main>
    </>
  );
}
