import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    "jsdom",
    "linkedom",
    "html-encoding-sniffer",
    "isomorphic-dompurify",
    "@mozilla/readability",
  ],
};

export default nextConfig;
