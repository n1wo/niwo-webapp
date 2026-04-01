import { NextResponse, type NextRequest } from "next/server";
import { buildCspHeader } from "./csp";
import { routing } from "./src/i18n/routing";

const LOCALE_HEADER = "X-NEXT-INTL-LOCALE";

function getDefaultLocaleRedirect(pathname: string): string {
  return pathname === "/" ? `/${routing.defaultLocale}` : `/${routing.defaultLocale}${pathname}`;
}

export function middleware(request: NextRequest): NextResponse {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDevelopment = process.env.NODE_ENV !== "production";
  const csp = buildCspHeader(nonce, isDevelopment);
  const { pathname, search } = request.nextUrl;
  const [firstSegment] = pathname.split("/").filter(Boolean);
  const hasSupportedLocale =
    typeof firstSegment === "string" && routing.locales.includes(firstSegment as "en" | "de");
  const looksLikeLocale =
    typeof firstSegment === "string" && /^[A-Za-z]{2}(?:-[A-Za-z]{2})?$/.test(firstSegment);
  const locale = hasSupportedLocale ? firstSegment : routing.defaultLocale;

  let response: NextResponse;

  if (!hasSupportedLocale && !looksLikeLocale) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = getDefaultLocaleRedirect(pathname);
    redirectUrl.search = search;
    response = NextResponse.redirect(redirectUrl);
  } else {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set(LOCALE_HEADER, locale);

    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  response.headers.set(LOCALE_HEADER, locale);
  response.headers.set("x-csp-debug", "1");
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
