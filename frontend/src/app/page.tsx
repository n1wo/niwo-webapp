import Link from "next/link";
import type { JSX } from "react";
import ButtonLink from "@/components/nav/ButtonLink";

export default function Home(): JSX.Element {
  return (
    <article className="flex flex-col items-center justify-center text-center px-6 py-24 sm:px-12 md:px-20 min-h-[75vh] font-ibm">
      <header className="max-w-3xl space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
          Securing the Digital World, One Line of Code at a Time.
        </h1>

        <p className="text-lg text-zinc-400 leading-relaxed">
          I’m <span className="text-white font-medium">Nikita</span> — a
          cybersecurity student and freelance ethical hacker. I help startups,
          developers, and small businesses identify and fix vulnerabilities
          before attackers find them.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <ButtonLink href="/pages/contact">Contact</ButtonLink>
        </div>
      </header>

      <section className="max-w-3xl mt-24 text-zinc-400 space-y-4">
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
