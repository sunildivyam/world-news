"use client";

import { Category } from "@worldnews/shared/types";
import CategoryPicker from "./CategoryPicker";

interface Props {
  visible: boolean;
  logo: React.ReactNode;
  categories: Category[];
  activeCategory?: string;
  onCategorySelect?(category: Category): void;
  onMouseEnter?(): void;
  onMouseLeave?(): void;
}

export default function HeaderOverlay({ visible, logo, categories, activeCategory, onCategorySelect, onMouseEnter, onMouseLeave }: Props) {
  return (
    <header onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={["fixed top-0 right-0 left-0 z-50 flex justify-center pt-4", "transition-opacity duration-300", visible ? "opacity-100" : "pointer-events-none opacity-0", "bg-gradient-to-t from-transparent to-black/70"].join(" ")}>
      <CategoryPicker logo={logo} categories={categories} activeCategory={activeCategory} onCategorySelect={onCategorySelect} />
    </header>
  );
}
