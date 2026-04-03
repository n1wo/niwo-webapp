"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import LinkAnimation from "./LinkAnimation";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname.includes("/lab/trust-boundry-prototype")) {
    return null;
  }

  return (
    <header>
      <nav>
        <div className="fixed inset-x-0 top-4 z-50 px-4 sm:px-6">
          <div className="grid h-18 w-full grid-cols-2 justify-items-stretch rounded-2xl border border-white/[0.08] bg-black/25 px-8 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-sm sm:grid-cols-3 sm:px-10 font-mono">
            <div className="hidden sm:flex items-center">
              <ul className="flex my-auto w-fit h-fit gap-6">
                <li>
                  <LinkAnimation href="mailto:info@niwosystems.com">{t("contact")}</LinkAnimation>
                </li>
                <li>
                  <LinkAnimation href="/pages/about">{t("about")}</LinkAnimation>
                </li>
                <li>
                  <LinkAnimation href="/#what-i-do">{t("services")}</LinkAnimation>
                </li>
              </ul>
            </div>

            {/* Logo */}
            <Link className="sm:flex my-auto sm:mx-auto h-fit w-fit" href="/">
              <Image
                src="/assets/logos/niwologo.svg"
                width={220}
                height={70}
                className="h-8 w-auto dark:invert"
                alt="Niwo Systems"
              />
            </Link>

            {/* Right side */}
            <div className="flex items-center justify-self-end w-fit">
              <div className="hidden sm:flex items-center gap-4">
                <LanguageSwitcher />
              </div>
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative sm:hidden flex flex-col justify-center items-center"
                aria-expanded={isOpen}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                <span
                  className={`bg-white block transition-all duration-300 ease-out
                  h-0.5 w-6 rounded-sm ${isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`}
                ></span>
                <span
                  className={`bg-white block transition-all duration-300 ease-out
                  h-0.5 w-6 rounded-sm my-0.5 ${isOpen ? "opacity-0" : "opacity-100"}`}
                ></span>
                <span
                  className={`bg-white block transition-all duration-300 ease-out
                  h-0.5 w-6 rounded-sm ${isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}`}
                ></span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="fixed inset-x-0 top-[5.75rem] z-40 px-4 sm:hidden">
            <div className="w-full rounded-2xl border border-white/[0.08] bg-black/30 px-6 pb-6 pt-4 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-md">
              <ul className="flex flex-col gap-4 font-sans">
                <li>
                  <LanguageSwitcher />
                </li>
                <li onClick={() => setIsOpen(false)}>
                  <LinkAnimation href="mailto:info@niwosystems.com">{t("contact")}</LinkAnimation>
                </li>
                <li onClick={() => setIsOpen(false)}>
                  <LinkAnimation href="/pages/about">{t("about")}</LinkAnimation>
                </li>
                <li onClick={() => setIsOpen(false)}>
                  <LinkAnimation href="/#what-i-do">{t("services")}</LinkAnimation>
                </li>
              </ul>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
