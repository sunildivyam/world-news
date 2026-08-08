"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import CategoryItem from "./CategoryItem";
import useGesture from "./hooks/useGesture";
import { DRAG_ELASTIC, SPRING } from "./constants";
import type { Category } from "@worldnews/shared/types";

interface Props {
  categories: Category[];
  activeCategory?: string;
  onSelect(category: Category): void;
}

export default function CategoryCarousel({ categories, activeCategory, onSelect }: Props) {
  const initialIndex = useMemo(() => {
    const index = categories.findIndex((category) => category.name === activeCategory);

    return index >= 0 ? index : 0;
  }, [categories, activeCategory]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const { onDragEnd } = useGesture({
    currentIndex,
    itemCount: categories.length,
    orientation: "horizontal",
    loop: true,
    onIndexChange: setCurrentIndex,
  });

  if (!categories.length) {
    return null;
  }

  const previousIndex = currentIndex === 0 ? categories.length - 1 : currentIndex - 1;

  const nextIndex = currentIndex === categories.length - 1 ? 0 : currentIndex + 1;

  return (
    <div className="relative">
      {/* Decorative glow */}
      <div className="bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 h-48 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      <motion.div drag="x" dragElastic={DRAG_ELASTIC} dragMomentum={false} dragConstraints={{ left: 0, right: 0 }} onDragEnd={onDragEnd} className="relative flex h-36 w-[min(92vw,760px)] touch-pan-y items-center justify-center overflow-visible select-none sm:h-40">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={currentIndex} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={SPRING} className="absolute inset-0">
            {/* Previous */}
            <motion.div
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 0.62,
                x: 0,
              }}
              transition={SPRING}
              className="absolute top-1/2 left-0 -translate-y-1/2"
            >
              <CategoryItem category={categories[previousIndex]} selected={false} onClick={() => setCurrentIndex(previousIndex)} />
            </motion.div>

            {/* Current */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
                x: 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
              }}
              transition={{
                ...SPRING,
                delay: 0.03,
              }}
              className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            >
              <CategoryItem category={categories[currentIndex]} selected onClick={() => onSelect(categories[currentIndex])} />
            </motion.div>

            {/* Next */}
            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 0.62,
                x: 0,
              }}
              transition={SPRING}
              className="absolute top-1/2 right-0 -translate-y-1/2"
            >
              <CategoryItem category={categories[nextIndex]} selected={false} onClick={() => setCurrentIndex(nextIndex)} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Swipe indicator */}
      <div className="text-muted-foreground/60 pointer-events-none mt-5 flex items-center justify-center gap-3">
        <span className="bg-border/60 h-px w-8" />

        <span className="text-[10px] font-medium tracking-[0.25em] uppercase">Swipe to explore</span>

        <span className="bg-border/60 h-px w-8" />
      </div>
    </div>
  );
}
