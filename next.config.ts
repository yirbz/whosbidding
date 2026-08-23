import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(process.env.STANDALONE === "true" ? { output: "standalone" } : {}),
};

export default nextConfig;
