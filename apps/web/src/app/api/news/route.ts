import { NextRequest, NextResponse } from "next/server";
import { fetchArticles } from "@/lib/news-service";
import { getUserContext } from "@/lib/contexts/user/UserContext.service";
import { AppError } from "@worldnews/shared";

export async function GET(request: NextRequest) {
  try {
    const userContext = await getUserContext();
    const nextPage = request.nextUrl.searchParams.get("nextPage") || undefined;
    const category = request.nextUrl.searchParams.get("category") || undefined;

    const data = await fetchArticles(userContext, {
      category: category ? [category] : undefined,
      nextPage,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch news", error: error },
      { status: 500 },
    );
  }
}
