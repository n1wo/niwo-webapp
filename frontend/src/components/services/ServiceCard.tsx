"use client";

import type { JSX } from "react";
import { motion } from "framer-motion";
import CardShell from "@/components/common/CardShell";
import type { ServiceVisualType } from "@/data/services";
import { Link } from "@/i18n/navigation";
import ServiceVisual from "./ServiceVisual";

type ServiceCardProps = {
  href: string;
  eyebrow: string;
  title: string;
  text: string;
  tag: string;
  visual: ServiceVisualType;
  prefersReducedMotion: boolean;
  delay: number;
};

export default function ServiceCard({
  href,
  eyebrow,
  title,
  text,
  tag,
  visual,
  prefersReducedMotion,
  delay,
}: ServiceCardProps): JSX.Element {
  return (
    <Link
      href={href}
      aria-label={title}
      className="group block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(140_127_224/0.74)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
    >
      <CardShell
        as={motion.article}
        variant="interactive"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{
          duration: 0.4,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex h-full min-h-[26rem] flex-col"
      >
        <div className="h-64 w-full shrink-0">
          <ServiceVisual visual={visual} />
        </div>
        <div className="flex flex-1 flex-col border-t border-white/[0.06] px-6 pt-5 pb-6">
          <p className="mb-3 font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--color-accent-light)]">
            {eyebrow}
          </p>
          <h3 className="font-mono text-base font-semibold leading-6 text-white sm:text-lg">
            {title}
          </h3>
          <p className="mt-4 max-w-[40ch] font-mono text-[0.92rem] leading-7 text-zinc-300/88">
            {text}
          </p>
          <p className="mt-auto max-w-[44ch] pt-5 font-mono text-[0.72rem] leading-6 text-zinc-500">
            {tag}
          </p>
        </div>
      </CardShell>
    </Link>
  );
}
