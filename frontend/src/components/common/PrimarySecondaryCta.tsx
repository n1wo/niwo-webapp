"use client";

import type { JSX } from "react";
import ActionLink from "./ActionLink";

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
  secondaryHref = "/#topics",
  className = "",
}: PrimarySecondaryCtaProps): JSX.Element {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`.trim()}>
      <ActionLink href={primaryHref} variant="primary">
        {primaryLabel}
      </ActionLink>
      <ActionLink href={secondaryHref} variant="secondary">
        {secondaryLabel}
      </ActionLink>
    </div>
  );
}
