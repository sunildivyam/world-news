"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { AppContext } from "@/components/AppContext.Provider";
import { fetchNews } from "@/lib/news-apis/fetchNews";
import type { Article } from "@worldnews/shared/types";

import type { ReelNextPage } from "../types";

interface Props {
  initialArticles: Article[];
  initialNextPage?: ReelNextPage;
  category?: string;
}

export default function useFeed({ initialArticles, initialNextPage, category }: Props) {
  const appContext = useContext(AppContext);
  const userCtx = appContext?.userCtx;

  const [articles, setArticles] = useState<Article[]>(initialArticles ?? []);
  const [nextPage, setNextPage] = useState<ReelNextPage>(initialNextPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);
  const nextPageRef = useRef<ReelNextPage>(initialNextPage);

  const abortCurrentRequest = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  const setContinuation = useCallback((value: ReelNextPage) => {
    nextPageRef.current = value;
    setNextPage(value);
  }, []);

  useEffect(() => {
    nextPageRef.current = nextPage;
  }, [nextPage]);

  /*
   * Initial feed and category changes.
   */
  useEffect(() => {
    abortCurrentRequest();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    if (!category) {
      setArticles(initialArticles ?? []);
      setContinuation(initialNextPage);

      loadingRef.current = false;
      setLoading(false);

      return () => {
        controller.abort();

        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      };
    }

    // Immediately remove cards from the previous category.
    setArticles([]);
    setContinuation(undefined);

    async function loadCategory() {
      try {
        const response = await fetchNews({
          category,
          signal: controller.signal,
          userCtx,
        });

        if (controller.signal.aborted) return;

        setArticles(response.articles ?? []);
        setContinuation(response.nextPage);
      } catch (cause) {
        if (controller.signal.aborted || (cause instanceof DOMException && cause.name === "AbortError")) {
          return;
        }

        setError(cause instanceof Error ? cause : new Error("Failed to load news"));
      } finally {
        if (!controller.signal.aborted) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    }

    void loadCategory();

    return () => {
      controller.abort();

      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }

      loadingRef.current = false;
    };
  }, [category, initialArticles, initialNextPage, userCtx, retryKey, abortCurrentRequest, setContinuation]);

  /*
   * Continuation-token pagination.
   */
  const loadNextPage = useCallback(async () => {
    const continuation = nextPageRef.current;

    if (continuation === undefined || continuation === null || continuation === "" || loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    const controller = new AbortController();

    abortControllerRef.current?.abort();
    abortControllerRef.current = controller;

    try {
      const response = await fetchNews({
        category,
        nextPage: continuation,
        signal: controller.signal,
        userCtx,
      });

      if (controller.signal.aborted) return;

      const newArticles = response.articles ?? [];

      if (newArticles.length > 0) {
        setArticles((current) => [...current, ...newArticles]);
      }

      setContinuation(response.nextPage);
    } catch (cause) {
      if (controller.signal.aborted || (cause instanceof DOMException && cause.name === "AbortError")) {
        return;
      }

      setError(cause instanceof Error ? cause : new Error("Failed to load more news"));
    } finally {
      if (!controller.signal.aborted) {
        loadingRef.current = false;
        setLoading(false);
      }
    }
  }, [category, userCtx, setContinuation]);

  const retry = useCallback(() => {
    abortCurrentRequest();
    setError(null);
    setRetryKey((value) => value + 1);
  }, [abortCurrentRequest]);

  useEffect(() => {
    return () => {
      abortCurrentRequest();
    };
  }, [abortCurrentRequest]);

  return {
    articles,
    nextPage,
    loading,
    error,
    loadNextPage,
    retry,
  };
}
