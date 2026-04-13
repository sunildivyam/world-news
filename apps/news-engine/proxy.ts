import { NextRequest, NextResponse } from "next/server";
import { setCorsForAllowedOrigins } from "./lib/cros-origin/cross-origins";

export async function proxy(request: NextRequest) {
  // Clone the response
  let response = NextResponse.next();
  const origin = request.headers.get("origin");
  // set cors
  response = await setCorsForAllowedOrigins(origin || "", response);

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
