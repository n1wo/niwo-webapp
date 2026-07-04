export const MEDIA_HOST = "d2k0ncl90mug6s.cloudfront.net";

// HTTPS-only directives (upgrade-insecure-requests, HSTS) break asset loading
// when a production build is served over plain HTTP, e.g. `next start` on
// localhost. They stay on by default in every production build and are only
// dropped via the explicit LOCAL_PREVIEW=1 opt-out or in `next dev` — never
// implicitly. Next config headers are resolved at build time and the
// middleware re-applies them per request, so the flag must be set for both
// `next build` and the server process.
function isLocalPreview(): boolean {
  return process.env.LOCAL_PREVIEW === "1";
}

type SecurityHeader = {
  key: string;
  value: string;
};

function getCspReportDirective(): string {
  // Next config headers are resolved at build time, so set this in the build environment.
  const reportUri = process.env.NIWO_CSP_REPORT_URI;

  if (!reportUri) {
    return "";
  }

  try {
    const url = new URL(reportUri);

    if (url.protocol !== "https:") {
      return "";
    }

    return `report-uri ${url.toString()};`;
  } catch {
    return "";
  }
}

export function buildCspHeader(isDevelopment: boolean): string {
  const reportDirective = getCspReportDirective();
  const upgradeDirective =
    isDevelopment || isLocalPreview() ? "" : "upgrade-insecure-requests;";
  const connectSrc = [
    "'self'",
    ...(isDevelopment ? ["http:", "https:", "ws:", "wss:"] : []),
  ].join(" ");

  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    ...(isDevelopment ? ["'unsafe-eval'", "blob:"] : []),
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
    font-src 'self';
    connect-src ${connectSrc};
    worker-src 'self' blob:;
    frame-src 'none';
    ${upgradeDirective}
    ${reportDirective}
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
    ...(isDevelopment || isLocalPreview()
      ? []
      : [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ]),
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
    {
      key: "Cross-Origin-Resource-Policy",
      value: "same-origin",
    },
  ];
}
