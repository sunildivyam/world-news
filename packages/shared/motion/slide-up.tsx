"use client";

import { motionConfig } from "./motion-config";
import { motion } from "motion/react";
import { ReactNode } from "react";
import { MotionTag } from "./types/motion";

export interface SlideUpProps {
  className?: string;
  as?: MotionTag;
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

export function SlideUp({
  className,
  as = "div",
  children,
  delay = motionConfig.delay,
  duration = motionConfig.duration.normal,
  distance = 32,
  once = motionConfig.viewport.once,
}: SlideUpProps) {
  const Component = (motion[as] || motion.div) as typeof motion.div;
  return (
    <Component
      className={className}
      initial={{
        opacity: 0,
        y: distance,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
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
