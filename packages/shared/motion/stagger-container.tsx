"use client";

import { motionConfig } from "./motion-config";
import { motion } from "motion/react";
import { ReactNode } from "react";
import { MotionTag } from "./types/motion";

export interface StaggerContainerProps {
  className?: string;
  as?: MotionTag;
  children: ReactNode;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
}

export function StaggerContainer({
  className,
  as = "div",
  children,
  stagger = motionConfig.stagger,
  delayChildren = motionConfig.delay,
  once = motionConfig.viewport.once,
}: StaggerContainerProps) {
  const Component = (motion[as] || motion.div) as typeof motion.div;

  return (
    <Component
      className={className}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      {children}
    </Component>
  );
}
