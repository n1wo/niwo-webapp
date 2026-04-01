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
      className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-200/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <motion.article
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{
          duration: 0.45,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={prefersReducedMotion ? {} : { y: -6, scale: 1.01 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.985 }}
        className="service-card flex h-full min-h-[28rem] flex-col rounded-xl border border-white/10 bg-black/30 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[3px]"
      >
        <div className="mb-6 h-48">
          <ServiceVisual visual={visual} />
        </div>
        <div className="flex flex-1 flex-col">
          <p className="mb-3 text-[0.7rem] uppercase tracking-[0.24em] text-zinc-500">{eyebrow}</p>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-4 text-sm leading-7 text-zinc-400">{text}</p>
          <div className="mt-auto flex items-center gap-4 border-t border-white/8 pt-4 text-[0.7rem] uppercase tracking-[0.22em] text-zinc-500">
            <span>{accent}</span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
