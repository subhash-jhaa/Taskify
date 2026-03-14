import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://taskify-2zoy.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
