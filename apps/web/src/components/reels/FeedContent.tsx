"use client";

import type { Article, Category } from "@worldnews/shared/types";

import HeaderOverlay from "./HeaderOverlay";
import FooterOverlay from "./FooterOverlay";
import ReelsViewport from "./ReelsViewport";
import useOverlay from "./hooks/useOverlay";
import useFeed from "./hooks/useFeed";
import { useReels } from "./context/ReelsContext";
import type { ReelNextPage, ReelsFooterLink } from "./types";

interface Props {
  logo: React.ReactNode;
  categories: Category[];
  initialArticles: Article[];
  nextPage?: ReelNextPage;
  category?: Category;
  onCategorySelect?(category: Category): void;
  footerLinks?: ReelsFooterLink[];
  onLinksClick?(link: ReelsFooterLink): void;
}

const DEFAULT_FOOTER_LINKS: ReelsFooterLink[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "terms", label: "Terms", href: "/terms" },
  { id: "privacy", label: "Privacy", href: "/privacy" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export default function FeedContent({ logo, categories, initialArticles, nextPage, category, onCategorySelect, footerLinks = DEFAULT_FOOTER_LINKS, onLinksClick }: Props) {
  const { currentIndex } = useReels();

  const overlay = useOverlay({
    trigger: `${category?.name ?? "initial"}:${currentIndex}`,
  });

  const feed = useFeed({
    initialArticles,
    initialNextPage: nextPage,
    category: category?.name,
  });

  return (
    <main className="fixed inset-0 overflow-hidden">
      <HeaderOverlay visible={overlay.headerVisible} logo={logo} categories={categories} activeCategory={category?.name} onCategorySelect={onCategorySelect} onMouseEnter={() => overlay.setHeaderHover(true)} onMouseLeave={() => overlay.setHeaderHover(false)} />

      <ReelsViewport feed={feed} />

      <FooterOverlay visible={overlay.footerVisible} links={footerLinks} onLinksClick={onLinksClick} onMouseEnter={() => overlay.setFooterHover(true)} onMouseLeave={() => overlay.setFooterHover(false)} />
    </main>
  );
}
