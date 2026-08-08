"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { Category } from "@worldnews/shared/types";

interface Props {
  category: Category;
  selected: boolean;
  onClick(): void;
}

export default function CategoryItem({ category, selected, onClick }: Props) {
  return (
    <motion.button
      layout
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 450,
        damping: 32,
      }}
      type="button"
      onClick={onClick}
      className={cn("flex w-32 items-center justify-center rounded-full px-4 py-2 text-center transition-colors", selected ? "text-foreground scale-110 font-semibold" : "text-muted-foreground scale-90 opacity-60 hover:opacity-100")}
    >
      <span className="truncate">{category.label}</span>
    </motion.button>
  );
}
