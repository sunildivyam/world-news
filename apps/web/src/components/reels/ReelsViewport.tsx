"use client";

import { AnimatePresence, motion } from "motion/react";

import type { ReelsFeedState } from "./types";
import ReelsTrack from "./ReelsTrack";

interface Props {
  feed: ReelsFeedState;
}

export default function ReelsViewport({ feed }: Props) {
  const hasArticles = feed.articles.length > 0;
  const showInitialLoading = feed.loading && !hasArticles;
  const showInitialError = Boolean(feed.error) && !hasArticles;

  return (
    <section className="relative h-full w-full overflow-hidden">
      <ReelsTrack feed={feed} />

      <AnimatePresence>
        {showInitialLoading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-background/80 absolute inset-0 z-30 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
              <span className="text-muted-foreground text-sm">Loading news...</span>
            </div>
          </motion.div>
        )}

        {showInitialError && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-background absolute inset-0 z-30 flex items-center justify-center px-6">
            <div className="flex max-w-sm flex-col items-center gap-4 text-center">
              <p className="text-muted-foreground text-sm">{feed.error?.message ?? "Unable to load news."}</p>

              <button type="button" onClick={feed.retry} className="border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-md border px-4 py-2 text-sm font-medium transition-colors">
                Try again
              </button>
            </div>
          </motion.div>
        )}

        {feed.loading && hasArticles && (
          <motion.div key="pagination-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2" aria-label="Loading more news">
            <div className="bg-background/80 rounded-full p-2 shadow-sm backdrop-blur-sm">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </div>
          </motion.div>
        )}

        {feed.error && hasArticles && !feed.loading && (
          <motion.div key="pagination-error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="bg-background/90 absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full px-4 py-2 shadow-sm backdrop-blur-sm">
            <span className="text-muted-foreground text-xs">Could not load more news.</span>

            <button type="button" onClick={feed.loadNextPage} className="text-xs font-medium underline underline-offset-2">
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
