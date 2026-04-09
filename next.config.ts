import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.1.80",
    "192.168.0.113",
    "192.168.0.175",
  ],
};

export default nextConfig;
