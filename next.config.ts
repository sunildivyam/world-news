import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Replace with your hostname
        port: "",
        pathname: "/**", // Adjust pathname as needed
      },
      {
        protocol: "http",
        hostname: "**", // Replace with your hostname
        port: "",
        pathname: "/**", // Adjust pathname as needed
      },
    ],
  },
};

export const runtime = "edge";
export default nextConfig;
