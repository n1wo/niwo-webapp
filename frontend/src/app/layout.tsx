import { hasLocale } from "next-intl";
import { headers } from "next/headers";
import type { Metadata } from "next";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/i18n/metadata";
import "./globals.css";

const themeScript = `
(() => {
  const storageKey = "niwo-theme";
  const root = document.documentElement;
  const isTheme = (value) => value === "light" || value === "dark" || value === "system";

  let preference = "system";
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (isTheme(saved)) preference = saved;
  } catch {}

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const resolvedTheme = preference === "system" ? systemTheme : preference;

  root.dataset.theme = resolvedTheme;
  root.dataset.themePreference = preference;
  root.style.colorScheme = resolvedTheme;
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      {
        url: "/assets/logos/niwo-favicon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/assets/logos/niwo-favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const localeHeader = requestHeaders.get("X-NEXT-INTL-LOCALE");
  const locale =
    localeHeader && hasLocale(routing.locales, localeHeader)
      ? localeHeader
      : routing.defaultLocale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script
          id="niwo-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
