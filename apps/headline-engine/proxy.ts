import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  // Clone the response
  const response = NextResponse.next();
  
  return response;
}

export const config = {
  matcher: ["/api/:path*", "/news-batches/:path*"],
};
