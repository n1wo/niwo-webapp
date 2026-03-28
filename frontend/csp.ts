export const MEDIA_HOST = "d2k0ncl90mug6s.cloudfront.net";

export function buildCspHeader(nonce: string, isDevelopment: boolean): string {
  const connectSrc = [
    "'self'",
    ...(isDevelopment ? ["http:", "https:", "ws:", "wss:"] : []),
  ].join(" ");

  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    "blob:",
    ...(isDevelopment ? ["'unsafe-eval'"] : []),
  ].join(" ");

  const styleSrc = [
    "'self'",
    ...(isDevelopment ? ["'unsafe-inline'"] : [`'nonce-${nonce}'`]),
  ].join(" ");

  return `
    default-src 'self';
    base-uri 'self';
    frame-ancestors 'none';
    script-src ${scriptSrc};
    style-src ${styleSrc};
    img-src 'self' data: https://${MEDIA_HOST};
    media-src 'self' https://${MEDIA_HOST};
    font-src 'self' data:;
    connect-src ${connectSrc};
    worker-src 'self' blob:;
    frame-src 'none';
    object-src 'none';
    form-action 'self';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();
}
