"use client";

import { useEffect, useState } from "react";
import { Orientation } from "../types";

function getOrientation(): Orientation {
  if (typeof window === "undefined") {
    return "portrait";
  }

  return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
}

export default function useOrientation() {
  const [orientation, setOrientation] = useState<Orientation>(getOrientation);

  useEffect(() => {
    const onResize = () => {
      setOrientation(getOrientation());
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  return orientation;
}
