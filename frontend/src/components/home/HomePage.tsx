"use client";

import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import PrimarySecondaryCta from "@/components/common/PrimarySecondaryCta";
import InteractiveTerminal from "@/components/home/InteractiveTerminal";
import ServiceCard from "@/components/services/ServiceCard";
import { serviceDefinitions } from "@/data/services";

const VIDEO_SRC = "https://d2k0ncl90mug6s.cloudfront.net/bvideo-20251020.mp4";
const HEADLINE_TYPING_DELAY_MS = 52;
const SECTION_HEADING_TYPING_DELAY_MS = 34;

export default function HomePage(): JSX.Element {
  const t = useTranslations("Home");
  const serviceT = useTranslations("Services");
  const videoRef = useRef<HTMLVideoElement | null>(null);
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

  const headline = t("heroHeadline");
  const servicesTitle = t("servicesTitle");
  const approachTitle = t("approach.title");

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
      } else {
        setHeadlineLength(0);
        setShowHeadlineCursor(false);
        setServicesTitleLength(0);
        setApproachTitleLength(0);
        setServicesTitleTypingStarted(false);
        setApproachTitleTypingStarted(false);
        setShowServicesTitleCursor(false);
        setShowApproachTitleCursor(false);
      }
    };

    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [approachTitle, headline, servicesTitle]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 1; i <= headline.length; i += 1) {
      timers.push(setTimeout(() => setHeadlineLength(i), i * HEADLINE_TYPING_DELAY_MS));
    }

    const headlineDoneAt = headline.length * HEADLINE_TYPING_DELAY_MS;
    timers.push(setTimeout(() => setShowHeadlineCursor(true), headlineDoneAt + 120));

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [headline, prefersReducedMotion]);

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

    return () => timers.forEach((timer) => clearTimeout(timer));
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

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [approachTitle, approachTitleTypingStarted, prefersReducedMotion]);

  return (
    <div className="flex flex-col items-center">
      <header className="relative flex min-h-screen w-full items-center justify-center px-6 pt-10 pb-14 sm:px-12 md:px-20">
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
          <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-b from-transparent via-black/70 to-[#0a0a0a]" />
        </div>

        <div className="hero-panel relative z-10 w-full max-w-5xl rounded-2xl bg-black/15 px-8 py-12 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-sm sm:px-12 sm:py-16 lg:px-14">
          <div className="max-w-4xl space-y-8">
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

            <p className="max-w-3xl text-lg leading-8 text-zinc-200">
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

            <PrimarySecondaryCta
              className="pt-2"
              primaryLabel={t("primaryCta")}
              secondaryLabel={t("secondaryCta")}
            />

            <p className="text-sm text-zinc-400">{t("supportLine")}</p>
          </div>
        </div>
      </header>

      <div className="w-full max-w-7xl space-y-28 px-6 pt-16 pb-32 sm:px-12 sm:space-y-36 md:px-20 2xl:max-w-[88rem]">
        <section className="mx-auto max-w-2xl">
          <InteractiveTerminal
            copy={{
              label: t("terminal.label"),
              complete: t("terminal.complete"),
              lines: {
                command: t("terminal.lines.command"),
                scanning: t("terminal.lines.scanning"),
                findings: t("terminal.lines.findings"),
                severity: t("terminal.lines.severity"),
                recommendation: t("terminal.lines.recommendation"),
              },
            }}
          />
        </section>

        <section id="what-i-do" className="space-y-10">
          <div ref={servicesHeadingRef} className="max-w-3xl space-y-4">
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

        <section className="space-y-10">
          <div ref={approachHeadingRef} className="max-w-3xl space-y-4">
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

        <section className="rounded-lg border border-white/[0.08] bg-[#111113] px-8 py-10 text-center sm:px-12 sm:py-11">
          <h2 className="mx-auto max-w-3xl font-mono text-lg font-medium leading-8 tracking-[-0.01em] text-zinc-100 sm:text-xl">
            {t("supportLine")}
          </h2>
          <PrimarySecondaryCta
            className="mt-6 justify-center font-mono"
            primaryLabel={t("primaryCta")}
            secondaryLabel={t("secondaryCta")}
          />
        </section>
      </div>
    </div>
  );
}
