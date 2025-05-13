import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
        protocol: "https",
      },
      {
        protocol: 'https',
        hostname: 'walrus-aggregator-testnet.haedal.xyz',
        pathname: '/v1/blobs/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
      // Added new patterns for your NFT images
      {
        protocol: 'https',
        hostname: 'www.walrus.xyz',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'walrus.xyz',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      }
    ],
  },
  // Optional: Add webpack configuration if needed
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

export default nextConfig;