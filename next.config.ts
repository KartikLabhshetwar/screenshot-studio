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
        // R2 custom domain (new)
        protocol: "https",
        hostname: "assets.screenshot-studio.com",
      },
    ],
  },

  // Proxy R2 assets through same origin to avoid CORS issues
  // (especially critical for canvas capture during video export)
  async rewrites() {
    const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    if (!r2Url) return [];
    return [
      {
        source: "/r2-assets/:path*",
        destination: `${r2Url}/:path*`,
      },
    ];
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
