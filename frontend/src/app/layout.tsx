import { hasLocale } from "next-intl";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/i18n/metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
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
    <html lang={locale}>
      <body className="flex min-h-screen flex-col bg-[#0a0a0a] text-zinc-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
