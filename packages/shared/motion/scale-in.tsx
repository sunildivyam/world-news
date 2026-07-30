"use client";

import { motionConfig } from "./motion-config";
import { motion } from "motion/react";
import { ReactNode } from "react";

export interface ScaleInProps {
  className?: string;
  as?: string;
  children: ReactNode;
  delay?: number;
  once?: boolean;
}

export function ScaleIn({
  className,
  as,
  children,
  delay = motionConfig.delay,
  once = motionConfig.viewport.once,
}: ScaleInProps) {
   const Component = motion[as || "div"];

  return (
    <Component
      className={className}
      initial={{
        opacity: 0,
        scale: 0.9,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
      }}
      viewport={{ once }}
      transition={{
        duration: motionConfig.duration.normal,
        delay,
        ease: motionConfig.ease,
      }}
    >
      {children}
    </Component>
  );
}
