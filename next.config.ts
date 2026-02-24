import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Redirect www to non-www (301 permanent redirect for SEO)
  async redirects() {
    return [
      {
        source: "/:path*",
        permanent: true,
        has: [
          {
            type: "host",
            value: "www.(?<domain>.*)",
          },
        ],
        destination: "https://:domain/:path*",
      },
    ];
  },
};

export default nextConfig;
