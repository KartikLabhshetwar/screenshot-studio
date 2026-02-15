import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        // R2 public development URL (*.r2.dev)
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        // R2 custom domain
        protocol: "https",
        hostname: "assets.stagee.art",
      },
    ],
  },

  // REQUIRED for react-konva
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: "canvas" }];
    return config;
  },

  // Turbopack configuration (Next.js 16+ default bundler)
  turbopack: {},

};

export default nextConfig;
