import "../globals.css";
import type { Metadata } from "next";
import { SITE_URL } from "@/i18n/metadata";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };

export default function RedirectRootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="bg-[var(--background)] text-zinc-100">{children}</body></html>;
}
