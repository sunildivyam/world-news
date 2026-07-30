"use client";

import { motionConfig } from "./motion-config";
import { motion } from "motion/react";
import { ReactNode } from "react";

export interface StaggerContainerProps {
  className?: string;
  as?: string;
  children: ReactNode;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
}

export function StaggerContainer({
  className,
  as,
  children,
  stagger = motionConfig.stagger,
  delayChildren = motionConfig.delay,
  once = motionConfig.viewport.once,
}: StaggerContainerProps) {
  const Component = motion[as || "div"];

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
