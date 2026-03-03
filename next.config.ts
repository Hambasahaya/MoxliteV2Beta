import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Disable static imports for better control
    dangerouslyAllowSVG: true,
  },

  // Optimize HTTP/2 server push
  compress: true,
  
  // Reduce initial JS payload
  swcMinify: true,
  
  // Optimize package imports
  experimental: {
    optimizePackageImports: ["@reduxjs/toolkit", "framer-motion", "three"],
    // Enable React optimizations
    React: { useSuspense: true },
  },

  // Webpack optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimize client-side bundles
      config.optimization = {
        ...config.optimization,
        // Split chunks more aggressively
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            // Core Next.js framework
            framework: {
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              name: "framework",
              priority: 40,
              reuseExistingChunk: true,
            },
            // Heavy libraries separate
            heavy: {
              test: /[\\/]node_modules[\\/](three|framer-motion|jspdf)[\\/]/,
              name: "heavy",
              priority: 30,
              reuseExistingChunk: true,
              minSize: 50000,
            },
            // Redux and state management
            vendor: {
              test: /[\\/]node_modules[\\/](@reduxjs|redux)[\\/]/,
              name: "vendor",
              priority: 20,
              reuseExistingChunk: true,
            },
            // Common code shared by multiple chunks
            common: {
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
              name: "common",
            },
          },
        },
      };
    }
    return config;
  },

  // Set cache headers for static assets
  async headers() {
    return [
      // Cache images for 1 year (31536000 seconds)
      {
        source: "/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 31536000000).toUTCString(),
          },
        ],
      },
      // Cache SVG icons for 1 year
      {
        source: "/icon/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 31536000000).toUTCString(),
          },
        ],
      },
      // Cache model files for 1 year
      {
        source: "/model/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 31536000000).toUTCString(),
          },
        ],
      },
      // Cache video files for 30 days
      {
        source: "/video/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000",
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 2592000000).toUTCString(),
          },
        ],
      },
      // Cache optimized images from Next.js Image component
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 31536000000).toUTCString(),
          },
        ],
      },
      // Cache static files (.js, .css, .woff, etc)
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800",
          },
        ],
      },
    ];
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
