// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      poll: 300,
      aggregateTimeout: 300,
    };
    return config;
  },
  // Cloudflare Pages compatibility
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
