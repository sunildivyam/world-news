"use client";

import { useEffect, useState } from "react";

export interface ViewportSize {
  width: number;
  height: number;
  isResizing: boolean;
}

function readViewport(): Pick<ViewportSize, "width" | "height"> {
  if (typeof window === "undefined") {
    return { width: 0, height: 0 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export default function useViewportSize(): ViewportSize {
  const [viewport, setViewport] = useState<ViewportSize>(() => ({
    ...readViewport(),
    isResizing: false,
  }));

  useEffect(() => {
    let timer: number | null = null;
    let frame: number | null = null;

    const update = () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        setViewport({
          ...readViewport(),
          isResizing: true,
        });
        frame = null;
      });

      if (timer !== null) {
        window.clearTimeout(timer);
      }

      timer = window.setTimeout(() => {
        setViewport((current) => ({
          ...current,
          ...readViewport(),
          isResizing: false,
        }));
        timer = null;
      }, 120);
    };

    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update, { passive: true });

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);

      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      if (timer !== null) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  return viewport;
}
