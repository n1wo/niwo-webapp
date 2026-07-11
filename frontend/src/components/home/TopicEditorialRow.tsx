import type { JSX, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type TopicEditorialRowProps = {
  marker: string;
  title: string;
  description: string;
  linkLabel: string;
  href: string;
  artwork?: ReactNode;
  artworkFirstOnDesktop?: boolean;
};

export default function TopicEditorialRow({
  marker,
  title,
  description,
  linkLabel,
  href,
  artwork,
  artworkFirstOnDesktop = false,
}: TopicEditorialRowProps): JSX.Element {
  const textOrder = artworkFirstOnDesktop ? "lg:order-2 lg:pl-8" : "lg:order-1";
  const artworkOrder = artworkFirstOnDesktop ? "lg:order-1" : "lg:order-2";

  return (
    <article className="grid min-w-0 gap-10 border-t border-white/[0.08] py-16 sm:gap-12 sm:py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-20 lg:py-24">
      <div className={`order-1 min-w-0 ${textOrder}`}>
        <p
          aria-hidden="true"
          className="font-mono text-xs font-medium tracking-[0.28em] text-[var(--color-accent-light)]"
        >
          {marker}
        </p>
        <h3 className="mt-5 max-w-xl font-mono text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
          {title}
        </h3>
        <p className="mt-5 max-w-[58ch] text-base leading-8 text-zinc-300">
          {description}
        </p>
        <Link
          href={href}
          aria-label={`${linkLabel}: ${title}`}
          className="group mt-7 inline-flex items-center gap-2 rounded-sm font-mono text-sm font-medium text-zinc-200 underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-[var(--color-accent-light)] hover:decoration-[var(--color-accent-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(140_127_224/0.74)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
        >
          <span>{linkLabel}</span>
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>

      <div
        aria-hidden="true"
        className={`order-2 h-56 min-w-0 overflow-hidden sm:h-64 lg:h-72 ${artworkOrder}`}
      >
        {artwork}
      </div>
    </article>
  );
}
