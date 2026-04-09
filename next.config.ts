import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.1.80:3000",
    "192.168.0.113:3000",
    "192.168.0.175:3000",
    "192.168.1.80:3001",
    "192.168.0.113:3001",
    "192.168.0.175:3001",
  ],
};

export default nextConfig;
