"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { serviceDefinitions } from "@/data/services";

const CLOSE_DELAY_MS = 140;

/**
 * Desktop navbar item for "Topics" with a hover/click dropdown listing the
 * topic pages, styled to match the site's terminal look.
 */
export default function TopicsDropdown() {
  const t = useTranslations("Navbar");
  const topicsT = useTranslations("Topics");
  const [isOpen, setIsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const items = serviceDefinitions.map((service) => ({
    href: `/topics/${service.slug}`,
    title: topicsT(`items.${service.key}.card.title`),
    tag: topicsT(`items.${service.key}.card.tag`),
  }));

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setIsOpen(false), CLOSE_DELAY_MS);
  };

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  useEffect(() => cancelClose, []);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setIsOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-fit w-fit cursor-pointer items-center gap-1.5 font-mono"
      >
        <p>{t("services")}</p>
        <svg
          aria-hidden="true"
          viewBox="0 0 10 6"
          className={`h-1.5 w-2.5 text-[var(--color-text-secondary)] transition-transform duration-200 ${
            isOpen ? "text-[var(--color-accent-light)]" : "rotate-180"
          }`}
        >
          <path
            d="M1 1l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-4"
          >
            <div
              role="menu"
              className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 font-mono text-[var(--color-text-secondary)] shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-md"
            >
              {items.map((item) => (
                <Link
                  key={item.href}
                  role="menuitem"
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 hover:bg-[var(--color-subtle-hover)] hover:text-[var(--color-text-primary)]"
                >
                  <span>{item.title}</span>
                  <span
                    aria-hidden="true"
                    className="text-[var(--color-accent-light)] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  >
                    &rarr;
                  </span>
                </Link>
              ))}
              <div className="mx-3 my-1.5 border-t border-[var(--color-border)]" />
              <Link
                role="menuitem"
                href="/#topics"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs tracking-wide text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-accent-light)]"
              >
                {t("allTopics")} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
