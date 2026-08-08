"use client";

import { useCallback, useState } from "react";
import type { Article, Category } from "@worldnews/shared/types";

import FeedContent from "./FeedContent";
import { ReelsProvider } from "./context/ReelsContext";
import useHydrated from "./hooks/useHydrated";
import useOrientation from "./hooks/useOrientation";
import type { ReelNextPage } from "./types";

interface Props {
  logo: React.ReactNode;
  categories: Category[];
  initialArticles: Article[];
  nextPage?: ReelNextPage;
}

export default function ReelsNewsFeed({ logo, categories, initialArticles, nextPage }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);

  const orientation = useOrientation();
  const hydrated = useHydrated();

  // Keep SSR and the first client render identical.
  const effectiveOrientation = hydrated ? orientation : "portrait";

  const handleCategorySelect = useCallback((category: Category) => {
    setSelectedCategory(category);
  }, []);

  return (
    <ReelsProvider orientation={effectiveOrientation} categoryKey={selectedCategory?.name}>
      <FeedContent logo={logo} categories={categories} initialArticles={initialArticles} nextPage={nextPage} category={selectedCategory} onCategorySelect={handleCategorySelect} />
    </ReelsProvider>
  );
}
