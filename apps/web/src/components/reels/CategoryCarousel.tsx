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

type CardState = "previous" | "current" | "next";

function mod(value: number, length: number): number {
  return ((value % length) + length) % length;
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

  const getCategoryIndex = (offset: number) => {
    return mod(currentIndex + offset, categories.length);
  };

  const previousIndex = getCategoryIndex(-1);

  const nextIndex = getCategoryIndex(1);

  const getCardState = (index: number): CardState => {
    if (index === currentIndex) {
      return "current";
    }

    if (index === previousIndex) {
      return "previous";
    }

    return "next";
  };

  const getCardAnimation = (state: CardState) => {
    switch (state) {
      case "previous":
        return {
          x: "-88%",
          scale: 0.72,
          opacity: 0.58,
          zIndex: 10,
        };

      case "current":
        return {
          x: "0%",
          scale: 1,
          opacity: 1,
          zIndex: 20,
        };

      case "next":
        return {
          x: "88%",
          scale: 0.72,
          opacity: 0.58,
          zIndex: 10,
        };
    }
  };

  const visibleIndexes = [previousIndex, currentIndex, nextIndex].filter((index, position, array) => array.indexOf(index) === position);

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
        {visibleIndexes.map((index) => {
          const category = categories[index];

          const state = getCardState(index);

          const animation = getCardAnimation(state);

          const isCurrent = state === "current";

          return (
            <motion.div
              key={category._id ?? category.name}
              initial={false}
              animate={animation}
              transition={{
                x: {
                  type: "spring",
                  stiffness: 260,
                  damping: 28,
                  mass: 0.9,
                },
                scale: {
                  type: "spring",
                  stiffness: 300,
                  damping: 26,
                  mass: 0.85,
                },
                opacity: {
                  type: "spring",
                  stiffness: 260,
                  damping: 30,
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

                  setCurrentIndex(index);
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
