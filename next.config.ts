import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    const normalizeApiUrl = (url?: string) =>
      url?.replace(/\/+$/, "")?.replace(/\/api$/, "") || "https://foodhub-server-seven.vercel.app";
    const apiUrl = normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL);
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;