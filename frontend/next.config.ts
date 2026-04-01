import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { getSecurityHeaders, MEDIA_HOST } from "./csp";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  outputFileTracingIncludes: {
    "/*": ["./node_modules/@swc/helpers/esm/**/*.js"],
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: MEDIA_HOST }],
  },
  async headers() {
    const isDevelopment = process.env.NODE_ENV !== "production";

    return [
      {
        source: "/(.*)",
        headers: getSecurityHeaders(isDevelopment),
      },
    ];
  },
};

export default withNextIntl(nextConfig);
