export const MEDIA_HOST = "d2k0ncl90mug6s.cloudfront.net";

type SecurityHeader = {
  key: string;
  value: string;
};

export function buildCspHeader(isDevelopment: boolean): string {
  const connectSrc = [
    "'self'",
    ...(isDevelopment ? ["http:", "https:", "ws:", "wss:"] : []),
  ].join(" ");

  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    "blob:",
    ...(isDevelopment ? ["'unsafe-eval'"] : []),
  ].join(" ");

  return `
    default-src 'self';
    base-uri 'self';
    frame-ancestors 'none';
    form-action 'self';
    object-src 'none';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https://${MEDIA_HOST};
    media-src 'self' blob: https://${MEDIA_HOST};
    font-src 'self' data:;
    connect-src ${connectSrc};
    worker-src 'self' blob:;
    frame-src 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function getSecurityHeaders(isDevelopment: boolean): SecurityHeader[] {
  return [
    {
      key: "Content-Security-Policy",
      value: buildCspHeader(isDevelopment),
    },
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "X-Frame-Options",
      value: "DENY",
    },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
    },
    {
      key: "Cross-Origin-Opener-Policy",
      value: "same-origin",
    },
  ];
}
