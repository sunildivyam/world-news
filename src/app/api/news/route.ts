import { NextRequest, NextResponse } from "next/server";
import { fetchNews } from "@/lib/news-service";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const cursor = request.nextUrl.searchParams.get("cursor") || undefined;
    const category = request.nextUrl.searchParams.get("category") || undefined;

    const country = request.headers.get("x-user-country") || "US";
    const region = request.headers.get("x-user-region") || "";
    const city = request.headers.get("x-user-city") || "";
    const ip = request.headers.get("x-user-ip") || "";
    const language = request.headers.get("x-user-language") || "en";

    const data = await fetchNews({
      cursor,
      country,
      region,
      city,
      language,
      ip,
      category,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch news" },
      { status: 500 },
    );
  }
}
