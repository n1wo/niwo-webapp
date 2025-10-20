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
    <article className="flex flex-col items-center justify-center text-center px-6 py-24 sm:px-12 md:px-20 min-h-[var(--min-h-screen)] font-ibm">
      <div className="absolute h-[var(--min-h-screen)] w-full">
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
          <div className="absolute inset-0 bg-black/30 z-10" />
      </div>
      <header className="max-w-3xl space-y-6 z-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
          Securing the Digital World, One Line of Code at a Time.
        </h1>
        <p className="text-lg text-zinc-300 leading-relaxed">
          I’m <span className="text-white font-medium">Nikita</span> — a
          cybersecurity student and freelance ethical hacker. I help startups,
          developers, and small businesses identify and fix vulnerabilities
          before attackers find them.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <ButtonLink href="/pages/contact" className="bg-zinc-700">Contact</ButtonLink>
        </div>
      </header>

      <section className="max-w-3xl mt-24 text-zinc-300 space-y-4 z-20">
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
