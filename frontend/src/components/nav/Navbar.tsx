"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import LinkAnimation from "./LinkAnimation";
import LanguageSwitcher from "./LanguageSwitcher";
import TopicsDropdown from "./TopicsDropdown";
import HomeLogoLink from "./HomeLogoLink";
import { topicArticleDefinitions } from "@/data/topicArticles";
import styles from "./NavChrome.module.css";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const topicsT = useTranslations("TopicArticles");
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);

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

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      setIsOpen(false);
      mobileMenuButtonRef.current?.focus();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const topicLinks = topicArticleDefinitions.map((topic) => ({
    key: topic.key,
    href: `/topics/${topic.slug}`,
    title: topicsT(`items.${topic.key}.title`),
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
                  <LinkAnimation href="/pages/contact">{t("contact")}</LinkAnimation>
                </li>
                <li>
                  <LinkAnimation href="/pages/about">{t("about")}</LinkAnimation>
                </li>
                <li>
                  <LinkAnimation href="/services">{t("servicesPage")}</LinkAnimation>
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
                ref={mobileMenuButtonRef}
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="relative flex h-11 w-11 flex-col items-center justify-center rounded-sm md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(140_127_224/0.74)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
                aria-controls="mobile-navigation-menu"
                aria-expanded={isOpen}
                aria-label={isOpen ? t("closeMenu") : t("openMenu")}
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
        <div
          id="mobile-navigation-menu"
          data-mobile-navigation
          hidden={!isOpen}
          className={`fixed inset-x-0 z-40 md:hidden ${styles.mobileMenuFrame} ${mobileMenuStateClass} ${mobileMenuPaddingClass}`}
        >
          <div className={`w-full px-6 pb-6 pt-4 ${styles.mobileMenuPanel}`}>
            <ul aria-label={t("mobileNavigation")} className="flex flex-col gap-4 font-sans">
              <li>
                <LanguageSwitcher onNavigate={() => setIsOpen(false)} />
              </li>
              <li>
                <LinkAnimation
                  href="/pages/contact"
                  onClick={() => setIsOpen(false)}
                >
                  {t("contact")}
                </LinkAnimation>
              </li>
              <li>
                <LinkAnimation href="/pages/about" onClick={() => setIsOpen(false)}>
                  {t("about")}
                </LinkAnimation>
              </li>
              <li>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {t("services")}
                </p>
              </li>
              <li className="border-l border-white/[0.1] pl-4">
                <LinkAnimation href="/services" onClick={() => setIsOpen(false)}>
                  {t("servicesPage")}
                </LinkAnimation>
              </li>
              {topicLinks.map((topic) => (
                <li
                  key={topic.href}
                  data-topic-nav={topic.key}
                  className="border-l border-white/[0.1] pl-4"
                >
                  <LinkAnimation href={topic.href} onClick={() => setIsOpen(false)}>
                    {topic.title}
                  </LinkAnimation>
                </li>
              ))}
              <li
                data-all-topics-link="mobile"
                className="border-t border-white/[0.08] pt-4"
              >
                <LinkAnimation href="/topics" onClick={() => setIsOpen(false)}>
                  {t("allTopics")}
                </LinkAnimation>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
