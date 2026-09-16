import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  dynamicStartUrl: false,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default process.env.NODE_ENV === "development" ? nextConfig : withPWA(nextConfig);
