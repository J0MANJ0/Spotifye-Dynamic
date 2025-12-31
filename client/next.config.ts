import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn-images.dzcdn.net'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
