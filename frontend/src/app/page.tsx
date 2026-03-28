"use client";

import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import ButtonLink from "@/components/nav/ButtonLink";

const VIDEO_SRC = "https://d2k0ncl90mug6s.cloudfront.net/bvideo-20251020.mp4";
const HEADLINE = "When it happens, will you be ready?";
const CHECK_MARK = "\u2714";
const HEADLINE_TYPING_DELAY_MS = 52;
const TERMINAL_TYPING_DELAY_MS = 40;
const TERMINAL_STATUS_TYPING_DELAY_MS = 24;
const TERMINAL_LINES = [
  "> run security_scan",
  "Scanning...",
  `${CHECK_MARK} vulnerabilities found: 3`,
  `${CHECK_MARK} severity: high`,
  `${CHECK_MARK} recommendation: fix auth flow`,
];
const SERVICE_CARDS = [
  {
    title: "Web App Security",
    text: "Identify vulnerabilities in modern web applications before attackers do.",
  },
  {
    title: "Penetration Testing",
    text: "Practical offensive testing to uncover real-world weaknesses and risk.",
  },
  {
    title: "Secure Development",
    text: "Build and improve products with security in mind from the start.",
  },
];

export default function Home(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const terminalSectionRef = useRef<HTMLElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [headlineLength, setHeadlineLength] = useState(0);
  const [showHeadlineCursor, setShowHeadlineCursor] = useState(false);
  const [terminalLineIndex, setTerminalLineIndex] = useState(0);
  const [terminalCharCount, setTerminalCharCount] = useState(0);
  const [terminalComplete, setTerminalComplete] = useState(false);
  const [terminalAnimationStarted, setTerminalAnimationStarted] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const applyMotionPreference = () => {
      const reduceMotion = prefersReduced.matches;
      setPrefersReducedMotion(reduceMotion);

      if (videoRef.current) {
        if (reduceMotion) {
          videoRef.current.pause();
        } else {
          void videoRef.current.play().catch(() => {});
        }
      }

      if (reduceMotion) {
        setHeadlineLength(HEADLINE.length);
        setShowHeadlineCursor(false);
        setTerminalLineIndex(TERMINAL_LINES.length - 1);
        setTerminalCharCount(TERMINAL_LINES[TERMINAL_LINES.length - 1].length);
        setTerminalComplete(true);
        setTerminalAnimationStarted(true);
      } else {
        setHeadlineLength(0);
        setShowHeadlineCursor(false);
        setTerminalLineIndex(0);
        setTerminalCharCount(0);
        setTerminalComplete(false);
        setTerminalAnimationStarted(false);
      }
    };

    applyMotionPreference();
    prefersReduced.addEventListener("change", applyMotionPreference);

    return () => {
      prefersReduced.removeEventListener("change", applyMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let index = 1; index <= HEADLINE.length; index += 1) {
      timers.push(
        setTimeout(() => setHeadlineLength(index), index * HEADLINE_TYPING_DELAY_MS),
      );
    }

    const headlineDoneAt = HEADLINE.length * HEADLINE_TYPING_DELAY_MS;
    timers.push(setTimeout(() => setShowHeadlineCursor(true), headlineDoneAt + 120));

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || terminalAnimationStarted) {
      return;
    }

    const section = terminalSectionRef.current;
    if (!section) {
      return;
    }

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

    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion, terminalAnimationStarted]);

  useEffect(() => {
    if (prefersReducedMotion || !terminalAnimationStarted) {
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    let terminalElapsed = 120;

    TERMINAL_LINES.forEach((line, lineIndex) => {
      for (let charIndex = 1; charIndex <= line.length; charIndex += 1) {
        timers.push(
          setTimeout(() => {
            setTerminalLineIndex(lineIndex);
            setTerminalCharCount(charIndex);
          }, terminalElapsed),
        );
        terminalElapsed += line.startsWith(CHECK_MARK)
          ? TERMINAL_STATUS_TYPING_DELAY_MS
          : TERMINAL_TYPING_DELAY_MS;
      }

      if (lineIndex < TERMINAL_LINES.length - 1) {
        terminalElapsed += line === "Scanning..." ? 240 : 140;
      }
    });

    timers.push(setTimeout(() => setTerminalComplete(true), terminalElapsed + 120));

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [prefersReducedMotion, terminalAnimationStarted]);

  return (
    <article className="flex flex-col items-center px-6 pt-10 pb-32 text-center font-ibm sm:px-12 md:px-20">
      <div className="absolute top-0 h-screen w-full">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="z-0 h-full w-full object-cover"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-10 bg-black/40" />
      </div>

      <header className="z-20 flex min-h-[calc(100vh-4rem)] w-full items-center justify-center">
        <div className="w-full max-w-7xl rounded-xl border border-white/3 bg-black/10 sx-6 py-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-[3px] sm:px-10 sm:py-14">
          <div className="mx-auto max-w-2xl space-y-8">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-300/90 sm:text-sm">
              Offensive security for modern web applications
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.15)] sm:text-5xl md:text-6xl">
              <span aria-label={HEADLINE}>
                {HEADLINE.slice(0, headlineLength)}
                {!prefersReducedMotion && showHeadlineCursor ? (
                  <span
                    aria-hidden="true"
                    className="terminal-cursor ml-1 inline-block text-zinc-200"
                  >
                    _
                  </span>
                ) : null}
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-base leading-8 text-zinc-200 sm:text-lg">
              I help startups, developers, and small businesses identify vulnerabilities,
              improve application security, and fix weaknesses before attackers find them.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <ButtonLink
                href="mailto:info@niwosystems.com"
                className="border-white/20 bg-white text-black hover:bg-zinc-200"
              >
                Work With Me
              </ButtonLink>
              <ButtonLink
                href="#what-i-do"
                className="border-zinc-400/30 bg-black/20 text-zinc-100 hover:bg-white/10"
              >
                View Services
              </ButtonLink>
            </div>
            <p className="text-sm text-zinc-400">
              Web Application Security {"\u00B7"} DevSecOps {"\u00B7"} Penetration Testing
            </p>
          </div>
        </div>
      </header>

      <div className="z-20 mt-12 flex w-full max-w-5xl flex-col items-center gap-14 sm:mt-16 sm:gap-16">
        <section ref={terminalSectionRef} className="w-full">
          <div className="mx-auto w-full max-w-2xl rounded-xl border border-white/10 bg-black/30 p-5 text-left shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-[3px] sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-600/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700/50" />
                <span className="ml-3 text-[0.7rem] leading-none uppercase tracking-[0.25em] text-zinc-500">
                  operator console
                </span>
              </div>
              <span
                className={`shrink-0 rounded-full border border-emerald-300/15 bg-emerald-300/8 px-2 py-1 text-[0.65rem] leading-none uppercase tracking-[0.22em] text-zinc-400 transition-all duration-300 ${
                  terminalComplete
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              >
                scan complete
              </span>
            </div>
            <div className="min-h-[12rem] space-y-2 text-sm leading-7 text-zinc-300 sm:min-h-[12.75rem] sm:text-[0.95rem]">
              {TERMINAL_LINES.map((line, index) => {
                const isVisible = prefersReducedMotion || index <= terminalLineIndex;
                const isStatusLine = line.startsWith(CHECK_MARK);
                const isFinalLine = index === TERMINAL_LINES.length - 1;
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
                        className="terminal-cursor ml-1 inline-block text-zinc-500"
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

        <section id="what-i-do" className="w-full">
          <div className="mx-auto max-w-5xl space-y-8 text-left">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-zinc-500 sm:text-sm">
                Services
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                Built for modern application risk
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                Focused security support across assessment, testing, and product delivery.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {SERVICE_CARDS.map((card) => (
                <article
                  key={card.title}
                  className="rounded-xl border border-white/10 bg-black/30 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[3px]"
                >
                  <p className="mb-4 text-[0.7rem] uppercase tracking-[0.24em] text-zinc-500">
                    Service
                  </p>
                  <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-zinc-400">
                    {card.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
