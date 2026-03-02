import { headers } from "next/headers";
import { fetchNews } from "@/lib/news-service";
import HeroArticle from "@/components/HeroArticle";
import NewsGrid from "@/components/NewsGrid";
import Header from "@/components/Header";
import InfiniteScroll from "@/components/InfiniteScroll";

export const runtime = "edge";

interface Props {
  searchParams: { category?: string };
}

export default async function HomePage({ searchParams }: Props) {
  const headerList = await headers();

  // const category = searchParams.category;

  const data = await fetchNews({
    country: headerList.get("x-user-country") || "US",
    region: headerList.get("x-user-region") || "",
    city: headerList.get("x-user-city") || "",
    ip: headerList.get("x-user-ip") || "",
    language: headerList.get("x-user-language") || "en",
    // category,
    limit: 10,
  });

  const [hero, ...rest] = data.articles;

  return (
    <>
      <Header />
      <main className="max-w-full mx-auto px-0 py-0">
        {hero && <HeroArticle article={hero} />}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <NewsGrid articles={rest} />
          <InfiniteScroll initialCursor={data.nextCursor} />
        </div>
      </main>
    </>
  );
}
