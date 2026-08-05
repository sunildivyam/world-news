"use client";

import NewsCard from "./NewsCard";
import InfiniteScroll from "./InfiniteScroll";
import { Article } from "@worldnews/shared/types";
import NewsGrid from "./NewsGrid";
import PaginatedNewsGrid from "./PaginatedNewsGrid";

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

      <div className="max-w-full mx-auto px-1 md:px-4 py-8">
        {/* <NewsGrid
          articles={articles}
          className="md:grid-cols-2 lg:grid-cols-3"
        /> */}
        {/* {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))} */}

        <PaginatedNewsGrid
          initialArticles={articles}
          nextPage={initialCursor}
          maxAutoloadCount={2}
          category={undefined}
          className=""
        />
      </div>
      {/* <InfiniteScroll initialCursor={initialCursor} /> */}
    </>
  );
}
