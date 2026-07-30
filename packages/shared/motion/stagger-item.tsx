"use client";

import { motionConfig } from "./motion-config";
import { motion } from "motion/react";
import { ReactNode } from "react";

export interface StaggerItemProps {
  className?: string;
  as?: string;
  children: ReactNode;
}

export function StaggerItem({ children, className, as }: StaggerItemProps) {
  const Component = motion[as || "div"];

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
