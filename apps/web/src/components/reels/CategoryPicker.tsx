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
      {/* Collapsed logo */}
      <motion.button
        type="button"
        layoutId="reels-logo"
        onClick={openOverlay}
        transition={SPRING}
        whileHover={{
          scale: 1.04,
        }}
        whileTap={{
          scale: 0.96,
        }}
        className="border-border/40 bg-background/30 focus-visible:ring-ring flex cursor-pointer items-center justify-center rounded-full border p-1.5 shadow-lg shadow-black/10 backdrop-blur-xl outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        {logo}
      </motion.button>

      <CategoryOverlay open={open} onClose={closeOverlay}>
        {/* Expanded logo */}
        <motion.div layoutId="reels-logo" transition={SPRING} className="border-border/50 bg-background/40 relative z-10 mb-7 flex items-center justify-center rounded-2xl border p-2 shadow-xl shadow-black/10 backdrop-blur-xl">
          {logo}
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            ...SPRING,
            delay: 0.08,
          }}
          className="relative z-10 mb-6 text-center"
        >
          <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.3em] uppercase">Explore</p>

          <h2 className="text-foreground mt-1 text-xl font-semibold tracking-tight sm:text-2xl">News Categories</h2>
        </motion.div>

        {/* Category carousel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                y: 24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 24,
              }}
              transition={{
                delay: 0.12,
                ...SPRING,
              }}
              className="relative z-10 w-full"
            >
              <CategoryCarousel categories={categories} activeCategory={activeCategory} onSelect={handleCategorySelect} />
            </motion.div>
          )}
        </AnimatePresence>
      </CategoryOverlay>
    </>
  );
}
