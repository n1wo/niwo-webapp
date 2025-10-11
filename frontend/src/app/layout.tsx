import type { Metadata } from "next";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/nav/Footer";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "niwo | Cybersecurity",
  description:
    "I’m Nikita, a cybersecurity student and freelance ethical hacker specializing in web application security, penetration testing, and digital defense. Helping businesses and individuals protect what matters online.",
};

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibmplexmono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"className={ibmPlexMono.className}>
      <body className={`flex min-h-screen flex-col bg-black text-white ${ibmPlexMono.variable} font-mono`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
