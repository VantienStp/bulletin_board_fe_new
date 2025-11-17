/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    // const backendUrl = "https://bulletin-board-be-new.onrender.com" || "http://localhost:5000";
    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
    return [
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
