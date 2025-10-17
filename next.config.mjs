/** @type {import('next').NextConfig} */

import { API_BASE_URL } from './src/lib/api.js';

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
