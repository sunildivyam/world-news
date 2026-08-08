"use client";

import { useEffect, useState } from "react";
import type { Orientation } from "../types";

function getOrientation(): Orientation {
  if (typeof window === "undefined") {
    return "portrait";
  }

  return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
}

export default function useOrientation() {
  const [orientation, setOrientation] = useState<Orientation>("portrait");

  useEffect(() => {
    let timer: number | null = null;

    const update = () => {
      if (timer !== null) {
        window.clearTimeout(timer);
      }

      timer = window.setTimeout(() => {
        setOrientation(getOrientation());
        timer = null;
      }, 120);
    };

    setOrientation(getOrientation());

    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update, { passive: true });

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);

      if (timer !== null) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  return orientation;
}
