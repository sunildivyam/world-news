"use client";

import { motionConfig } from "./motion-config";
import { motion } from "motion/react";
import { ReactNode } from "react";
import { MotionTag } from "./types/motion";

export interface StaggerItemProps {
  className?: string;
  as?: MotionTag;
  children: ReactNode;
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: StaggerItemProps) {
  const Component = (motion[as] || motion.div) as typeof motion.div;

  return (
    <Component
      className={className}
      variants={{
        hidden: {
          opacity: 0,
          y: 24,
        },
        visible: {
          opacity: 1,
          y: 0,
        },
      }}
      transition={{
        duration: motionConfig.duration.normal,
        ease: "easeOut",
      }}
    >
      {children}
    </Component>
  );
}
