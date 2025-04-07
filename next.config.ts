import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pink-junior-peacock-757.mypinata.cloud',
        pathname: '/ipfs/**',
      },
    ],
  },
};

export default nextConfig;
