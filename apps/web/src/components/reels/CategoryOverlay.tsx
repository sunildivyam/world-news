"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SPRING } from "./constants";

interface Props {
  open: boolean;
  children: ReactNode;
  onClose(): void;
}

export default function CategoryOverlay({ open, children, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={SPRING} onPointerDown={onClose} className="bg-background/70 fixed inset-0 z-[90] cursor-default backdrop-blur-md" />

          <motion.div key="content" initial={{ opacity: 0, scale: 0.92, y: -40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: -20 }} transition={SPRING} className="pointer-events-none fixed inset-0 z-[91] flex items-center justify-center">
            <div onPointerDown={(event) => event.stopPropagation()} className="pointer-events-auto flex flex-col items-center justify-center gap-8 px-8">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
