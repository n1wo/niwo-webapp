"use client";

import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ServiceCard from "@/components/services/ServiceCard";
import { serviceDefinitions } from "@/data/services";

const VIDEO_SRC = "https://d2k0ncl90mug6s.cloudfront.net/bvideo-20251020.mp4";
const CHECK_MARK = "\u2714";
const HEADLINE_TYPING_DELAY_MS = 52;
const SECTION_HEADING_TYPING_DELAY_MS = 34;
const TERMINAL_TYPING_DELAY_MS = 40;
const TERMINAL_STATUS_TYPING_DELAY_MS = 24;

export default function HomePage(): JSX.Element {
  const t = useTranslations("Home");
  const serviceT = useTranslations("Services");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const terminalSectionRef = useRef<HTMLElement | null>(null);
  const servicesHeadingRef = useRef<HTMLDivElement | null>(null);
  const approachHeadingRef = useRef<HTMLDivElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [headlineLength, setHeadlineLength] = useState(0);
  const [showHeadlineCursor, setShowHeadlineCursor] = useState(false);
  const [servicesTitleLength, setServicesTitleLength] = useState(0);
  const [approachTitleLength, setApproachTitleLength] = useState(0);
  const [servicesTitleTypingStarted, setServicesTitleTypingStarted] = useState(false);
  const [approachTitleTypingStarted, setApproachTitleTypingStarted] = useState(false);
  const [showServicesTitleCursor, setShowServicesTitleCursor] = useState(false);
  const [showApproachTitleCursor, setShowApproachTitleCursor] = useState(false);
  const [terminalLineIndex, setTerminalLineIndex] = useState(0);
  const [terminalCharCount, setTerminalCharCount] = useState(0);
  const [terminalComplete, setTerminalComplete] = useState(false);
  const [terminalAnimationStarted, setTerminalAnimationStarted] = useState(false);

  const headline = t("heroHeadline");
  const servicesTitle = t("servicesTitle");
  const approachTitle = t("approach.title");
  const terminalLines = useMemo(
    () => [
      t("terminal.lines.command"),
      t("terminal.lines.scanning"),
      t("terminal.lines.findings"),
      t("terminal.lines.severity"),
      t("terminal.lines.recommendation"),
    ],
    [t],
  );
  const terminalSignature = terminalLines.join("\n");

  const serviceCards = useMemo(
    () =>
      serviceDefinitions.map((service) => ({
        ...service,
        href: `/services/${service.slug}`,
        eyebrow: serviceT(`items.${service.key}.card.eyebrow`),
        title: serviceT(`items.${service.key}.card.title`),
        text: serviceT(`items.${service.key}.card.text`),
        accent: serviceT(`items.${service.key}.card.accent`),
      })),
    [serviceT],
  );

  const approachCards = useMemo(
    () => [
      {
        title: t("approach.cards.scope.title"),
        text: t("approach.cards.scope.text"),
      },
      {
        title: t("approach.cards.testing.title"),
        text: t("approach.cards.testing.text"),
      },
      {
        title: t("approach.cards.reporting.title"),
        text: t("approach.cards.reporting.text"),
      },
      {
        title: t("approach.cards.remediation.title"),
        text: t("approach.cards.remediation.text"),
      },
    ],
    [t],
  );

  /* ── reduced motion ── */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      const reduce = mq.matches;
      setPrefersReducedMotion(reduce);

      if (videoRef.current) {
        if (reduce) {
          videoRef.current.pause();
        } else {
          void videoRef.current.play().catch(() => {});
        }
      }

      if (reduce) {
        setHeadlineLength(headline.length);
        setShowHeadlineCursor(false);
        setServicesTitleLength(servicesTitle.length);
        setApproachTitleLength(approachTitle.length);
        setServicesTitleTypingStarted(true);
        setApproachTitleTypingStarted(true);
        setShowServicesTitleCursor(false);
        setShowApproachTitleCursor(false);
        setTerminalLineIndex(terminalLines.length - 1);
        setTerminalCharCount(terminalLines[terminalLines.length - 1].length);
        setTerminalComplete(true);
        setTerminalAnimationStarted(true);
      } else {
        setHeadlineLength(0);
        setShowHeadlineCursor(false);
        setServicesTitleLength(0);
        setApproachTitleLength(0);
        setServicesTitleTypingStarted(false);
        setApproachTitleTypingStarted(false);
        setShowServicesTitleCursor(false);
        setShowApproachTitleCursor(false);
        setTerminalLineIndex(0);
        setTerminalCharCount(0);
        setTerminalComplete(false);
        setTerminalAnimationStarted(false);
      }
    };

    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [approachTitle, headline, servicesTitle, terminalLines, terminalSignature]);

  /* ── headline typing ── */
  useEffect(() => {
    if (prefersReducedMotion) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 1; i <= headline.length; i += 1) {
      timers.push(
        setTimeout(() => setHeadlineLength(i), i * HEADLINE_TYPING_DELAY_MS),
      );
    }

    const headlineDoneAt = headline.length * HEADLINE_TYPING_DELAY_MS;
    timers.push(setTimeout(() => setShowHeadlineCursor(true), headlineDoneAt + 120));

    return () => timers.forEach((t) => clearTimeout(t));
  }, [headline, prefersReducedMotion]);

  /* ── section heading intersection observers ── */
  useEffect(() => {
    if (prefersReducedMotion || servicesTitleTypingStarted) return;
    const heading = servicesHeadingRef.current;
    if (!heading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setServicesTitleTypingStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 18% 0px" },
    );
    observer.observe(heading);
    return () => observer.disconnect();
  }, [prefersReducedMotion, servicesTitleTypingStarted]);

  useEffect(() => {
    if (prefersReducedMotion || approachTitleTypingStarted) return;
    const heading = approachHeadingRef.current;
    if (!heading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setApproachTitleTypingStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 18% 0px" },
    );
    observer.observe(heading);
    return () => observer.disconnect();
  }, [approachTitleTypingStarted, prefersReducedMotion]);

  /* ── section heading typing ── */
  useEffect(() => {
    if (prefersReducedMotion || !servicesTitleTypingStarted) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 1; i <= servicesTitle.length; i += 1) {
      timers.push(
        setTimeout(() => setServicesTitleLength(i), i * SECTION_HEADING_TYPING_DELAY_MS),
      );
    }

    const doneAt = servicesTitle.length * SECTION_HEADING_TYPING_DELAY_MS;
    timers.push(setTimeout(() => setShowServicesTitleCursor(true), doneAt + 100));

    return () => timers.forEach((t) => clearTimeout(t));
  }, [prefersReducedMotion, servicesTitle, servicesTitleTypingStarted]);

  useEffect(() => {
    if (prefersReducedMotion || !approachTitleTypingStarted) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 1; i <= approachTitle.length; i += 1) {
      timers.push(
        setTimeout(() => setApproachTitleLength(i), i * SECTION_HEADING_TYPING_DELAY_MS),
      );
    }

    const doneAt = approachTitle.length * SECTION_HEADING_TYPING_DELAY_MS;
    timers.push(setTimeout(() => setShowApproachTitleCursor(true), doneAt + 100));

    return () => timers.forEach((t) => clearTimeout(t));
  }, [approachTitle, approachTitleTypingStarted, prefersReducedMotion]);

  /* ── terminal intersection observer ── */
  useEffect(() => {
    if (prefersReducedMotion || terminalAnimationStarted) return;
    const section = terminalSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setTerminalAnimationStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [prefersReducedMotion, terminalAnimationStarted]);

  /* ── terminal typing ── */
  useEffect(() => {
    if (prefersReducedMotion || !terminalAnimationStarted) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 120;

    terminalLines.forEach((line, lineIndex) => {
      for (let charIndex = 1; charIndex <= line.length; charIndex += 1) {
        timers.push(
          setTimeout(() => {
            setTerminalLineIndex(lineIndex);
            setTerminalCharCount(charIndex);
          }, elapsed),
        );
        elapsed += line.startsWith(CHECK_MARK)
          ? TERMINAL_STATUS_TYPING_DELAY_MS
          : TERMINAL_TYPING_DELAY_MS;
      }
      if (lineIndex < terminalLines.length - 1) {
        elapsed += line === t("terminal.lines.scanning") ? 240 : 140;
      }
    });

    timers.push(setTimeout(() => setTerminalComplete(true), elapsed + 120));
    return () => timers.forEach((t) => clearTimeout(t));
  }, [prefersReducedMotion, terminalAnimationStarted, terminalLines, terminalSignature, t]);

  return (
    <div className="flex flex-col items-center">
      {/* ── Hero with video background ── */}
      <header className="relative w-full min-h-screen flex items-center justify-center px-6 pt-10 pb-14 sm:px-12 md:px-20">
        {/* Video background */}
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            poster="/assets/video/poster.jpg"
            className="h-full w-full object-cover"
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-black/70 to-[#0a0a0a]" />
        </div>

        {/* Glass hero card */}
        <div className="relative z-10 w-full max-w-4xl rounded-2xl border border-white/[0.08] bg-black/25 px-8 py-12 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-12 sm:py-16">
          <div className="max-w-3xl space-y-8">
            <p className="text-sm font-medium tracking-wide text-[var(--color-accent-light)]">
              {t("heroEyebrow")}
            </p>

            <h1 className="relative font-mono text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span aria-hidden="true" className="invisible block whitespace-pre-wrap">
                {headline}
              </span>
              <span aria-label={headline} className="absolute inset-0 block">
                {headline.slice(0, headlineLength)}
                {!prefersReducedMotion && showHeadlineCursor ? (
                  <span
                    aria-hidden="true"
                    className="terminal-cursor ml-1 inline-block text-[var(--color-accent-light)]"
                  >
                    _
                  </span>
                ) : null}
              </span>
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-zinc-200">
              {t("heroParagraph")}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium tracking-wide text-zinc-400">
              <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1.5">
                {t("heroSignals.scope")}
              </span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1.5">
                {t("heroSignals.reporting")}
              </span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1.5">
                {t("heroSignals.remediation")}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="mailto:info@niwosystems.com"
                className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_var(--color-accent-glow)] transition-all duration-200 hover:bg-[var(--color-accent-light)] hover:shadow-[0_0_32px_rgb(140_127_224/0.34)]"
              >
                {t("primaryCta")}
              </a>
              <Link
                href="/#what-i-do"
                className="inline-flex items-center justify-center rounded-lg border border-white/[0.15] bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-zinc-100 backdrop-blur-sm transition-colors duration-200 hover:border-white/[0.25] hover:bg-white/[0.1]"
              >
                {t("secondaryCta")}
              </Link>
            </div>

            <p className="text-sm text-zinc-400">{t("supportLine")}</p>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <div className="w-full max-w-6xl space-y-28 px-6 pt-16 pb-32 sm:px-12 sm:space-y-36 md:px-20">

        {/* ── Terminal ── */}
        <section ref={terminalSectionRef} className="mx-auto max-w-2xl">
          <div className="rounded-lg border border-white/[0.08] bg-[#111113] shadow-[0_16px_48px_rgb(0_0_0/0.4)]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-zinc-600" />
                <span className="h-2 w-2 rounded-full bg-zinc-700" />
                <span className="h-2 w-2 rounded-full bg-zinc-800" />
                <span className="ml-3 text-[0.65rem] font-medium uppercase tracking-widest text-zinc-600">
                  {t("terminal.label")}
                </span>
              </div>
              <span
                className={`rounded-full border border-[rgb(95_98_184/0.28)] bg-[rgb(95_98_184/0.1)] px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-widest text-[var(--color-accent-light)] transition-opacity duration-300 ${
                  terminalComplete ? "opacity-100" : "opacity-0"
                }`}
              >
                {t("terminal.complete")}
              </span>
            </div>
            <div className="min-h-[12rem] space-y-2 p-5 font-mono text-sm leading-7 text-zinc-400 sm:min-h-[12.75rem] sm:text-[0.92rem]">
              {terminalLines.map((line, index) => {
                const isVisible = prefersReducedMotion || index <= terminalLineIndex;
                const isStatusLine = line.startsWith(CHECK_MARK);
                const isFinalLine = index === terminalLines.length - 1;
                const showLineCursor =
                  !prefersReducedMotion &&
                  ((index === terminalLineIndex && !terminalComplete) ||
                    (isFinalLine && terminalComplete));
                const visibleText =
                  prefersReducedMotion || index < terminalLineIndex
                    ? line
                    : index === terminalLineIndex
                      ? line.slice(0, terminalCharCount)
                      : "";

                return (
                  <p
                    key={line}
                    className={`terminal-line ${
                      isVisible ? "terminal-line-visible" : ""
                    } ${isStatusLine ? "text-zinc-200" : ""}`}
                  >
                    {visibleText}
                    {showLineCursor ? (
                      <span
                        aria-hidden="true"
                        className="terminal-cursor ml-1 inline-block text-[var(--color-accent-light)]"
                      >
                        _
                      </span>
                    ) : null}
                  </p>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Services ── */}
        <section id="what-i-do" className="space-y-10">
          <div ref={servicesHeadingRef} className="max-w-2xl space-y-4">
            <p className="text-sm font-medium tracking-wide text-[var(--color-accent-light)]">
              {t("servicesEyebrow")}
            </p>
            <h2 className="relative font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl">
              <span aria-hidden="true" className="invisible block whitespace-pre-wrap">
                {servicesTitle}
              </span>
              <span aria-label={servicesTitle} className="absolute inset-0 block">
                {servicesTitle.slice(0, servicesTitleLength)}
                {!prefersReducedMotion && showServicesTitleCursor ? (
                  <span
                    aria-hidden="true"
                    className="terminal-cursor ml-1 inline-block text-[var(--color-accent-light)]"
                  >
                    _
                  </span>
                ) : null}
              </span>
            </h2>
            <p className="text-base leading-7 text-zinc-400">
              {t("servicesDescription")}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 md:auto-rows-fr md:items-stretch">
            {serviceCards.map((card, index) => (
              <ServiceCard
                key={card.title}
                href={card.href}
                eyebrow={card.eyebrow}
                title={card.title}
                text={card.text}
                accent={card.accent}
                visual={card.visual}
                prefersReducedMotion={prefersReducedMotion}
                delay={index * 0.08}
              />
            ))}
          </div>
        </section>

        {/* ── Approach ── */}
        <section className="space-y-10">
          <div ref={approachHeadingRef} className="max-w-2xl space-y-4">
            <p className="text-sm font-medium tracking-wide text-[var(--color-accent-light)]">
              {t("approach.eyebrow")}
            </p>
            <h2 className="relative font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl">
              <span aria-hidden="true" className="invisible block whitespace-pre-wrap">
                {approachTitle}
              </span>
              <span aria-label={approachTitle} className="absolute inset-0 block">
                {approachTitle.slice(0, approachTitleLength)}
                {!prefersReducedMotion && showApproachTitleCursor ? (
                  <span
                    aria-hidden="true"
                    className="terminal-cursor ml-1 inline-block text-[var(--color-accent-light)]"
                  >
                    _
                  </span>
                ) : null}
              </span>
            </h2>
            <p className="text-base leading-7 text-zinc-400">
              {t("approach.description")}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {approachCards.map((card, index) => (
              <motion.article
                key={card.title}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.97 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.38,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group rounded-lg border border-white/[0.08] bg-[#111113] p-6 transition-colors duration-200 hover:border-[rgb(95_98_184/0.3)]"
              >
                <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-sm font-semibold text-[var(--color-accent-light)]">
                  {index + 1}
                </div>
                <h3 className="text-base font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{card.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="rounded-lg border border-white/[0.08] bg-[#111113] px-8 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {t("supportLine")}
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:info@niwosystems.com"
              className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_var(--color-accent-glow)] transition-all duration-200 hover:bg-[var(--color-accent-light)] hover:shadow-[0_0_32px_rgb(140_127_224/0.34)]"
            >
              {t("primaryCta")}
            </a>
            <Link
              href="/#what-i-do"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-transparent px-6 py-3 text-sm font-semibold text-zinc-300 transition-colors duration-200 hover:border-zinc-500 hover:text-white"
            >
              {t("secondaryCta")}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
