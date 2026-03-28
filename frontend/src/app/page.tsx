"use client";

import type { JSX } from "react";
import { useEffect, useRef } from "react";
import ButtonLink from "@/components/nav/ButtonLink";

const VIDEO_SRC = "https://d2k0ncl90mug6s.cloudfront.net/bvideo-20251020.mp4"; 

export default function Home(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);

    // Respect "reduced motion" — pause the video for those users.
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReduced.matches && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <article className="flex flex-col items-center px-6 pt-24 pb-32 text-center font-ibm sm:px-12 md:px-20">
      <div className="absolute top-0 h-screen w-full">
          <video 
          ref={videoRef}
            autoPlay 
            muted
            loop 
            playsInline
            preload="metadata"
            className="z-0 h-full w-full object-cover">
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40 z-10" />
      </div>
      <header className="z-20 flex min-h-[calc(100vh-4rem)] w-full items-center justify-center">
        <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-black/30 px-6 py-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-[3px] sm:px-10 sm:py-14">
          <div className="mx-auto max-w-2xl space-y-8">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-300/90 sm:text-sm">
              Offensive security for modern web applications
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.15)] sm:text-5xl md:text-6xl">
              When it happens, will you be ready?
            </h1>
            <p className="mx-auto max-w-xl text-base leading-8 text-zinc-200 sm:text-lg">
              I help startups, developers, and small businesses identify vulnerabilities, improve application security, and fix weaknesses before attackers find them.
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
              Web Application Security · DevSecOps · Penetration Testing
            </p>
          </div>
        </div>
      </header>

      <section
        id="what-i-do"
        className="z-20 mt-24 max-w-3xl space-y-4 text-zinc-300 sm:mt-32"
      >
        <h2 className="text-2xl font-semibold text-white">What I do</h2>
        <p className="leading-relaxed">
          My focus is on{" "}
          <span className="text-white">web application security</span>,{" "}
          <span className="text-white">DevSecOps</span>,{" "}
          <span className="text-white">full-stack web development</span>, and{" "}
          <span className="text-white">penetration testing</span>.
        </p>
      </section>
    </article>
  );
}
