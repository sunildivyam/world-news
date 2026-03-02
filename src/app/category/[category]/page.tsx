import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { fetchNews } from "@/lib/news-service";
import { categories } from "@/lib/categories";
import Header from "@/components/Header";
import HeroArticle from "@/components/HeroArticle";
import NewsGrid from "@/components/NewsGrid";
import InfiniteScroll from "@/components/InfiniteScroll";

export const runtime = "edge";

interface Props {
  params: { category: string };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  const validCategory = categories.find((c) => c.value === category);

  if (!validCategory) {
    return notFound();
  }

  const headerList = await headers();

  const data = await fetchNews({
    country: headerList.get("x-user-country") || "US",
    region: headerList.get("x-user-region") || "",
    city: headerList.get("x-user-city") || "",
    ip: headerList.get("x-user-ip") || "",
    language: headerList.get("x-user-language") || "en",
    category,
    limit: 10,
  });

  const [hero, ...rest] = data.articles;

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
          <NewsGrid articles={rest} />
          <InfiniteScroll initialCursor={data.nextCursor} category={category} />
        </div>
      </main>
    </>
  );
}
