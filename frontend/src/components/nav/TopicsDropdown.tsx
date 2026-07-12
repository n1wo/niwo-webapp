"use client";

import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { topicArticleDefinitions } from "@/data/topicArticles";
import { Link } from "@/i18n/navigation";
import styles from "./NavChrome.module.css";

const CLOSE_DELAY_MS = 140;
const MENU_ID = "desktop-topics-menu";

/** Desktop Topics disclosure with native-link keyboard navigation. */
export default function TopicsDropdown() {
  const t = useTranslations("Navbar");
  const topicsT = useTranslations("TopicArticles");
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingFocus = useRef<"first" | "last" | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const items = topicArticleDefinitions.map((topic) => ({
    key: topic.key,
    href: `/topics/${topic.slug}`,
    title: topicsT(`items.${topic.key}.title`),
  }));

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      setIsOpen(false);
    }, CLOSE_DELAY_MS);
  };

  const getMenuLinks = () =>
    Array.from(
      rootRef.current?.querySelectorAll<HTMLAnchorElement>("[data-topics-menu-link]") ?? [],
    );

  useEffect(() => {
    if (!isOpen) {
      pendingFocus.current = null;
      return;
    }
    if (!pendingFocus.current) return;

    const edge = pendingFocus.current;
    pendingFocus.current = null;
    const frame = requestAnimationFrame(() => {
      const links = Array.from(
        rootRef.current?.querySelectorAll<HTMLAnchorElement>("[data-topics-menu-link]") ?? [],
      );
      links[edge === "first" ? 0 : links.length - 1]?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
      const shouldRestoreFocus = rootRef.current?.contains(document.activeElement) ?? false;
      setIsOpen(false);
      if (shouldRestoreFocus) triggerRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        if (closeTimer.current) {
          clearTimeout(closeTimer.current);
          closeTimer.current = null;
        }
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

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const openFromKeyboard = (edge: "first" | "last") => {
    cancelClose();
    if (isOpen) {
      const links = getMenuLinks();
      links[edge === "first" ? 0 : links.length - 1]?.focus();
      return;
    }

    pendingFocus.current = edge;
    setIsOpen(true);
  };

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openFromKeyboard("first");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openFromKeyboard("last");
    }
  };

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

    const links = getMenuLinks();
    if (links.length === 0) return;

    event.preventDefault();
    const currentIndex = links.findIndex((link) => link === document.activeElement);
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? links.length - 1
          : event.key === "ArrowDown"
            ? (currentIndex + 1 + links.length) % links.length
            : (currentIndex - 1 + links.length) % links.length;
    links[nextIndex]?.focus();
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        cancelClose();
        setIsOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        if (!rootRef.current?.contains(document.activeElement)) scheduleClose();
      }}
      onFocusCapture={cancelClose}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          scheduleClose();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-controls={MENU_ID}
        aria-expanded={isOpen}
        onClick={() => {
          cancelClose();
          setIsOpen((open) => !open);
        }}
        onKeyDown={handleTriggerKeyDown}
        className={`flex h-fit w-fit cursor-pointer items-center rounded-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(140_127_224/0.74)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)] ${styles.dropdownTrigger}`}
      >
        <span>{t("services")}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 10 6"
          className={`h-1.5 w-2.5 ${styles.dropdownChevron} ${isOpen ? styles.dropdownChevronOpen : ""}`}
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
        {isOpen ? (
          <motion.div
            id={MENU_ID}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -24, clipPath: "inset(0 0 100% 0)" }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -24, clipPath: "inset(0 0 100% 0)" }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={handleMenuKeyDown}
            className={`absolute left-1/2 top-full z-50 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 ${styles.dropdownMenuFrame}`}
          >
            <ul
              aria-label={t("services")}
              className={`p-2 font-mono ${styles.dropdownMenuPanel}`}
            >
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    data-topics-menu-link
                    data-topic-nav={item.key}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[rgb(140_127_224/0.74)] ${styles.dropdownItem}`}
                  >
                    <span>{item.title}</span>
                    <span aria-hidden="true" className={styles.dropdownItemArrow}>
                      &rarr;
                    </span>
                  </Link>
                </li>
              ))}
              <li className="mx-3 mt-1.5 border-t border-white/[0.06] pt-1.5">
                <Link
                  data-topics-menu-link
                  data-all-topics-link="desktop"
                  href="/topics"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs tracking-wide text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[rgb(140_127_224/0.74)] ${styles.dropdownFooterLink}`}
                >
                  {t("allTopics")} <span aria-hidden="true">&rarr;</span>
                </Link>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
