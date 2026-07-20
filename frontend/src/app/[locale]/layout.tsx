import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Footer from "@/components/nav/Footer";
import Navbar from "@/components/nav/Navbar";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/i18n/metadata";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [{ url: "/assets/logos/niwo-favicon.svg", type: "image/svg+xml" }],
    shortcut: "/assets/logos/niwo-favicon.svg",
  },
  openGraph: { type: "website", siteName: SITE_NAME },
  twitter: { card: "summary_large_image" },
  applicationName: SITE_NAME,
  manifest: "/manifest.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    email: "info@niwosystems.com",
    description: locale === "de"
      ? "Inhabergeführte Beratung für Software, IT und Cybersecurity in Bonn."
      : "Founder-led software, IT and cybersecurity consulting practice in Bonn, Germany.",
    founder: { "@type": "Person", name: "Nikita Wokurka" },
    logo: `${SITE_URL}/assets/logos/niwologo.svg`,
  };

  return <html lang={locale}><body className="flex min-h-screen flex-col bg-[var(--background)] text-zinc-100 font-sans antialiased">
    <NextIntlClientProvider messages={messages}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  </body></html>;
}
