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
          {/* Backdrop */}
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={SPRING} onPointerDown={onClose} className="bg-background/75 fixed inset-0 z-[90] cursor-default backdrop-blur-xl" />

          {/* Ambient glow */}
          <motion.div
            key="ambient"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              ...SPRING,
              delay: 0.04,
            }}
            className="pointer-events-none fixed inset-0 z-[90]"
          >
            <div className="bg-primary/10 absolute top-1/2 left-1/2 h-80 w-[min(80vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" />
          </motion.div>

          {/* Overlay content */}
          <motion.div
            key="content"
            initial={{
              opacity: 0,
              scale: 0.96,
              y: -24,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
              y: -12,
            }}
            transition={SPRING}
            className="pointer-events-none fixed inset-0 z-[91] flex items-center justify-center px-4 sm:px-6"
          >
            <div onPointerDown={(event) => event.stopPropagation()} className="pointer-events-auto flex w-full max-w-5xl flex-col items-center justify-center">
              {/* Main glass surface */}
              <div className="border-border/50 bg-card/45 relative flex w-full flex-col items-center overflow-hidden rounded-[2rem] border px-4 py-8 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:px-8 sm:py-10">
                <div className="via-border pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent" />

                <div className="bg-primary/10 pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full blur-3xl" />

                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
