"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { SectionError } from "./SectionError";
import { Article } from "@worldnews/shared/types";
import { AppError } from "@worldnews/shared/types";
import { setUserContextToRequestHeaders } from "@/lib/contexts/user/UserContextClient.Resolver";
import NewsGrid from "./NewsGrid";
import { AppContext } from "./AppContext.Provider";
import NewsCard from "./NewsCard";
import HeroArticle from "./HeroArticle";

interface Props {
  initialArticles: Article[];
  nextPage: string | null;
  maxAutoloadCount?: number;
  category?: string;
  className?: string;
}

export default function PaginatedNewsGrid({
  initialArticles,
  nextPage,
  maxAutoloadCount = 2,
  category,
  className,
}: Props) {
  const { userCtx } = useContext(AppContext) || {};
  const [articles, setArticles] = useState<Article[]>(initialArticles || []);
  const [cursor, setCursor] = useState<string | null>(nextPage);
  const [loading, setLoading] = useState(false);
  const [autoLoadCount, setAutoLoadCount] = useState(0);
  const [hasMore, setHasMore] = useState(!!nextPage);
  const [loadError, setLoadError] = useState<AppError | null>(null);

  const observerRef = useRef<HTMLDivElement | null>(null);

  async function loadMore() {
    if (!cursor || loading) return;
    setLoading(true);
    setLoadError(null);
    const url = new URL("/api/news", window.location.origin);

    if (category) {
      url.searchParams.set("category", category);
    }

    url.searchParams.set("nextPage", cursor);

    const req = new Request(url);
    setUserContextToRequestHeaders(req, userCtx);

    const res = await fetch(req);
    const data = await res.json();

    if (!AppError.isError(data)) {
      setArticles((prev) => [...prev, ...data.articles]);
      setCursor(data.nextPage);
      setHasMore(!!data.nextPage);
      setLoadError(null);
    } else {
      setLoadError(data);
    }

    setLoading(false);
  }

  // AUTOLOAD TWICE
  useEffect(() => {
    if (autoLoadCount >= maxAutoloadCount) return;
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
          setAutoLoadCount((c) => c + 1);
        }
      },
      { threshold: 1 },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [cursor, hasMore, loading, autoLoadCount]);

  const cNames = `grid gap-2 md:gap-4 lg:gap-8 grid-flow-dense mt-12 md:grid-cols-2 lg:grid-cols-4${className ? " " + className : ""}`;

  const isSpanned = (index: number) => index % 4 === 0;
  return (
    <>
      <div className={cNames}>
        {articles.map((article, index) => {
          if (isSpanned(index))
            return (
              <HeroArticle
                key={index + (article._id || "")}
                article={article}
                className="col-span-2 row-span-2 rounded-lg rounded-md"
              />
            );
          return (
            <NewsCard
              key={(article._id || article.slug || article.title) + index}
              article={article}
            />
          );
        })}
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-500">
          Loading more news...
        </div>
      )}
      {loadError && <SectionError error={loadError} isSilent={true} />}
      {autoLoadCount >= 2 && hasMore && !loading && (
        <div className="flex justify-center py-12">
          <button
            onClick={loadMore}
            className="bg-brand px-6 py-3 rounded-lg font-semibold hover:text-red-500 transition"
          >
            Load More
          </button>
        </div>
      )}
      <div ref={observerRef} className="h-10" />
    </>
  );
}
