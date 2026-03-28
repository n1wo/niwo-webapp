import type { NextConfig } from "next";

const mediaHost = "d2k0ncl90mug6s.cloudfront.net"; // swap to media.niwosystems.com later
const isDevelopment = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: mediaHost }],
  },
  async headers() {
    const scriptSrc = [
      "'self'",
      "'unsafe-inline'",
      "blob:",
      ...(isDevelopment ? ["'unsafe-eval'"] : []),
    ].join(" ");

    const csp = `
      default-src 'self';
      base-uri 'self';
      frame-ancestors 'none';
      script-src ${scriptSrc};
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https://${mediaHost};
      media-src https://${mediaHost};
      font-src 'self' data:;
      connect-src 'self';
      worker-src 'self' blob:;
      frame-src 'none';
      object-src 'none';
      form-action 'self';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, " ").trim();

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
