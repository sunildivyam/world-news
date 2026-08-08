"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OVERLAY_VISIBLE_MS } from "../constants";

interface Props {
  trigger: unknown;
  hoverZonePx?: number;
}

export default function useOverlay({ trigger, hoverZonePx = 72 }: Props) {
  const [headerVisible, setHeaderVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(true);

  const headerTimerRef = useRef<number | null>(null);
  const footerTimerRef = useRef<number | null>(null);

  const headerHoverRef = useRef(false);
  const footerHoverRef = useRef(false);

  const headerLockedRef = useRef(false);

  const clearHeaderTimer = useCallback(() => {
    if (headerTimerRef.current !== null) {
      window.clearTimeout(headerTimerRef.current);
      headerTimerRef.current = null;
    }
  }, []);

  const clearFooterTimer = useCallback(() => {
    if (footerTimerRef.current !== null) {
      window.clearTimeout(footerTimerRef.current);
      footerTimerRef.current = null;
    }
  }, []);

  const showHeader = useCallback(() => {
    clearHeaderTimer();
    setHeaderVisible(true);
  }, [clearHeaderTimer]);

  const showFooter = useCallback(() => {
    clearFooterTimer();
    setFooterVisible(true);
  }, [clearFooterTimer]);

  const scheduleHeaderHide = useCallback(() => {
    clearHeaderTimer();

    if (headerHoverRef.current || headerLockedRef.current) {
      return;
    }

    headerTimerRef.current = window.setTimeout(() => {
      if (!headerHoverRef.current && !headerLockedRef.current) {
        setHeaderVisible(false);
      }

      headerTimerRef.current = null;
    }, OVERLAY_VISIBLE_MS);
  }, [clearHeaderTimer]);

  const scheduleFooterHide = useCallback(() => {
    clearFooterTimer();

    if (footerHoverRef.current) return;

    footerTimerRef.current = window.setTimeout(() => {
      if (!footerHoverRef.current) {
        setFooterVisible(false);
      }

      footerTimerRef.current = null;
    }, OVERLAY_VISIBLE_MS);
  }, [clearFooterTimer]);

  const setHeaderHover = useCallback(
    (hovered: boolean) => {
      headerHoverRef.current = hovered;

      if (hovered) {
        showHeader();
      } else {
        scheduleHeaderHide();
      }
    },
    [showHeader, scheduleHeaderHide],
  );

  const setFooterHover = useCallback(
    (hovered: boolean) => {
      footerHoverRef.current = hovered;

      if (hovered) {
        showFooter();
      } else {
        scheduleFooterHide();
      }
    },
    [showFooter, scheduleFooterHide],
  );

  const setHeaderLocked = useCallback(
    (locked: boolean) => {
      headerLockedRef.current = locked;

      if (locked) {
        showHeader();
      } else {
        scheduleHeaderHide();
      }
    },
    [showHeader, scheduleHeaderHide],
  );

  useEffect(() => {
    showHeader();
    showFooter();

    if (!headerLockedRef.current) {
      scheduleHeaderHide();
    }

    if (!footerHoverRef.current) {
      scheduleFooterHide();
    }

    return () => {
      clearHeaderTimer();
      clearFooterTimer();
    };
  }, [trigger, showHeader, showFooter, scheduleHeaderHide, scheduleFooterHide, clearHeaderTimer, clearFooterTimer]);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const y = event.clientY;
      const height = window.innerHeight;

      const inTopZone = y <= hoverZonePx;
      const inBottomZone = y >= height - hoverZonePx;

      if (inTopZone) {
        headerHoverRef.current = true;
        showHeader();
      } else if (headerHoverRef.current && !headerLockedRef.current) {
        headerHoverRef.current = false;
        scheduleHeaderHide();
      }

      if (inBottomZone) {
        footerHoverRef.current = true;
        showFooter();
      } else if (footerHoverRef.current) {
        footerHoverRef.current = false;
        scheduleFooterHide();
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [hoverZonePx, showHeader, showFooter, scheduleHeaderHide, scheduleFooterHide]);

  return {
    headerVisible,
    footerVisible,
    showHeader,
    scheduleHeaderHide,
    showFooter,
    scheduleFooterHide,
    setHeaderHover,
    setFooterHover,
    setHeaderLocked,
  };
}
