"use client";

import { useEffect } from "react";
import { motion } from "motion/react";

import ReelsSlide from "./ReelsSlide";
import { useReels } from "./context/ReelsContext";
import { DRAG_ELASTIC, PRELOAD_THRESHOLD, SPRING } from "./constants";
import useGesture from "./hooks/useGesture";
import useViewportSize from "./hooks/useViewportSize";
import useVirtualSlides from "./hooks/useVirtualSlides";
import useHydrated from "./hooks/useHydrated";
import type { ReelsFeedState } from "./types";

interface Props {
  feed: ReelsFeedState;
}

export default function ReelsTrack({ feed }: Props) {
  const hydrated = useHydrated();
  const viewport = useViewportSize();

  const width = hydrated ? viewport.width : 0;
  const height = hydrated ? viewport.height : 0;

  const { currentIndex, setCurrentIndex, orientation, axis } = useReels();

  const { articles } = feed;

  useEffect(() => {
    if (articles.length === 0) {
      if (currentIndex !== 0) {
        setCurrentIndex(0);
      }
      return;
    }

    if (currentIndex >= articles.length) {
      setCurrentIndex(articles.length - 1);
    }
  }, [articles.length, currentIndex, setCurrentIndex]);

  useEffect(() => {
    const shouldPreload = articles.length > 0 && feed.nextPage !== undefined && feed.nextPage !== null && feed.nextPage !== "" && !feed.loading && currentIndex >= articles.length - PRELOAD_THRESHOLD;

    if (shouldPreload) {
      void feed.loadNextPage();
    }
  }, [articles.length, currentIndex, feed.loading, feed.nextPage, feed.loadNextPage]);

  const vertical = orientation === "portrait";

  const { indexes } = useVirtualSlides({
    currentIndex,
    total: articles.length,
  });

  const { onDragEnd } = useGesture({
    currentIndex,
    itemCount: articles.length,
    orientation: vertical ? "vertical" : "horizontal",
    onIndexChange: setCurrentIndex,
  });

  if (!hydrated || articles.length === 0) {
    return null;
  }

  const translate = vertical ? { y: -(currentIndex * height) } : { x: -(currentIndex * width) };

  return (
    <motion.div
      drag={axis}
      dragMomentum={false}
      dragElastic={DRAG_ELASTIC}
      dragConstraints={{
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
      onDragEnd={onDragEnd}
      animate={translate}
      transition={SPRING}
      style={{
        width: vertical ? width : width * articles.length,
        height: vertical ? height * articles.length : height,
        touchAction: vertical ? "pan-x" : "pan-y",
      }}
      className={["relative flex overflow-hidden", "will-change-transform select-none", vertical ? "flex-col" : "flex-row"].join(" ")}
    >
      {indexes.map((index) => {
        const article = articles[index];

        if (!article) return null;

        return <ReelsSlide key={(article._id || article.slug || article.title) + index} article={article} index={index} width={width} height={height} />;
      })}
    </motion.div>
  );
}
