"use client";

import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import ActionLink from "@/components/common/ActionLink";
import CardShell from "@/components/common/CardShell";
import PrimarySecondaryCta from "@/components/common/PrimarySecondaryCta";
import Surface from "@/components/common/Surface";
import InteractiveTerminal from "@/components/home/InteractiveTerminal";
import ServiceCard from "@/components/services/ServiceCard";
import { serviceDefinitions } from "@/data/services";

const VIDEO_SRC = "https://d2k0ncl90mug6s.cloudfront.net/bvideo-20251020.mp4";
const HEADLINE_TYPING_DELAY_MS = 28;
const SECTION_HEADING_TYPING_DELAY_MS = 22;

export default function HomePage(): JSX.Element {
  const t = useTranslations("Home");
  const serviceT = useTranslations("Topics");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const servicesHeadingRef = useRef<HTMLDivElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [headlineLength, setHeadlineLength] = useState(0);
  const [showHeadlineCursor, setShowHeadlineCursor] = useState(false);
  const [servicesTitleLength, setServicesTitleLength] = useState(0);
  const [servicesTitleTypingStarted, setServicesTitleTypingStarted] = useState(false);
  const [showServicesTitleCursor, setShowServicesTitleCursor] = useState(false);

  const headline = t("heroHeadline");
  const servicesTitle = t("servicesTitle");

  const renderTypedText = (text: string, length: number, showCursor: boolean) => {
    const visibleText = text.slice(0, length);
    const textBeforeCursor = visibleText.slice(0, -1);
    const finalCharacter = visibleText.slice(-1);

    if (!showCursor || visibleText.length === 0) {
      return visibleText;
    }

    return (
      <>
        {textBeforeCursor}
        <span className="inline-flex whitespace-nowrap">
          {finalCharacter}
          <span
            aria-hidden="true"
            className="terminal-cursor ml-1 inline-block text-[var(--color-accent-light)]"
          >
            _
          </span>
        </span>
      </>
    );
  };

  const serviceCards = useMemo(
    () =>
      serviceDefinitions.map((service) => ({
        ...service,
        href: `/topics/${service.slug}`,
        eyebrow: serviceT(`items.${service.key}.card.eyebrow`),
        title: serviceT(`items.${service.key}.card.title`),
        text: serviceT(`items.${service.key}.card.text`),
        tag: serviceT(`items.${service.key}.card.tag`),
      })),
    [serviceT],
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
        setServicesTitleTypingStarted(true);
        setShowServicesTitleCursor(false);
      } else {
        setHeadlineLength(0);
        setShowHeadlineCursor(false);
        setServicesTitleLength(0);
        setServicesTitleTypingStarted(false);
        setShowServicesTitleCursor(false);
      }
    };

    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [headline, servicesTitle]);

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

        <Surface
          variant="hero"
          className="relative z-10 w-full max-w-5xl px-8 py-12 sm:px-12 sm:py-16 lg:px-14"
        >
          <div className="max-w-4xl space-y-8">
            <p className="text-sm font-medium tracking-wide text-[var(--color-accent-light)]">
              {t("heroEyebrow")}
            </p>

            <h1 className="relative break-words hyphens-auto font-mono text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
              <span aria-hidden="true" className="invisible block whitespace-pre-wrap">
                {headline}
              </span>
              <span aria-label={headline} className="absolute inset-0 block">
                {renderTypedText(headline, headlineLength, !prefersReducedMotion && showHeadlineCursor)}
              </span>
            </h1>

            <p className="max-w-3xl text-lg leading-8 text-zinc-200">
              {t("heroParagraph")}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium tracking-wide text-zinc-400">
              <ActionLink href="/pages/about" variant="pill" withArrow>
                {t("hiringNotice")}
              </ActionLink>
            </div>

            <PrimarySecondaryCta
              className="pt-2"
              primaryLabel={t("primaryCta")}
              secondaryLabel={t("secondaryCta")}
            />
          </div>
        </Surface>
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

        <section id="topics" className="space-y-10">
          <div ref={servicesHeadingRef} className="max-w-5xl space-y-4">
            <p className="text-sm font-medium tracking-wide text-[var(--color-accent-light)]">
              {t("servicesEyebrow")}
            </p>
            <h2 className="relative break-words hyphens-auto font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl lg:whitespace-nowrap">
              <span aria-hidden="true" className="invisible block whitespace-pre-wrap lg:whitespace-nowrap">
                {servicesTitle}
              </span>
              <span aria-label={servicesTitle} className="absolute inset-0 block">
                {renderTypedText(
                  servicesTitle,
                  servicesTitleLength,
                  !prefersReducedMotion && showServicesTitleCursor,
                )}
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
                tag={card.tag}
                visual={card.visual}
                prefersReducedMotion={prefersReducedMotion}
                delay={index * 0.08}
              />
            ))}
          </div>
        </section>

        <section>
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <CardShell variant="promo" className="px-8 py-8 sm:px-10 sm:py-9 lg:min-h-[22rem]">
              <div
                aria-hidden="true"
                className="absolute inset-px -z-10 rounded-[calc(0.5rem-1px)] bg-cover bg-right opacity-90"
                style={{
                  backgroundImage: "url('/assets/graphics/phishing-trainer-background.png')",
                }}
              />
              <div className="absolute inset-px -z-10 rounded-[calc(0.5rem-1px)] bg-linear-to-r from-[#111113] via-[#111113]/78 to-[#111113]/12" />
              <div className="absolute inset-px -z-10 rounded-[calc(0.5rem-1px)] bg-linear-to-b from-black/18 via-transparent to-black/24" />
              <div className="relative max-w-xl space-y-2">
                <p className="font-mono text-xs font-medium tracking-widest text-[var(--color-accent-light)] uppercase">
                  {t("phishingLab.eyebrow")}
                </p>
                <h2 className="font-mono text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {t("phishingLab.title")}
                </h2>
                <p className="max-w-xl text-sm leading-7 text-zinc-400">
                  {t("phishingLab.description")}
                </p>
                <ActionLink
                  href="/pages/phishing-lab"
                  variant="subtle"
                  font="mono"
                  withArrow
                  className="mt-5 shrink-0"
                >
                  {t("phishingLab.cta")}
                </ActionLink>
              </div>
            </CardShell>
          </motion.div>
        </section>

        <section>
          <CardShell variant="promoAccent" className="px-8 py-9 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl space-y-3">
                <p className="font-mono text-xs font-medium tracking-[0.24em] text-[var(--color-accent-light)] uppercase">
                  {t("whoamiLink.eyebrow")}
                </p>
                <h2 className="font-mono text-xl font-bold leading-8 tracking-tight text-white sm:text-2xl">
                  {t("whoamiLink.title")}
                </h2>
                <p className="text-sm leading-7 text-zinc-400 sm:text-base">
                  {t("whoamiLink.text")}
                </p>
              </div>
              <ActionLink
                href="/pages/about"
                variant="subtle"
                font="mono"
                withArrow
                className="self-start md:self-center"
              >
                {t("whoamiLink.cta")}
              </ActionLink>
            </div>
          </CardShell>
        </section>
      </div>
    </div>
  );
}
