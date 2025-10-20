import type { NextConfig } from "next";

const mediaHost = "d2k0ncl90mug6s.cloudfront.net"; // swap to media.niwosystems.com later

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: mediaHost }],
  },
  async headers() {
    const csp = `
      default-src 'self';
      base-uri 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:;
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
      { source: "/(.*)", headers: [{ key: "Content-Security-Policy", value: csp }] },
    ];
  },
};

export default nextConfig;
