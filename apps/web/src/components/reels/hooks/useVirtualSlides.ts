"use client";

import { useMemo } from "react";
import { VIRTUAL_WINDOW } from "../constants";

interface Props {
  currentIndex: number;
  total: number;
}

export default function useVirtualSlides({ currentIndex, total }: Props) {
  return useMemo(() => {
    const start = Math.max(0, currentIndex - VIRTUAL_WINDOW);

    const end = Math.min(total - 1, currentIndex + VIRTUAL_WINDOW);

    const indexes: number[] = [];

    for (let i = start; i <= end; i++) {
      indexes.push(i);
    }

    return {
      start,
      end,
      indexes,
    };
  }, [currentIndex, total]);
}
