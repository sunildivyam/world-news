"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

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

  const getIndex = (offset: number): number => {
    const length = categories.length;

    return (currentIndex + offset + length) % length;
  };

  const visibleItems = [
    {
      category: categories[getIndex(-1)],
      position: "previous",
      offset: -1,
    },
    {
      category: categories[getIndex(0)],
      position: "current",
      offset: 0,
    },
    {
      category: categories[getIndex(1)],
      position: "next",
      offset: 1,
    },
  ];

  return (
    <div className="relative">
      <div className="bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 h-48 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      <motion.div
        drag="x"
        dragElastic={DRAG_ELASTIC}
        dragMomentum={false}
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        dragDirectionLock
        onDragEnd={onDragEnd}
        className="relative flex h-40 w-full touch-pan-y items-center justify-center overflow-visible select-none sm:h-44"
      >
        {visibleItems.map(({ category, position, offset }) => {
          const isCurrent = position === "current";

          const isPrevious = position === "previous";

          return (
            <motion.div
              key={`${category.name}-${position}`}
              initial={false}
              animate={{
                x: isCurrent ? 0 : isPrevious ? "-88%" : "88%",
                scale: isCurrent ? 1 : 0.72,
                opacity: isCurrent ? 1 : 0.62,
                zIndex: isCurrent ? 20 : 10,
              }}
              transition={{
                ...SPRING,
                scale: {
                  type: "spring",
                  stiffness: 360,
                  damping: 30,
                  mass: 0.8,
                },
                x: {
                  type: "spring",
                  stiffness: 320,
                  damping: 28,
                  mass: 0.85,
                },
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <CategoryItem
                category={category}
                selected={isCurrent}
                onClick={() => {
                  if (isCurrent) {
                    onSelect(category);
                    return;
                  }

                  setCurrentIndex(getIndex(offset));
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      <div className="text-muted-foreground/60 pointer-events-none mt-5 flex items-center justify-center gap-3">
        <span className="bg-border/60 h-px w-8" />

        <span className="text-[10px] font-medium tracking-[0.25em] uppercase">Swipe to explore</span>

        <span className="bg-border/60 h-px w-8" />
      </div>
    </div>
  );
}
