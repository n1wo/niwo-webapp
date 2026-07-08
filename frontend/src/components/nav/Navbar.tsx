"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import LinkAnimation from "./LinkAnimation";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import TopicsDropdown from "./TopicsDropdown";
import { serviceDefinitions } from "@/data/services";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const topicsT = useTranslations("Topics");
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsPinned(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const topicLinks = serviceDefinitions.map((service) => ({
    href: `/topics/${service.slug}`,
    title: topicsT(`items.${service.key}.card.title`),
  }));

  return (
    <header>
      <nav>
        <div
          className={`fixed inset-x-0 z-50 transition-[top,padding] duration-300 ease-out motion-reduce:transition-none ${
            isPinned ? "top-0 px-0 sm:px-0" : "top-4 px-4 sm:px-6"
          }`}
        >
          <div
            className={`grid h-18 w-full grid-cols-2 justify-items-stretch border border-white/[0.08] bg-black/60 px-8 font-mono backdrop-blur-md transition-[border-radius,background-color,box-shadow,transform] duration-300 ease-out motion-reduce:transition-none md:grid-cols-3 sm:px-10 ${
              isPinned
                ? "rounded-none bg-black/60 shadow-[0_20px_48px_rgba(0,0,0,0.48)]"
                : "rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
            }`}
          >
            <div className="hidden md:flex items-center">
              <ul className="flex my-auto w-fit h-fit gap-6">
                <li>
                  <LinkAnimation href="mailto:info@niwosystems.com">{t("contact")}</LinkAnimation>
                </li>
                <li>
                  <LinkAnimation href="/pages/about">{t("about")}</LinkAnimation>
                </li>
                <li>
                  <TopicsDropdown />
                </li>
              </ul>
            </div>

            {/* Logo */}
            <Link className="md:flex my-auto md:mx-auto h-fit w-fit" href="/">
              <Image
                src="/assets/logos/niwologo.svg"
                width={220}
                height={70}
                className="h-8 w-auto dark:invert"
                alt="niwo systems"
              />
            </Link>

            {/* Right side */}
            <div className="flex items-center justify-self-end w-fit">
              <div className="hidden md:flex items-center gap-4">
                <LanguageSwitcher />
              </div>
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative md:hidden flex flex-col justify-center items-center"
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
          <div
            className={`fixed inset-x-0 z-40 transition-[top,padding] duration-300 ease-out motion-reduce:transition-none md:hidden ${
              isPinned ? "top-[4.5rem] px-0" : "top-[5.75rem] px-4"
            }`}
          >
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
                  <LinkAnimation href="/#topics">{t("services")}</LinkAnimation>
                </li>
                {topicLinks.map((topic) => (
                  <li
                    key={topic.href}
                    onClick={() => setIsOpen(false)}
                    className="border-l border-white/[0.1] pl-4"
                  >
                    <LinkAnimation href={topic.href}>{topic.title}</LinkAnimation>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
