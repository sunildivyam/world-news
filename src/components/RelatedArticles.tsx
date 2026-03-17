"use client";

import NewsCard from "./NewsCard";
import InfiniteScroll from "./InfiniteScroll";
import { Article } from "@/types/Article.interface";
import NewsGrid from "./NewsGrid";

interface Props {
  initialCursor: string | null;
  articles: Array<Article>;
}

export default function RelatedArticles({ initialCursor, articles }: Props) {
  return (
    <>
      <h2 className="text-2xl font-bold mt-16 mb-8 text-brand">
        Related Articles
      </h2>

      <div className="grid gap-8 md:grid-cols-2">
        <NewsGrid articles={articles} />
        {/* {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))} */}
      </div>
      <InfiniteScroll initialCursor={initialCursor} />
    </>
  );
}
