"use client";

import type { JSX } from "react";
import { motion } from "framer-motion";

type PhishingTrainerVisualProps = {
  prefersReducedMotion: boolean;
};

export default function PhishingTrainerVisual({
  prefersReducedMotion,
}: PhishingTrainerVisualProps): JSX.Element {
  const animation = prefersReducedMotion
    ? {}
    : {
        y: [0, -5, 0],
        opacity: [0.92, 1, 0.92],
      };

  return (
    <motion.div
      aria-hidden="true"
      animate={animation}
      transition={{
        duration: 5.4,
        repeat: prefersReducedMotion ? 0 : Infinity,
        ease: "easeInOut",
      }}
      className="relative hidden min-h-48 overflow-hidden rounded-lg border border-white/[0.08] bg-[#151519] p-3 shadow-[0_18px_48px_rgb(0_0_0/0.34)] lg:block"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_22%,rgb(95_98_184/0.2),transparent_34%)]" />
      <div className="relative rounded-md border border-white/[0.07] bg-black/20">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-zinc-500">
            Incoming message
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-light)]" />
        </div>
        <div className="space-y-3 px-3 py-4">
          <div className="space-y-1">
            <div className="font-mono text-[0.68rem] text-zinc-300">
              security@paypaI-alert.com
            </div>
            <div className="font-mono text-xs font-semibold text-zinc-100">
              Your account will be limited
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-white/[0.08]" />
            <div className="h-1.5 w-[78%] rounded-full bg-white/[0.08]" />
            <div className="h-1.5 w-[58%] rounded-full bg-white/[0.08]" />
          </div>
          <div className="inline-flex rounded-md border border-[rgb(95_98_184/0.32)] bg-[rgb(95_98_184/0.12)] px-2.5 py-1 font-mono text-[0.68rem] font-semibold text-[var(--color-accent-light)]">
            Verify now
          </div>
        </div>
      </div>
      <div className="relative mt-3 flex flex-wrap gap-2">
        {["unusual sender", "urgent wording", "suspicious link"].map((label) => (
          <span
            key={label}
            className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[0.62rem] text-zinc-500"
          >
            {label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
