import { NewsResponse } from "@/types/article";
import { ApiArticlesResponse } from "@/types/ApiResponse";
import { parseToNewsResponse } from "./apiToApp";

const BASE_URL = process.env.THIRD_PARTY_NEWS_URL!;
const API_KEY = process.env.THIRD_PARTY_NEWS_API_KEY!;

interface FetchNewsParams {
  cursor?: string;
  country: string;
  region: string;
  city: string;
  language: string;
  ip: string;
  limit?: number;
  category?: string;
}

export async function fetchNews({
  cursor,
  country,
  region,
  city,
  language,
  ip,
  limit = 10,
  category = "",
}: FetchNewsParams): Promise<NewsResponse> {
  const url = new URL(BASE_URL);

  url.searchParams.set("apikey", API_KEY);
  url.searchParams.set("country", country);
  // url.searchParams.set("region", region);
  // url.searchParams.set("city", city);
  url.searchParams.set("language", language);
  // url.searchParams.set("ip", ip);
  url.searchParams.set("size", limit.toString());
  url.searchParams.set("removeduplicate", "1");
  url.searchParams.set(
    "excludefield",
    "ai_summary,ai_org,ai_region,sentiment_stats,ai_tag,sentiment,content,video_url,source_priority,source_icon,source_url,source_name,source_id",
  );

  url.searchParams.set("sort", "pubdateasc");
  url.searchParams.set("image", "1");

  if (category) {
    url.searchParams.set("category", category);
  }

  if (cursor) {
    url.searchParams.set("page", cursor);
  }

  console.log(url.toString());

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 }, // Edge cache 60 seconds
  });

  if (!response.ok) {
    throw new Error(`News API error: ${response.status}`);
  }

  const data = (await response.json()) as ApiArticlesResponse;

  return parseToNewsResponse(data);
}
