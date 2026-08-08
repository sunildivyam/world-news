"use client";

import { useEffect } from "react";
import { motion, useAnimationControls } from "motion/react";

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

  const width = viewport.width;
  const height = viewport.height;

  const { currentIndex, setCurrentIndex, orientation, axis } = useReels();

  const { articles } = feed;

  const vertical = orientation === "portrait";

  const controls = useAnimationControls();

  const { indexes } = useVirtualSlides({
    currentIndex,
    total: articles.length,
  });

  /*
   * Keep currentIndex valid when the feed changes.
   */
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

  /*
   * Preload the next page before reaching
   * the end of the current batch.
   */
  useEffect(() => {
    const hasNextPage = feed.nextPage !== undefined && feed.nextPage !== null && feed.nextPage !== "";

    const shouldPreload = articles.length > 0 && hasNextPage && !feed.loading && currentIndex >= articles.length - PRELOAD_THRESHOLD;

    if (shouldPreload) {
      void feed.loadNextPage();
    }
  }, [articles.length, currentIndex, feed.loading, feed.nextPage, feed.loadNextPage]);

  /*
   * The logical position of the track.
   */
  const getTrackPosition = (index: number) => {
    if (vertical) {
      return {
        x: 0,
        y: -(index * height),
      };
    }

    return {
      x: -(index * width),
      y: 0,
    };
  };

  /*
   * Keep Motion's internal drag transform
   * synchronized with the logical slide.
   */
  useEffect(() => {
    if (!hydrated || width <= 0 || height <= 0) {
      return;
    }

    void controls.set(getTrackPosition(currentIndex));
  }, [currentIndex, width, height, vertical, hydrated, controls]);

  /*
   * After resize, immediately snap the track
   * to the current logical slide.
   */
  useEffect(() => {
    if (!viewport.isResizing) {
      return;
    }

    if (width <= 0 || height <= 0) {
      return;
    }

    void controls.set(getTrackPosition(currentIndex));
  }, [viewport.isResizing, width, height, currentIndex, vertical, controls]);

  const { onDragEnd } = useGesture({
    currentIndex,
    itemCount: articles.length,
    orientation: vertical ? "vertical" : "horizontal",
    onIndexChange: setCurrentIndex,
  });

  if (!hydrated || width <= 0 || height <= 0 || articles.length === 0) {
    return null;
  }

  /*
   * IMPORTANT:
   *
   * The track has the dimensions of the complete
   * feed. The viewport remains stationary.
   */
  const trackWidth = vertical ? width : width * articles.length;

  const trackHeight = vertical ? height * articles.length : height;

  const position = getTrackPosition(currentIndex);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        drag={viewport.isResizing ? false : axis}
        dragMomentum={false}
        dragElastic={DRAG_ELASTIC}
        dragConstraints={false}
        dragDirectionLock
        onDragEnd={onDragEnd}
        initial={false}
        animate={position}
        transition={viewport.isResizing ? { duration: 0 } : SPRING}
        style={{
          width: trackWidth,
          height: trackHeight,
          touchAction: viewport.isResizing ? "none" : vertical ? "pan-x" : "pan-y",
        }}
        className="absolute top-0 left-0 overflow-hidden will-change-transform select-none"
      >
        {indexes.map((index) => {
          const article = articles[index];

          if (!article) {
            return null;
          }

          return <ReelsSlide key={(article._id || article.slug || article.title) + index} article={article} index={index} width={width} height={height} />;
        })}
      </motion.div>
    </div>
  );
}
