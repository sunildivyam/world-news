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
  const [viewport, setViewport] = useState<ViewportSize>({
    width: 0,
    height: 0,
    isResizing: false,
  });

  useEffect(() => {
    let frame: number | null = null;
    let timer: number | null = null;

    const apply = (isResizing: boolean) => {
      const next = readViewport();

      setViewport((current) => {
        if (current.width === next.width && current.height === next.height && current.isResizing === isResizing) {
          return current;
        }

        return {
          ...next,
          isResizing,
        };
      });
    };

    const update = () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        apply(true);
        frame = null;
      });

      if (timer !== null) {
        window.clearTimeout(timer);
      }

      timer = window.setTimeout(() => {
        apply(false);
        timer = null;
      }, 160);
    };

    apply(false);

    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update, {
      passive: true,
    });

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
