/** @type {import('next').NextConfig} */

const nextConfig = {
  // 🚀 BỎ QUA mọi lỗi ESLint khi BUILD PRODUCTION
  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

    return [
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
