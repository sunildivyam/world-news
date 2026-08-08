"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import CategoryItem from "./CategoryItem";
import useGesture from "./hooks/useGesture";
import { DRAG_ELASTIC, SPRING } from "./constants";
import { Category } from "@worldnews/shared/types";

interface Props {
  categories: Category[];
  activeCategory?: string;
  onSelect(category: Category): void;
}

export default function CategoryCarousel({ categories, activeCategory, onSelect }: Props) {
  const initialIndex = useMemo(() => {
    const index = categories.findIndex((c) => c.name === activeCategory);

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
    <motion.div drag="x" dragElastic={DRAG_ELASTIC} dragMomentum={false} dragConstraints={{ left: 0, right: 0 }} onDragEnd={onDragEnd} className="relative flex h-14 w-[420px] items-center justify-center overflow-hidden select-none">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={currentIndex} layout transition={SPRING} className="absolute inset-0">
          <div className="relative h-full w-full">
            {/* Previous */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2">
              <CategoryItem category={categories[previousIndex]} selected={false} onClick={() => setCurrentIndex(previousIndex)} />
            </div>

            {/* Current */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <CategoryItem category={categories[currentIndex]} selected onClick={() => onSelect(categories[currentIndex])} />
            </div>

            {/* Next */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2">
              <CategoryItem category={categories[nextIndex]} selected={false} onClick={() => setCurrentIndex(nextIndex)} />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
