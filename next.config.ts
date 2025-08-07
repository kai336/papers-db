// next.config.js

import { webpack } from "next/dist/compiled/webpack/webpack";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      poll: 300,
      aggregateTimeout: 300,
    };
    return config;
  },
};

module.exports = nextConfig;
