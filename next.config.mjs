/** @type {import('next').NextConfig} */

import { API_BASE_URL } from '@/lib/api';

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${API_BASE_URL}/uploads/:path*`, // backend
      },
    ];
  },
};

export default nextConfig;
