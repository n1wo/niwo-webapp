import { hasLocale } from "next-intl";
import { headers } from "next/headers";
import { routing } from "@/i18n/routing";
import "./globals.css";

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
      <body className="flex min-h-screen flex-col bg-black text-white font-mono">
        {children}
      </body>
    </html>
  );
}
