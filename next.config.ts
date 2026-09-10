import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ac.goit.global',
      },
    ],
  },
  allowedDevOrigins: process.env.NEXT_DEV_ORIGIN
    ? [process.env.NEXT_DEV_ORIGIN]
    : [],
};

export default nextConfig;
