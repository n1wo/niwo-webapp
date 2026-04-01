import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getLocalizedAlternates } from "@/i18n/metadata";

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

  return (
    <main className="min-h-[75vh] bg-background px-6 pb-24 pt-28 font-ibm text-foreground sm:px-10 lg:px-16">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-xl border border-white/10 bg-black/20 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-[3px] sm:p-10">
          <div className="mx-auto max-w-3xl text-left">
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-zinc-500">
              {t("eyebrow")}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-6 text-base leading-8 text-zinc-300 sm:text-lg">
              {t("intro")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-start gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-zinc-400">
                {t("profileLabel")}
              </span>
              <span className="rounded-full border border-emerald-300/15 bg-emerald-300/8 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-zinc-300">
                {t("statusLabel")}
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-zinc-500">
            <span className="h-px flex-1 bg-white/10" />
            <span>{t("signalLabel")}</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <p className="mt-5 max-w-3xl text-left text-sm leading-7 text-zinc-400 sm:text-base">
            {t("signalText")}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-xl border border-white/10 bg-black/25 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-[3px]">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-zinc-500">
              {t("cards.drives.eyebrow")}
            </p>
            <h2 className="mt-4 text-xl font-semibold text-white">
              {t("cards.drives.title")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              {t("cards.drives.text")}
            </p>
          </article>

          <article className="rounded-xl border border-white/10 bg-black/25 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-[3px]">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-zinc-500">
              {t("cards.building.eyebrow")}
            </p>
            <h2 className="mt-4 text-xl font-semibold text-white">
              {t("cards.building.title")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              {t("cards.building.text")}
            </p>
          </article>

          <article className="rounded-xl border border-white/10 bg-black/25 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-[3px] md:col-span-2 xl:col-span-1">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-zinc-500">
              {t("cards.outside.eyebrow")}
            </p>
            <h2 className="mt-4 text-xl font-semibold text-white">
              {t("cards.outside.title")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              {t("cards.outside.text")}
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
