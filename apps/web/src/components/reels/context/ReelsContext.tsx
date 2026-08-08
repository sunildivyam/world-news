"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import type { Orientation, ReelsContextValue, ReelsAxis } from "../types";

const ReelsContext = createContext<ReelsContextValue | null>(null);

interface ProviderProps {
  children: ReactNode;
  orientation: Orientation;
  categoryKey?: string;
}

export function ReelsProvider({ children, orientation, categoryKey }: ProviderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const axis: ReelsAxis = orientation === "portrait" ? "y" : "x";

  useEffect(() => {
    setCurrentIndex(0);
  }, [categoryKey]);

  const value = useMemo<ReelsContextValue>(
    () => ({
      currentIndex,
      setCurrentIndex,
      orientation,
      axis,
    }),
    [currentIndex, orientation, axis],
  );

  return <ReelsContext.Provider value={value}>{children}</ReelsContext.Provider>;
}

export function useReels() {
  const context = useContext(ReelsContext);

  if (!context) {
    throw new Error("useReels must be used inside ReelsProvider");
  }

  return context;
}
