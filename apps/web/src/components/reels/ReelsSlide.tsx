"use client";

import { motion } from "motion/react";
import type { Article } from "@worldnews/shared/types";

import NewsCard from "./NewsCard";
import { useReels } from "./context/ReelsContext";

interface Props {
  article: Article;
  index: number;
  width: number;
  height: number;
}

const CONTENT_VARIANTS = {
  inactive: {
    opacity: 0.94,
    scale: 0.985,
  },
  active: {
    opacity: 1,
    scale: 1,
  },
};

export default function ReelsSlide({ article, index, width, height }: Props) {
  const { orientation, currentIndex } = useReels();

  const vertical = orientation === "portrait";

  const style = vertical
    ? {
        width,
        height,
        transform: `translateY(${index * height}px)`,
      }
    : {
        width,
        height,
        transform: `translateX(${index * width}px)`,
      };

  const isActive = index === currentIndex;

  return (
    <article style={style} aria-hidden={!isActive} className="bg-background absolute top-0 left-0 overflow-hidden">
      <motion.div
        initial="inactive"
        animate={isActive ? "active" : "inactive"}
        variants={CONTENT_VARIANTS}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        className="h-full w-full"
      >
        <NewsCard article={article} priority={isActive} className="h-full w-full rounded-none border-0" />
      </motion.div>
    </article>
  );
}
