"use client";

import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import CategoryCarousel from "./CategoryCarousel";
import CategoryOverlay from "./CategoryOverlay";
import { SPRING } from "./constants";
import type { Category } from "@worldnews/shared/types";

interface Props {
  logo: ReactNode;
  categories: Category[];
  activeCategory?: string;
  onCategorySelect?(category: Category): void;
  onOpenChange?(open: boolean): void;
}

export default function CategoryPicker({ logo, categories, activeCategory, onCategorySelect, onOpenChange }: Props) {
  const [open, setOpen] = useState(false);

  const openOverlay = () => {
    setOpen(true);
    onOpenChange?.(true);
  };

  const closeOverlay = () => {
    setOpen(false);
    onOpenChange?.(false);
  };

  const handleCategorySelect = (category: Category) => {
    onCategorySelect?.(category);
    closeOverlay();
  };

  return (
    <>
      <motion.button type="button" layoutId="reels-logo" onClick={openOverlay} transition={SPRING} className="flex cursor-pointer items-center justify-center border-0 bg-transparent outline-none select-none">
        {logo}
      </motion.button>

      <CategoryOverlay open={open} onClose={closeOverlay}>
        <motion.div layoutId="reels-logo" transition={SPRING} className="flex items-center justify-center">
          {logo}
        </motion.div>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ delay: 0.12, ...SPRING }}>
              <CategoryCarousel categories={categories} activeCategory={activeCategory} onSelect={handleCategorySelect} />
            </motion.div>
          )}
        </AnimatePresence>
      </CategoryOverlay>
    </>
  );
}
