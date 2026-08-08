"use client";

import { AnimatePresence, motion } from "motion/react";

import type { OverlayProps, ReelsFooterLink } from "./types";

interface Props extends OverlayProps {
  links?: ReelsFooterLink[];
  onLinksClick?(link: ReelsFooterLink): void;
  onMouseEnter?(): void;
  onMouseLeave?(): void;
}

const DEFAULT_LINKS: ReelsFooterLink[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "terms", label: "Terms", href: "/terms" },
  { id: "privacy", label: "Privacy", href: "/privacy" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export default function FooterOverlay({ visible, links = DEFAULT_LINKS, onLinksClick, onMouseEnter, onMouseLeave }: Props) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, link: ReelsFooterLink) => {
    if (!onLinksClick) return;

    event.preventDefault();
    onLinksClick(link);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.footer onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.25 }} className="fixed right-0 bottom-0 left-0 z-50 bg-gradient-to-t from-black/70 to-transparent p-4">
          <nav aria-label="Footer navigation" className="flex justify-center gap-6">
            {links.map((link) => (
              <a key={link.id ?? link.label} href={link.href ?? "#"} onClick={(event) => handleClick(event, link)} className="focus-visible:ring-ring text-sm text-white/90 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none">
                {link.label}
              </a>
            ))}
          </nav>
        </motion.footer>
      )}
    </AnimatePresence>
  );
}
