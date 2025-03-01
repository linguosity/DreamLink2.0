import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Handle webpack issues with proper output
  webpack: (config, { isServer }) => {
    // Optimize webpack config here if needed
    return config;
  },
  
  // Ensure proper types for Next.js
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  
  // Fix external packages for server components
  serverExternalPackages: [],
};

export default nextConfig;
