import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import PrimarySecondaryCta from "@/components/common/PrimarySecondaryCta";
import ServiceVisual from "@/components/services/ServiceVisual";
import { getServiceBySlug, serviceDefinitions, type ServiceDefinition } from "@/data/services";
import { Link } from "@/i18n/navigation";
import { getLocalizedAlternates } from "@/i18n/metadata";

type ServiceContent = {
  metadata: {
    title: string;
    description: string;
  };
  card: {
    eyebrow: string;
    title: string;
    text: string;
    accent: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    intro: string;
    outcomeLabel: string;
    outcomeText: string;
  };
  covers: {
    title: string;
    items: string[];
  };
  process: {
    title: string;
    steps: { title: string; text: string }[];
  };
  bestFor: {
    title: string;
    items: string[];
  };
  deliverables: {
    title: string;
    items: string[];
  };
  cta: {
    title: string;
    text: string;
    primary: string;
    secondary: string;
  };
};

function asStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw) || !raw.every((item) => typeof item === "string")) {
    throw new Error("Expected a string array from translation data");
  }
  return raw as string[];
}

function asStepArray(raw: unknown): { title: string; text: string }[] {
  if (
    !Array.isArray(raw) ||
    !raw.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).title === "string" &&
        typeof (item as Record<string, unknown>).text === "string",
    )
  ) {
    throw new Error("Expected a step array from translation data");
  }
  return raw as { title: string; text: string }[];
}

function getServiceContent(
  t: Awaited<ReturnType<typeof getTranslations>>,
  service: ServiceDefinition,
): ServiceContent {
  const prefix = `Services.items.${service.key}` as const;

  return {
    metadata: {
      title: t(`${prefix}.metadata.title`),
      description: t(`${prefix}.metadata.description`),
    },
    card: {
      eyebrow: t(`${prefix}.card.eyebrow`),
      title: t(`${prefix}.card.title`),
      text: t(`${prefix}.card.text`),
      accent: t(`${prefix}.card.accent`),
    },
    hero: {
      eyebrow: t(`${prefix}.hero.eyebrow`),
      title: t(`${prefix}.hero.title`),
      intro: t(`${prefix}.hero.intro`),
      outcomeLabel: t(`${prefix}.hero.outcomeLabel`),
      outcomeText: t(`${prefix}.hero.outcomeText`),
    },
    covers: {
      title: t(`${prefix}.covers.title`),
      items: asStringArray(t.raw(`${prefix}.covers.items`)),
    },
    process: {
      title: t(`${prefix}.process.title`),
      steps: asStepArray(t.raw(`${prefix}.process.steps`)),
    },
    bestFor: {
      title: t(`${prefix}.bestFor.title`),
      items: asStringArray(t.raw(`${prefix}.bestFor.items`)),
    },
    deliverables: {
      title: t(`${prefix}.deliverables.title`),
      items: asStringArray(t.raw(`${prefix}.deliverables.items`)),
    },
    cta: {
      title: t(`${prefix}.cta.title`),
      text: t(`${prefix}.cta.text`),
      primary: t(`${prefix}.cta.primary`),
      secondary: t(`${prefix}.cta.secondary`),
    },
  };
}

export function generateStaticParams() {
  return serviceDefinitions.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {};
  }

  const t = await getTranslations({ locale });
  const content = getServiceContent(t, service);

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: getLocalizedAlternates(`/services/${slug}`),
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const t = await getTranslations({ locale });
  const content = getServiceContent(t, service);
  const relatedServices = serviceDefinitions.filter((item) => item.slug !== service.slug);

  return (
    <article className="px-6 pt-24 pb-28 sm:px-12 md:px-20">
      <div className="mx-auto max-w-7xl space-y-14 sm:space-y-20 2xl:max-w-[88rem]">
        <div className="flex justify-start">
          <Link
            href="/#what-i-do"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-zinc-500 transition-colors duration-200 hover:text-zinc-200"
          >
            <span aria-hidden="true">&larr;</span>
            <span>{t("Services.common.backToServices")}</span>
          </Link>
        </div>

        {/* ── hero ── */}
        <section className="rounded-lg border border-white/[0.08] bg-[#111113] px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-center">
            <div className="space-y-6 text-left">
              <p className="text-sm font-medium tracking-wide text-[var(--color-accent-light)]">
                {content.hero.eyebrow}
              </p>
              <h1 className="max-w-3xl font-mono text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
                {content.hero.title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
                {content.hero.intro}
              </p>
              <div className="max-w-xl rounded-lg border border-white/[0.08] bg-white/[0.03] px-5 py-4">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
                  {content.hero.outcomeLabel}
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-300">{content.hero.outcomeText}</p>
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.08] bg-[#111113] p-6">
              <div className="h-52">
                <ServiceVisual visual={service.visual} />
              </div>
              <div className="mt-6 border-t border-white/[0.06] pt-4">
                <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--color-accent-light)]">
                  {content.card.eyebrow}
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{content.card.text}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── covers + best-for ── */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-white/[0.08] bg-[#111113] p-6 transition-colors duration-200 hover:border-[rgb(95_98_184/0.3)]">
            <p className="text-sm font-medium tracking-wide text-[var(--color-accent-light)]">
              {content.covers.title}
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-300">
              {content.covers.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-light)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-[#111113] p-6 transition-colors duration-200 hover:border-[rgb(95_98_184/0.3)]">
            <p className="text-sm font-medium tracking-wide text-[var(--color-accent-light)]">
              {content.bestFor.title}
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-300">
              {content.bestFor.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-light)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── process + deliverables ── */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-lg border border-white/[0.08] bg-[#111113] p-6">
            <p className="text-sm font-medium tracking-wide text-[var(--color-accent-light)]">
              {content.process.title}
            </p>
            <div className="mt-6 space-y-5">
              {content.process.steps.map((step, index) => (
                <div
                  key={step.title}
                  className="grid gap-4 border-t border-white/[0.06] pt-5 first:border-t-0 first:pt-0 sm:grid-cols-[2.5rem_minmax(0,1fr)]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-sm font-semibold text-[var(--color-accent-light)]">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-mono text-base font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-zinc-400">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-[#111113] p-6 transition-colors duration-200 hover:border-[rgb(95_98_184/0.3)]">
            <p className="text-sm font-medium tracking-wide text-[var(--color-accent-light)]">
              {content.deliverables.title}
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-300">
              {content.deliverables.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-light)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="rounded-lg border border-white/[0.08] bg-[#111113] px-8 py-10 sm:px-12 sm:py-11">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl text-left">
              <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--color-accent-light)]">
                {content.card.accent}
              </p>
              <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight text-white">
                {content.cta.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                {content.cta.text}
              </p>
            </div>
            <PrimarySecondaryCta
              primaryLabel={content.cta.primary}
              secondaryLabel={content.cta.secondary}
            />
          </div>
        </section>

        {/* ── related services ── */}
        <section className="space-y-6">
          <div className="text-left">
            <p className="text-sm font-medium tracking-wide text-[var(--color-accent-light)]">
              {t("Services.common.relatedServices")}
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {relatedServices.map((relatedService) => {
              const relatedContent = getServiceContent(t, relatedService);

              return (
                <Link
                  key={relatedService.slug}
                  href={`/services/${relatedService.slug}`}
                  className="service-card group block rounded-lg border border-white/[0.08] bg-[#111113] p-6"
                >
                  <div className="h-48">
                    <ServiceVisual visual={relatedService.visual} />
                  </div>
                  <div className="mt-5 border-t border-white/[0.06] pt-5 text-left">
                    <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--color-accent-light)]">
                      {relatedContent.card.eyebrow}
                    </p>
                    <h3 className="mt-3 font-mono text-lg font-semibold text-white">
                      {relatedContent.card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-400">
                      {relatedContent.card.text}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </article>
  );
}
