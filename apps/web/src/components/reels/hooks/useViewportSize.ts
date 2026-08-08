"use client";

import { useEffect, useState } from "react";

interface ViewportSize {
  width: number;
  height: number;
}

function getViewport(): ViewportSize {
  if (typeof window === "undefined") {
    return {
      width: 0,
      height: 0,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export default function useViewportSize() {
  const [viewport, setViewport] = useState<ViewportSize>(getViewport);

  useEffect(() => {
    const resize = () => {
      setViewport(getViewport());
    };

    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);

    return () => {
      window.removeEventListener("orientationchange", resize);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return viewport;
}
