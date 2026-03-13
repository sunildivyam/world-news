import { NextRequest, NextResponse } from "next/server";
import { fetchArticles } from "@/lib/news-service";
import { headers } from "next/headers";
import { getUserContext } from "@/lib/UserContext.service";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const h = await headers();

    const userContext = await getUserContext();
    const nextPage = request.nextUrl.searchParams.get("nextPage") || undefined;
    const category = request.nextUrl.searchParams.get("category") || undefined;

    const data = await fetchArticles(userContext, {
      category: category ? [category] : undefined,
      nextPage,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch news", error: error },
      { status: 500 },
    );
  }
}
