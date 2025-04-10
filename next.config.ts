import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',  // Apply to all paths
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // or 'DENY' to block all iframe embedding
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self';",  // Only allow embedding from your domain
          },
        ],
      },
    ]
  },
};

export default withNextIntl(nextConfig);
