import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['next/font'],
  },
 
  // Ensure proper handling of external resources
  images: {
    domains: ['fonts.gstatic.com'],
    localPatterns: [
      {
        pathname: '/api/placeholder/**',
        search: '**',
      },
    ],
  },
};

export default nextConfig;
