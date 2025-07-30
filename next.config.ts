import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['s3-imfile.feishucdn.com', 's1-imfile.feishucdn.com'],
  },
};

export default nextConfig;

