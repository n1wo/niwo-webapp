import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getLocalizedAlternates } from "@/i18n/metadata";
import PrimarySecondaryCta from "@/components/common/PrimarySecondaryCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getLocalizedAlternates("/pages/about"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  const homeT = await getTranslations({ locale, namespace: "Home" });
  const cards = [
    {
      eyebrow: t("cards.drives.eyebrow"),
      title: t("cards.drives.title"),
      text: t("cards.drives.text"),
    },
    {
      eyebrow: t("cards.building.eyebrow"),
      title: t("cards.building.title"),
      text: t("cards.building.text"),
    },
    {
      eyebrow: t("cards.outside.eyebrow"),
      title: t("cards.outside.title"),
      text: t("cards.outside.text"),
    },
  ];

  return (
    <main className="min-h-[75vh] bg-[#0a0a0a] px-6 pb-24 pt-28 text-foreground sm:px-10 lg:px-16">
      <section className="mx-auto max-w-6xl space-y-10">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#111113] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
          <div className="border-b border-white/[0.06] px-5 py-3 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500 sm:px-8">
            /about
          </div>
          <div className="px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
            <p className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]">
              {t("eyebrow")}
            </p>
            <h1 className="mt-4 max-w-3xl font-mono text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
              {t("intro")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 font-mono">
              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-zinc-400">
                {t("profileLabel")}
              </span>
              <span className="rounded-full border border-[rgb(140_127_224/0.28)] bg-[rgb(95_98_184/0.14)] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-zinc-200">
                {t("statusLabel")}
              </span>
            </div>
          </div>
        </div>

        <div className="border-l-2 border-[rgb(95_98_184/0.35)] pl-6 py-1">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
            {t("signalLabel")}
          </p>
          <p className="mt-3 max-w-2xl font-mono text-sm leading-7 text-zinc-400">
            {t("signalText")}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className={`group rounded-2xl border border-white/[0.08] bg-[#111113] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] transition-all duration-200 hover:border-[rgb(95_98_184/0.32)] hover:shadow-[0_0_40px_rgb(95_98_184/0.1)] ${
                index === 2 ? "md:col-span-2 xl:col-span-1" : ""
              }`}
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[rgb(95_98_184/0.2)] bg-[rgb(95_98_184/0.08)] font-mono text-sm font-semibold text-[var(--color-accent-light)] shadow-[0_0_16px_rgb(95_98_184/0.12)]">
                0{index + 1}
              </div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                {card.eyebrow}
              </p>
              <h2 className="mt-4 font-mono text-lg font-semibold leading-7 text-white sm:text-xl">
                {card.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-[0.95rem]">
                {card.text}
              </p>
            </article>
          ))}
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#111113] px-8 py-10 text-center sm:px-12 sm:py-11">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[var(--color-accent-light)]">
            {t("eyebrow")}
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-mono text-lg font-medium leading-8 tracking-[-0.01em] text-zinc-100 sm:text-xl">
            {homeT("supportLine")}
          </h2>
          <PrimarySecondaryCta
            className="mt-6 justify-center font-mono"
            primaryLabel={homeT("primaryCta")}
            secondaryLabel={homeT("secondaryCta")}
          />
        </div>
      </section>
    </main>
  );
}
