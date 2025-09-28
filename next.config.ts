import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['next/font'],
  },
 
  // Ensure proper handling of external resources
  images: {
    unoptimized: true, // Disable image optimization for development
    domains: ['fonts.gstatic.com', 'localhost', 'lh3.googleusercontent.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
    ],
    localPatterns: [
      {
        pathname: '/api/placeholder/**',
        search: '**',
      },
    ],
  },
};

export default nextConfig;
