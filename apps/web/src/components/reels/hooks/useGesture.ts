"use client";

import { useCallback } from "react";
import { SWIPE_THRESHOLD } from "../constants";

export interface UseGestureProps {
  currentIndex: number;
  itemCount: number;
  orientation: "horizontal" | "vertical";
  loop?: boolean;
  onIndexChange(index: number): void;
}

export default function useGesture({ currentIndex, itemCount, orientation, loop = false, onIndexChange }: UseGestureProps) {
  const previousIndex = useCallback(() => {
    if (itemCount <= 0) {
      return 0;
    }

    if (loop) {
      return currentIndex === 0 ? itemCount - 1 : currentIndex - 1;
    }

    return Math.max(0, currentIndex - 1);
  }, [currentIndex, itemCount, loop]);

  const nextIndex = useCallback(() => {
    if (itemCount <= 0) {
      return 0;
    }

    if (loop) {
      return currentIndex === itemCount - 1 ? 0 : currentIndex + 1;
    }

    return Math.min(itemCount - 1, currentIndex + 1);
  }, [currentIndex, itemCount, loop]);

  const onDragEnd = useCallback(
    (_event: unknown, info: { offset: { x: number; y: number } }) => {
      if (itemCount <= 0) {
        return;
      }

      const distance = orientation === "vertical" ? info.offset.y : info.offset.x;

      if (distance < -SWIPE_THRESHOLD) {
        onIndexChange(nextIndex());
        return;
      }

      if (distance > SWIPE_THRESHOLD) {
        onIndexChange(previousIndex());
      }
    },
    [orientation, itemCount, onIndexChange, nextIndex, previousIndex],
  );

  return {
    onDragEnd,
  };
}
