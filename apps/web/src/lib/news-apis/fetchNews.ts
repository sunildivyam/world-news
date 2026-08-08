import type { ArticleCollection } from "@worldnews/shared/types";
import { setUserContextToRequestHeaders } from "../contexts/user/UserContextClient.Resolver";

import type { ReelNextPage } from "@/components/reels/types";

type UserContext = Parameters<typeof setUserContextToRequestHeaders>[1];

interface Props {
  category?: string;
  nextPage?: ReelNextPage;
  signal?: AbortSignal;
  userCtx?: UserContext;
}

export async function fetchNews({ category, nextPage, signal, userCtx }: Props): Promise<ArticleCollection> {
  if (typeof window === "undefined") {
    throw new Error("fetchNews must be called on the client");
  }

  const url = new URL("/api/news", window.location.origin);

  if (category) {
    url.searchParams.set("category", category);
  }

  if (nextPage !== undefined && nextPage !== null && nextPage !== "") {
    url.searchParams.set("nextPage", String(nextPage));
  }

  const req = new Request(url, {
    method: "GET",
    signal,
  });

  setUserContextToRequestHeaders(req, userCtx);

  const res = await fetch(req);

  let data: ArticleCollection;

  try {
    data = await res.json();
  } catch {
    throw new Error(`News request failed (${res.status})`);
  }

  if (!res.ok) {
    const message = typeof data === "object" && data !== null && "message" in data && typeof data.message === "string" ? data.message : `News request failed (${res.status})`;

    throw new Error(message);
  }

  return data;
}
