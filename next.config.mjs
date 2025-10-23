/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    const backendUrl = process.env.BASE_URL || "http://localhost:5000";
    return [
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
