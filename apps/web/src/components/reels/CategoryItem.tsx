"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import type { Category } from "@worldnews/shared/types";

interface Props {
  category: Category;
  selected: boolean;
  onClick(): void;
}

export default function CategoryItem({ category, selected, onClick }: Props) {
  return (
    <motion.button
      layout
      type="button"
      onClick={onClick}
      whileTap={{ scale: selected ? 0.97 : 0.94 }}
      whileHover={{ y: selected ? -2 : 0 }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 30,
        mass: 0.8,
      }}
      className={cn("group relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border text-center transition-all duration-300 outline-none", "backdrop-blur-xl select-none", "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2", selected ? "border-border/70 bg-card/90 text-foreground h-32 w-64 px-7 py-5 shadow-2xl shadow-black/20 sm:h-36 sm:w-72" : "border-border/40 bg-card/55 text-muted-foreground h-24 w-40 px-4 py-4 shadow-lg shadow-black/10 sm:h-28 sm:w-48")}
    >
      {selected && (
        <>
          <span className="from-primary/15 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent" />

          <span className="bg-primary/10 pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full blur-3xl" />

          <span className="bg-primary/10 pointer-events-none absolute -bottom-16 -left-16 h-28 w-28 rounded-full blur-3xl" />
        </>
      )}

      <span className={cn("relative z-10 flex min-w-0 flex-col items-center justify-center", selected ? "gap-2" : "gap-1")}>
        <span className={cn("max-w-full truncate font-semibold tracking-tight", selected ? "text-xl sm:text-2xl" : "text-sm sm:text-base")}>{category.label}</span>

        {category.name && category.name !== category.label && <span className={cn("max-w-full truncate tracking-[0.18em] uppercase", selected ? "text-muted-foreground text-[10px] sm:text-xs" : "text-muted-foreground/70 text-[9px]")}>{category.name}</span>}

        {selected && category.description && <span className="text-muted-foreground mt-1 line-clamp-1 max-w-[15rem] text-xs">{category.description}</span>}
      </span>

      {selected && <span className="via-primary/50 pointer-events-none absolute inset-x-8 bottom-2 h-px bg-gradient-to-r from-transparent to-transparent" />}
    </motion.button>
  );
}
