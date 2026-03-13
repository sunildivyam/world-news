"use client";

import { useEffect, useRef, useState } from "react";
import NewsCard from "./NewsCard";
import { SectionError } from "./SectionError";
import { Article } from "@/types/Article.interface";
import { AppError } from "@/types/AppError.class";

interface Props {
  initialCursor: string | null;
  category?: string;
}

export default function InfiniteScroll({ initialCursor, category }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [autoLoadCount, setAutoLoadCount] = useState(0);
  const [hasMore, setHasMore] = useState(!!initialCursor);
  const [loadError, setLoadError] = useState<AppError | null>(null);

  const observerRef = useRef<HTMLDivElement | null>(null);

  async function loadMore() {
    if (!cursor || loading) return;

    setLoading(true);

    const url = new URL("/api/news", window.location.origin);

    if (category) {
      url.searchParams.set("category", category);
    }

    url.searchParams.set("nextPage", cursor);

    const res = await fetch(url.toString());
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
    if (autoLoadCount >= 2) return;
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

  return (
    <>
      <div className="grid gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-500">
          Loading more news...
        </div>
      )}

      {loadError && <SectionError error={loadError} />}

      {autoLoadCount >= 2 && hasMore && !loading && (
        <div className="flex justify-center py-12">
          <button
            onClick={loadMore}
            className="bg-brand text-black px-6 py-3 rounded-lg font-semibold hover:bg-brand-dark transition"
          >
            Load More
          </button>
        </div>
      )}

      <div ref={observerRef} className="h-10" />
    </>
  );
}
