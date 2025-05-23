import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/ipfs/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)', // apply to all routes
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL', // or remove this header entirely
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *", // allow any site to embed your app
          },
        ],
      },
    ]
  },

};

export default nextConfig;
