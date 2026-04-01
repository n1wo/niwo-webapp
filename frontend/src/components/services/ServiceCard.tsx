"use client";

import type { JSX } from "react";
import { motion } from "framer-motion";
import type { ServiceVisualType } from "@/data/services";
import { Link } from "@/i18n/navigation";
import ServiceVisual from "./ServiceVisual";

type ServiceCardProps = {
  href: string;
  eyebrow: string;
  title: string;
  text: string;
  accent: string;
  visual: ServiceVisualType;
  prefersReducedMotion: boolean;
  delay: number;
};

export default function ServiceCard({
  href,
  eyebrow,
  title,
  text,
  accent,
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
      <motion.article
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{
          duration: 0.4,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="service-card flex h-full min-h-[26rem] flex-col rounded-lg border border-white/[0.08] bg-[#111113] p-6"
      >
        <div className="mb-6 h-44">
          <ServiceVisual visual={visual} />
        </div>
        <div className="flex flex-1 flex-col">
          <p className="mb-3 text-xs font-medium tracking-wide text-[var(--color-accent-light)]">{eyebrow}</p>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
          <div className="mt-auto flex items-center gap-4 border-t border-white/[0.06] pt-4 text-xs font-medium tracking-wide text-zinc-500">
            <span>{accent}</span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
