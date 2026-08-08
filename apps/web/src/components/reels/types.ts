import type { Article, Category } from "@worldnews/shared/types";

export type ReelsAxis = "x" | "y";

export type Orientation = "portrait" | "landscape";

export type ReelNextPage = string | number | null | undefined;

export interface OverlayProps {
  visible: boolean;
}

export interface ReelsFeedState {
  articles: Article[];
  nextPage: ReelNextPage;
  loading: boolean;
  error: Error | null;
  loadNextPage(): Promise<void>;
  retry(): void;
}

export interface ReelsContextValue {
  currentIndex: number;
  setCurrentIndex(index: number): void;
  orientation: Orientation;
  axis: ReelsAxis;
}

export interface ReelsFooterLink {
  label: string;
  href?: string;
  id?: string;
}
