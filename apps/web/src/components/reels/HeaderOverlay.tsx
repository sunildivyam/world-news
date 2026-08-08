"use client";

import type { Category } from "@worldnews/shared/types";
import CategoryPicker from "./CategoryPicker";

interface Props {
  visible: boolean;
  logo: React.ReactNode;
  categories: Category[];
  activeCategory?: string;
  onCategorySelect?(category: Category): void;
  onCategoryOverlayChange?(open: boolean): void;
  onMouseEnter?(): void;
  onMouseLeave?(): void;
}

export default function HeaderOverlay({ visible, logo, categories, activeCategory, onCategorySelect, onCategoryOverlayChange, onMouseEnter, onMouseLeave }: Props) {
  return (
    <header onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={["fixed top-0 right-0 left-0 z-50 flex justify-center pt-4", "bg-gradient-to-b from-black/70 to-transparent", "transition-opacity duration-300", visible ? "opacity-100" : "pointer-events-none opacity-0"].join(" ")}>
      <CategoryPicker logo={logo} categories={categories} activeCategory={activeCategory} onCategorySelect={onCategorySelect} onOpenChange={onCategoryOverlayChange} />
    </header>
  );
}
