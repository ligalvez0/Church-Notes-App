import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "http://192.168.1.80:3000",
    "http://192.168.0.113:3000",
    "http://192.168.0.175:3000",
    "http://192.168.1.80:3001",
    "http://192.168.0.113:3001",
    "http://192.168.0.175:3001",
  ],
};

export default nextConfig;
