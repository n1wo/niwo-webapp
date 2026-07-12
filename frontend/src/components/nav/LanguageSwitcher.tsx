"use client";

import {useLocale, useTranslations} from "next-intl";
import {Link, usePathname} from "@/i18n/navigation";
import {routing} from "@/i18n/routing";

export default function LanguageSwitcher({ onNavigate }: { onNavigate?: () => void } = {}) {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      aria-label={t("label")}
      className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] p-1 font-mono text-xs font-medium tracking-wide text-zinc-400"
    >
      {routing.locales.map((nextLocale) => {
        const isActive = locale === nextLocale;

        return (
          <Link
            key={nextLocale}
            href={pathname}
            locale={nextLocale}
            onClick={onNavigate}
            className={`rounded-full px-2.5 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(140_127_224/0.74)] ${
              isActive
                ? "bg-[var(--color-accent)] text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {t(nextLocale)}
          </Link>
        );
      })}
    </div>
  );
}
