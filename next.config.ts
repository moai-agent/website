import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: { position: "top-right" },
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
