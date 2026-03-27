import { fetchArticles } from "@/lib/news-service";
import Header from "@/components/Header";
import HeroArticle from "@/components/HeroArticle";
import NewsGrid from "@/components/NewsGrid";
import InfiniteScroll from "@/components/InfiniteScroll";
import { SectionError } from "@/components/SectionError";
import { AppError } from "@worldnews/shared/types";
import { ArticleQueryParams } from "@worldnews/shared/types";
import { ArticleCollection } from "@worldnews/shared/types";
import LocalisedTitle from "@/components/LocalisedTitle";
import { UserContext } from "@worldnews/shared/types";

export default async function EventPage({
  userContext,
  slug,
}: {
  userContext: UserContext;
  slug: string;
}) {
  // 1. Await params (Required in Next.js 15)

  // 2. Initial Setup
  // 4. Fetch Articles
  const fetchOptions: ArticleQueryParams = {
    event: slug,
  };

  const articlesRes = await fetchArticles(userContext, fetchOptions);

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
