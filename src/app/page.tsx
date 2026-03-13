import { fetchArticles } from "@/lib/news-service";
import HeroArticle from "@/components/HeroArticle";
import NewsGrid from "@/components/NewsGrid";
import Header from "@/components/Header";
import InfiniteScroll from "@/components/InfiniteScroll";
import { SectionError } from "@/components/SectionError";
import { getUserContext } from "@/lib/UserContext.service";
import { AppError } from "@/types/AppError.class";
import { ArticleCollection } from "@/types/ArticleCollection.interface";

export const runtime = "edge";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  // 1. Await necessary context and params
  const { category } = await searchParams;
  const userContext = await getUserContext();

  // 2. Perform the fetch directly
  const articlesRes = await fetchArticles(userContext, {});

  // 3. Handle Errors immediately without state
  if (AppError.isError(articlesRes)) {
    return <SectionError error={articlesRes as AppError} />;
  }

  // 4. Extract data (articlesRes is now guaranteed to be ArticleResponse)
  const articleCollection = articlesRes as ArticleCollection;
  const [hero, ...rest] = articleCollection.articles || [];

  return (
    <>
      <Header />
      <main className="max-w-full mx-auto px-0 py-0">
        {hero && <HeroArticle article={hero} />}

        <div className="max-w-7xl mx-auto px-4 py-8">
          {rest.length > 0 && <NewsGrid articles={rest} />}

          {/* Pass the server-fetched cursor to the client-side scroll component */}
          {articleCollection.nextPage && (
            <InfiniteScroll
              initialCursor={articleCollection.nextPage as string}
              category={category}
            />
          )}
        </div>
      </main>
    </>
  );
}
