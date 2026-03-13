import { fetchArticles } from "@/lib/news-service";
import { categories } from "@/app-constants/categories";
import Header from "@/components/Header";
import HeroArticle from "@/components/HeroArticle";
import NewsGrid from "@/components/NewsGrid";
import InfiniteScroll from "@/components/InfiniteScroll";
import { SectionError } from "@/components/SectionError";
import { getUserContext } from "@/lib/UserContext.service";
import { AppError } from "@/types/AppError.class";
import { ArticleQueryParams } from "@/types/ArticleQueryParams";
import { ArticleCollection } from "@/types/ArticleCollection.interface";
import LocalisedTitle from "@/components/LocalisedTitle";

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
      `${category} is not valid`,
      400,
    );
    return <SectionError error={error} />;
  }

  // 4. Fetch Articles
  const fetchOptions: ArticleQueryParams = {
    category: [category],
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
      <Header />
      <main className="max-w-full mx-auto px-0 py-0">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 capitalize text-brand">
            <LocalisedTitle
              userContext={userContext}
              title={category}
              postfix="News"
            />
          </h1>
        </div>

        {hero && <HeroArticle article={hero} />}

        <div className="max-w-7xl mx-auto px-4 py-8">
          {rest.length > 0 && <NewsGrid articles={rest} />}

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
