export const MEDIA_HOST = "d2k0ncl90mug6s.cloudfront.net";

/**
 * CSP violation reporting endpoint.
 * Replace with a real endpoint (e.g. Report URI, Sentry, or a custom collector)
 * before enabling in production. While set to empty string, report-to is omitted.
 */
const CSP_REPORT_ENDPOINT = "";

export function buildCspHeader(nonce: string, isDevelopment: boolean): string {
  const connectSrc = [
    "'self'",
    ...(isDevelopment ? ["http:", "https:", "ws:", "wss:"] : []),
  ].join(" ");

  // NOTE: blob: is required by Next.js for web worker script loading in
  // production builds. If this changes in a future Next.js version, remove it
  // and verify the production build still works.
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

  const reportDirective = CSP_REPORT_ENDPOINT
    ? `report-uri ${CSP_REPORT_ENDPOINT};`
    : "";

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
    ${reportDirective}
  `.replace(/\s{2,}/g, " ").trim();
}
