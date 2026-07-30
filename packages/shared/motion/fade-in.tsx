"use client";

import { motionConfig } from "./motion-config";
import { motion } from "motion/react";
import { ReactNode } from "react";

export interface FadeInProps {
  className?: string;
  as?: string;
  children: ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function FadeIn({
  className,
  as,
  children,
  delay = motionConfig.delay,
  duration = motionConfig.duration.normal,
  once = motionConfig.viewport.once,
}: FadeInProps) {
   const Component = motion[as || "div"];

  return (
    <Component
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once }}
      transition={{
        duration,
        delay,
        ease: motionConfig.ease,
      }}
    >
      {children}
    </Component>
  );
}
