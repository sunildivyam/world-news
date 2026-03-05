import { fetchArticles } from "@/lib/news-service";
import HeroArticle from "@/components/HeroArticle";
import NewsGrid from "@/components/NewsGrid";
import Header from "@/components/Header";
import InfiniteScroll from "@/components/InfiniteScroll";
import { getUserContext } from "@/lib/news/context";
import { SectionError } from "@/components/SectionError";
import { AppError } from "@/types/AppError";
import { ArticleResponse } from "@/types/article";

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
  const data = articlesRes as ArticleResponse;
  const [hero, ...rest] = data.articles || [];

  return (
    <>
      <Header />
      <main className="max-w-full mx-auto px-0 py-0">
        {hero && <HeroArticle article={hero} />}

        <div className="max-w-7xl mx-auto px-4 py-8">
          {rest.length > 0 && <NewsGrid articles={rest} />}

          {/* Pass the server-fetched cursor to the client-side scroll component */}
          <InfiniteScroll initialCursor={data.nextPage} category={category} />
        </div>
      </main>
    </>
  );
}
