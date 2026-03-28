import type { Metadata } from "next";
import { connection } from "next/server";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/nav/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "niwo | Cybersecurity",
  description:
    "I’m Nikita, a cybersecurity student and freelance ethical hacker specializing in web application security, penetration testing, and digital defense. Helping businesses and individuals protect what matters online.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-black text-white font-mono">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
