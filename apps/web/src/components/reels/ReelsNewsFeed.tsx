"use client";

import { useCallback, useState } from "react";
import type { Article, Category } from "@worldnews/shared/types";

import FeedContent from "./FeedContent";
import { ReelsProvider } from "./context/ReelsContext";
import useViewportSize from "./hooks/useViewportSize";
import type { Orientation, ReelNextPage } from "./types";

interface Props {
  logo: React.ReactNode;
  categories: Category[];
  initialArticles: Article[];
  nextPage?: ReelNextPage;
}

export default function ReelsNewsFeed({ logo, categories, initialArticles, nextPage }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);

  const viewport = useViewportSize();

  const viewportReady = viewport.width > 0 && viewport.height > 0;

  const orientation: Orientation = viewport.width >= viewport.height ? "landscape" : "portrait";

  const handleCategorySelect = useCallback((category: Category) => {
    setSelectedCategory(category);
  }, []);

  if (!viewportReady) {
    return <main className="bg-background fixed inset-0 overflow-hidden" />;
  }

  return (
    <ReelsProvider orientation={orientation} categoryKey={selectedCategory?.name}>
      <FeedContent logo={logo} categories={categories} initialArticles={initialArticles} nextPage={nextPage} category={selectedCategory} onCategorySelect={handleCategorySelect} />
    </ReelsProvider>
  );
}
