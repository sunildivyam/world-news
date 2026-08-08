"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate, motion, useMotionValue } from "motion/react";

import ReelsSlide from "./ReelsSlide";
import { useReels } from "./context/ReelsContext";
import { PRELOAD_THRESHOLD, SPRING, SWIPE_THRESHOLD } from "./constants";
import useViewportSize from "./hooks/useViewportSize";
import useVirtualSlides from "./hooks/useVirtualSlides";
import type { ReelsFeedState } from "./types";

interface Props {
  feed: ReelsFeedState;
}

interface PointerSession {
  pointerId: number;
  startX: number;
  startY: number;
  startPosition: number;
  dragging: boolean;
}

export default function ReelsTrack({ feed }: Props) {
  const viewport = useViewportSize();

  const width = viewport.width;
  const height = viewport.height;

  const { currentIndex, setCurrentIndex, orientation } = useReels();

  const { articles } = feed;

  const vertical = orientation === "portrait";

  const x = useMotionValue(vertical ? 0 : -(currentIndex * width));

  const y = useMotionValue(vertical ? -(currentIndex * height) : 0);

  const pointerRef = useRef<PointerSession | null>(null);

  const suppressClickRef = useRef(false);

  const animationRef = useRef<{
    stop(): void;
  } | null>(null);

  const previousViewportRef = useRef({
    width: 0,
    height: 0,
    orientation,
  });

  const stopAnimation = useCallback(() => {
    animationRef.current?.stop();
    animationRef.current = null;
  }, []);

  const getPosition = useCallback(
    (index: number) => {
      return -(index * (vertical ? height : width));
    },
    [height, vertical, width],
  );

  const animateToIndex = useCallback(
    (index: number, immediate = false) => {
      const position = getPosition(index);

      stopAnimation();

      if (vertical) {
        if (immediate) {
          y.set(position);
        } else {
          animationRef.current = animate(y, position, SPRING);
        }

        x.set(0);
      } else {
        if (immediate) {
          x.set(position);
        } else {
          animationRef.current = animate(x, position, SPRING);
        }

        y.set(0);
      }
    },
    [getPosition, stopAnimation, vertical, x, y],
  );

  /*
   * Keep the track synchronized with the logical index.
   */
  useEffect(() => {
    if (width <= 0 || height <= 0 || articles.length === 0) {
      return;
    }

    animateToIndex(currentIndex);
  }, [currentIndex, width, height, orientation, articles.length, animateToIndex]);

  /*
   * Resize/orientation is a hard interaction boundary.
   * Cancel any pointer session and animation, then snap
   * directly to the current logical slide.
   */
  useEffect(() => {
    if (width <= 0 || height <= 0) {
      return;
    }

    const previous = previousViewportRef.current;

    const changed = previous.width !== width || previous.height !== height || previous.orientation !== orientation;

    if (changed) {
      pointerRef.current = null;
      stopAnimation();

      x.set(vertical ? 0 : -(currentIndex * width));

      y.set(vertical ? -(currentIndex * height) : 0);

      previousViewportRef.current = {
        width,
        height,
        orientation,
      };
    }
  }, [width, height, orientation, vertical, currentIndex, stopAnimation, x, y]);

  /*
   * During an active browser resize, never allow a stale
   * pointer/animation session to continue.
   */
  useEffect(() => {
    if (!viewport.isResizing) {
      return;
    }

    pointerRef.current = null;
    stopAnimation();

    if (width > 0 && height > 0) {
      x.set(vertical ? 0 : -(currentIndex * width));

      y.set(vertical ? -(currentIndex * height) : 0);
    }
  }, [viewport.isResizing, width, height, vertical, currentIndex, stopAnimation, x, y]);

  /*
   * Preload next page.
   */
  useEffect(() => {
    const hasNextPage = feed.nextPage !== undefined && feed.nextPage !== null && feed.nextPage !== "";

    if (articles.length === 0 || !hasNextPage || feed.loading || currentIndex < articles.length - PRELOAD_THRESHOLD) {
      return;
    }

    void feed.loadNextPage();
  }, [articles.length, currentIndex, feed.loading, feed.nextPage, feed.loadNextPage]);

  const { indexes } = useVirtualSlides({
    currentIndex,
    total: articles.length,
  });

  const clampPosition = useCallback(
    (position: number) => {
      const min = -Math.max(0, (articles.length - 1) * (vertical ? height : width));

      return Math.min(0, Math.max(min, position));
    },
    [articles.length, height, vertical, width],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (viewport.isResizing || event.button !== 0 || articles.length <= 1) {
        return;
      }

      stopAnimation();

      const currentPosition = vertical ? y.get() : x.get();

      pointerRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startPosition: currentPosition,
        dragging: false,
      };

      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [articles.length, stopAnimation, vertical, viewport.isResizing, x, y],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const session = pointerRef.current;

      if (!session || session.pointerId !== event.pointerId || viewport.isResizing) {
        return;
      }

      const rawDelta = vertical ? event.clientY - session.startY : event.clientX - session.startX;

      if (!session.dragging && Math.abs(rawDelta) < 6) {
        return;
      }

      session.dragging = true;

      event.preventDefault();

      const position = session.startPosition + rawDelta;

      const clamped = clampPosition(position);

      const min = -Math.max(0, (articles.length - 1) * (vertical ? height : width));

      let adjusted = clamped;

      if (position > 0) {
        adjusted = position * 0.28;
      } else if (position < min) {
        adjusted = min + (position - min) * 0.28;
      }

      if (vertical) {
        y.set(adjusted);
      } else {
        x.set(adjusted);
      }
    },
    [articles.length, clampPosition, height, vertical, viewport.isResizing, width, x, y],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const session = pointerRef.current;

      if (!session || session.pointerId !== event.pointerId) {
        return;
      }

      pointerRef.current = null;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      const delta = vertical ? event.clientY - session.startY : event.clientX - session.startX;

      if (!session.dragging) {
        return;
      }

      event.preventDefault();

      suppressClickRef.current = true;

      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);

      let nextIndex = currentIndex;

      if (delta < -SWIPE_THRESHOLD) {
        nextIndex = Math.min(currentIndex + 1, articles.length - 1);
      } else if (delta > SWIPE_THRESHOLD) {
        nextIndex = Math.max(currentIndex - 1, 0);
      }

      /*
       * When the swipe hits a boundary, currentIndex does not
       * change, so the index synchronization effect does not run.
       * Explicitly animate back to the current slide.
       */
      if (nextIndex === currentIndex) {
        animateToIndex(currentIndex);
        return;
      }

      setCurrentIndex(nextIndex);
    },
    [articles.length, currentIndex, animateToIndex, setCurrentIndex, vertical],
  );

  const handlePointerCancel = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const session = pointerRef.current;

      if (!session || session.pointerId !== event.pointerId) {
        return;
      }

      pointerRef.current = null;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      animateToIndex(currentIndex);
    },
    [animateToIndex, currentIndex],
  );

  const handleClickCapture = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }, []);

  if (width <= 0 || height <= 0 || articles.length === 0) {
    return null;
  }

  const trackWidth = vertical ? width : width * articles.length;

  const trackHeight = vertical ? height * articles.length : height;

  return (
    <div className="bg-background absolute inset-0 overflow-hidden">
      <motion.div
        style={{
          width: trackWidth,
          height: trackHeight,
          x,
          y,
          touchAction: vertical ? "pan-x" : "pan-y",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClickCapture={handleClickCapture}
        className="absolute top-0 left-0 select-none"
      >
        {indexes.map((index) => {
          const article = articles[index];

          if (!article) {
            return null;
          }

          return <ReelsSlide key={`${article._id || article.slug || article.title}-${index}`} article={article} index={index} width={width} height={height} />;
        })}
      </motion.div>
    </div>
  );
}
