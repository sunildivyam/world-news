"use client";

import { motionConfig } from "./motion-config";
import { motion } from "motion/react";
import { ReactNode } from "react";
import { MotionTag } from "./types/motion";

export interface FadeInProps {
  className?: string;
  as?: MotionTag;
  children: ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function FadeIn({
  className,
  as = "div",
  children,
  delay = motionConfig.delay,
  duration = motionConfig.duration.normal,
  once = motionConfig.viewport.once,
}: FadeInProps) {
  const Component = (motion[as] || motion.div) as typeof motion.div;
  // Safe type cast allowing string indexing into motion's HTML components
  // const Component = ((motion as unknown as Record<string, typeof motion.div>)[
  //   as
  // ] || motion.div) as typeof motion.div;

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
