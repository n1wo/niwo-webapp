"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import LinkAnimation from "./LinkAnimation";
import LanguageSwitcher from "./LanguageSwitcher";
import TopicsDropdown from "./TopicsDropdown";
import HomeLogoLink from "./HomeLogoLink";
import { serviceDefinitions } from "@/data/services";
import styles from "./NavChrome.module.css";

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

  const framePaddingClass = isPinned ? "px-0 sm:px-0" : "px-4 sm:px-6";
  const panelStateClass = isPinned ? styles.navPanelPinned : styles.navPanelFloating;
  const mobileMenuPaddingClass = isPinned ? "px-0" : "px-4";
  const mobileMenuStateClass = isPinned ? styles.mobileMenuPinned : styles.mobileMenuFloating;

  return (
    <header>
      <nav>
        <div
          className={`fixed inset-x-0 z-50 ${styles.navFrame} ${isPinned ? styles.navFramePinned : styles.navFrameFloating} ${framePaddingClass}`}
        >
          <div
            className={`grid h-18 w-full grid-cols-2 justify-items-stretch px-8 font-mono md:grid-cols-3 sm:px-10 ${styles.navPanel} ${panelStateClass}`}
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
            <HomeLogoLink
              className="md:flex my-auto md:mx-auto h-fit w-fit"
              imageClassName="h-8 w-auto dark:invert"
              width={220}
              height={70}
              onNavigate={() => setIsOpen(false)}
            />

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
            className={`fixed inset-x-0 z-40 md:hidden ${styles.mobileMenuFrame} ${mobileMenuStateClass} ${mobileMenuPaddingClass}`}
          >
            <div className={`w-full px-6 pb-6 pt-4 ${styles.mobileMenuPanel}`}>
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
