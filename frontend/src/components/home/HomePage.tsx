"use client";

import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import ActionLink from "@/components/common/ActionLink";
import CardShell from "@/components/common/CardShell";
import PrimarySecondaryCta from "@/components/common/PrimarySecondaryCta";
import InteractiveTerminal from "@/components/home/InteractiveTerminal";
import LivingTrustGraph from "@/components/home/LivingTrustGraph";
import TopicEditorialRow from "@/components/home/TopicEditorialRow";
import TopicArtwork from "@/components/home/TopicArtwork";

const HEADLINE_TYPING_DELAY_MS = 28;
const SECTION_HEADING_TYPING_DELAY_MS = 22;

export default function HomePage(): JSX.Element {
  const t = useTranslations("Home");
  const servicesHeadingRef = useRef<HTMLDivElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [headlineLength, setHeadlineLength] = useState(0);
  const [showHeadlineCursor, setShowHeadlineCursor] = useState(false);
  const [servicesTitleLength, setServicesTitleLength] = useState(0);
  const [servicesTitleTypingStarted, setServicesTitleTypingStarted] = useState(false);
  const [showServicesTitleCursor, setShowServicesTitleCursor] = useState(false);

  const headline = t("heroHeadline");
  const heroKeywords = t.raw("heroKeywords") as string[];
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

  const topicRows = [
    {
      key: "aiDevSecOps",
      marker: "01",
      title: t("securityTopics.aiDevSecOps.title"),
      description: t("securityTopics.aiDevSecOps.description"),
      linkLabel: t("securityTopics.aiDevSecOps.linkLabel"),
      href: "/topics/ai-in-devsecops",
      artwork: <TopicArtwork type="aiDevSecOps" />,
    },
    {
      key: "agenticEngineering",
      marker: "02",
      title: t("securityTopics.agenticEngineering.title"),
      description: t("securityTopics.agenticEngineering.description"),
      linkLabel: t("securityTopics.agenticEngineering.linkLabel"),
      href: "/topics/agentic-engineering",
      artwork: <TopicArtwork type="agenticEngineering" />,
    },
    {
      key: "incidentResponse",
      marker: "03",
      title: t("securityTopics.incidentResponse.title"),
      description: t("securityTopics.incidentResponse.description"),
      linkLabel: t("securityTopics.incidentResponse.linkLabel"),
      href: "/topics/incident-response",
      artwork: <TopicArtwork type="incidentResponse" />,
    },
  ];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      const reduce = mq.matches;
      setPrefersReducedMotion(reduce);

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
      <header className="relative flex min-h-screen w-full items-center justify-center px-6 pt-28 pb-16 sm:px-12 sm:pt-16 lg:pt-10 lg:pb-14 md:px-20">
        <div className="absolute inset-0 overflow-hidden">
          <LivingTrustGraph />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(62%_56%_at_45%_47%,var(--background)_16%,transparent_72%)] opacity-85"
          />
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.1]" />
        </div>

        <div className="relative z-10 w-full max-w-5xl px-2 sm:px-4">
          <div className="max-w-4xl space-y-8">
            <p className="flex items-center gap-3 text-sm font-medium tracking-wide text-[var(--color-accent-light)]">
              <span
                aria-hidden="true"
                className="inline-block h-2 w-2 shrink-0 bg-[var(--color-accent-light)] opacity-70"
              />
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

            <p data-niwo-identity className="max-w-3xl border-l-2 border-[rgb(140_127_224/0.5)] pl-5 text-sm leading-7 text-zinc-300">
              {t("identityStatement")}
            </p>

            <ul className="flex max-w-3xl flex-wrap gap-2">
              {heroKeywords.map((keyword) => (
                <li
                  key={keyword}
                  className="border border-white/[0.09] bg-white/[0.02] px-3 py-1.5 font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-zinc-400"
                >
                  {keyword}
                </li>
              ))}
            </ul>

            <PrimarySecondaryCta
              className="pt-2"
              primaryLabel={t("primaryCta")}
              secondaryLabel={t("secondaryCta")}
            />
          </div>
        </div>
      </header>

      <div className="w-full max-w-7xl space-y-28 px-6 pt-16 pb-32 sm:px-12 sm:space-y-36 md:px-20 2xl:max-w-[88rem]">
        <section aria-labelledby="incident-help-title">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <CardShell variant="promoAccent" className="px-8 py-9 sm:px-10 sm:py-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl space-y-3">
                  <p className="font-mono text-xs font-medium tracking-[0.24em] text-[var(--color-accent-light)] uppercase">
                    {t("incidentHelp.eyebrow")}
                  </p>
                  <h2
                    id="incident-help-title"
                    className="font-mono text-xl font-bold leading-8 tracking-tight text-white sm:text-2xl"
                  >
                    {t("incidentHelp.title")}
                  </h2>
                  <p className="text-sm leading-7 text-zinc-300 sm:text-base">
                    {t.rich("incidentHelp.description", {
                      strong: (chunks) => (
                        <strong className="font-semibold text-white">{chunks}</strong>
                      ),
                    })}
                  </p>
                </div>
                <ActionLink
                  href="mailto:info@niwosystems.com"
                  variant="emergency"
                  font="mono"
                  className="self-start lg:shrink-0 lg:self-center"
                >
                  {t("incidentHelp.cta")}
                </ActionLink>
              </div>
            </CardShell>
          </motion.div>
        </section>

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

        <section id="topics">
          <div ref={servicesHeadingRef} className="max-w-4xl space-y-4 pb-8 sm:pb-10">
            <p className="text-sm font-medium tracking-wide text-[var(--color-accent-light)]">
              {t("servicesEyebrow")}
            </p>
            <h2 className="relative break-words hyphens-auto font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl">
              <span aria-hidden="true" className="invisible block whitespace-pre-wrap">
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
            <p className="max-w-3xl text-base leading-8 text-zinc-400">
              {t("servicesDescription")}
            </p>
          </div>

          <div>
            {topicRows.map((topic, index) => (
              <TopicEditorialRow
                key={topic.key}
                marker={topic.marker}
                title={topic.title}
                description={topic.description}
                linkLabel={topic.linkLabel}
                href={topic.href}
                artwork={topic.artwork}
                artworkFirstOnDesktop={index === 1}
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
              <div className="absolute inset-px -z-10 rounded-[calc(0.5rem-1px)] bg-linear-to-r from-[var(--color-surface)] via-[var(--color-surface)]/78 to-[var(--color-surface)]/12" />
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
                href="/pages/whoami"
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
