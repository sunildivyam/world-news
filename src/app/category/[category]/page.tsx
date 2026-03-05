import { fetchArticles } from "@/lib/news-service";
import { categories } from "@/lib/categories";
import Header from "@/components/Header";
import HeroArticle from "@/components/HeroArticle";
import NewsGrid from "@/components/NewsGrid";
import InfiniteScroll from "@/components/InfiniteScroll";
import { getUserContext } from "@/lib/news/context";
import { FetchOptions } from "@/lib/news/provider.interface";
import { SectionError } from "@/components/SectionError";
import { AppError } from "@/types/AppError";
import { ArticleResponse } from "@/types/article";

export const runtime = "edge";

interface Props {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: Props) {
  // 1. Await params (Required in Next.js 15)
  const { category } = await params;

  // 2. Initial Setup
  const userContext = await getUserContext();
  const validCategory = categories.find((c) => c.value === category);

  // 3. Handle Invalid Category immediately
  if (!validCategory) {
    const error = new AppError(
      "Category Page",
      "INVALID_CATEGORY",
      `${category} is not valid`,
      400,
    );
    return <SectionError error={error} />;
  }

  // 4. Fetch Articles
  const fetchOptions: FetchOptions = {
    categories: [category],
  };

  const articlesRes = await fetchArticles(userContext, fetchOptions);

  // 5. Check for Fetch Errors
  if (AppError.isError(articlesRes)) {
    return <SectionError error={articlesRes as AppError} />;
  }

  // 6. Type Cast and Destructure
  const articleData = articlesRes as ArticleResponse;
  const articles = articleData.articles || [];
  const [hero, ...rest] = articles;

  return (
    <>
      <Header />
      <main className="max-w-full mx-auto px-0 py-0">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6 capitalize text-brand">
            {validCategory.label}
          </h2>
        </div>

        {hero && <HeroArticle article={hero} />}

        <div className="max-w-7xl mx-auto px-4 py-8">
          {rest.length > 0 && <NewsGrid articles={rest} />}

          <InfiniteScroll
            initialCursor={articleData.nextPage}
            category={category}
          />
        </div>
      </main>
    </>
  );
}
