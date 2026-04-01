"use client";

import type { JSX } from "react";
import NextLink from "next/link";
import { Link } from "@/i18n/navigation";

type PrimarySecondaryCtaProps = {
  primaryLabel: string;
  secondaryLabel: string;
  primaryHref?: string;
  secondaryHref?: string;
  className?: string;
};

export default function PrimarySecondaryCta({
  primaryLabel,
  secondaryLabel,
  primaryHref = "mailto:info@niwosystems.com",
  secondaryHref = "/#what-i-do",
  className = "",
}: PrimarySecondaryCtaProps): JSX.Element {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`.trim()}>
      <NextLink
        href={primaryHref}
        className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_var(--color-accent-glow)] transition-all duration-200 hover:bg-[var(--color-accent-light)] hover:shadow-[0_0_32px_rgb(140_127_224/0.34)]"
      >
        {primaryLabel}
      </NextLink>
      <Link
        href={secondaryHref}
        className="inline-flex items-center justify-center rounded-lg border border-white/[0.15] bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-zinc-100 backdrop-blur-sm transition-colors duration-200 hover:border-white/[0.25] hover:bg-white/[0.1]"
      >
        {secondaryLabel}
      </Link>
    </div>
  );
}
