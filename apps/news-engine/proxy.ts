import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  // Clone the response
  const response = NextResponse.next();

  // Get the allowed origin from environment variable
  const allowedOrigin = process.env.HEADLINE_ENGINE_BASE?.replace(/\/$/, ""); // Remove trailing slash if present

  // Set CORS headers
  if (allowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
