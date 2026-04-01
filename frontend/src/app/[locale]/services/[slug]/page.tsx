import type { Metadata } from "next";
import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
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
      items: t.raw(`${prefix}.covers.items`) as string[],
    },
    process: {
      title: t(`${prefix}.process.title`),
      steps: t.raw(`${prefix}.process.steps`) as { title: string; text: string }[],
    },
    bestFor: {
      title: t(`${prefix}.bestFor.title`),
      items: t.raw(`${prefix}.bestFor.items`) as string[],
    },
    deliverables: {
      title: t(`${prefix}.deliverables.title`),
      items: t.raw(`${prefix}.deliverables.items`) as string[],
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
    <article className="px-6 pt-24 pb-28 font-ibm sm:px-12 md:px-20">
      <div className="mx-auto max-w-6xl space-y-12 sm:space-y-14">
        <div className="flex justify-start">
          <Link
            href="/#what-i-do"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-zinc-500 transition-colors duration-200 hover:text-zinc-200"
          >
            <span aria-hidden="true">←</span>
            <span>{t("Services.common.backToServices")}</span>
          </Link>
        </div>

        <section className="rounded-xl border border-white/8 bg-black/30 px-6 py-8 shadow-[0_24px_90px_rgba(0,0,0,0.36)] backdrop-blur-[3px] sm:px-8 sm:py-10 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-center">
            <div className="space-y-6 text-left">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-400">
                {content.hero.eyebrow}
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                {content.hero.title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
                {content.hero.intro}
              </p>
              <div className="max-w-xl rounded-lg border border-white/8 bg-white/[0.03] px-5 py-4">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
                  {content.hero.outcomeLabel}
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-300">{content.hero.outcomeText}</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/8 bg-black/35 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.3)]">
              <div className="h-52">
                <ServiceVisual visual={service.visual} />
              </div>
              <div className="mt-6 border-t border-white/8 pt-4">
                <p className="text-[0.7rem] uppercase tracking-[0.24em] text-zinc-500">
                  {content.card.eyebrow}
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{content.card.text}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-white/8 bg-black/25 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-[3px]">
            <h2 className="text-xl font-semibold text-white">{content.covers.title}</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-300">
              {content.covers.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-white/8 bg-black/25 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-[3px]">
            <h2 className="text-xl font-semibold text-white">{content.bestFor.title}</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-300">
              {content.bestFor.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-xl border border-white/8 bg-black/25 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-[3px]">
            <h2 className="text-xl font-semibold text-white">{content.process.title}</h2>
            <div className="mt-6 space-y-5">
              {content.process.steps.map((step, index) => (
                <div
                  key={step.title}
                  className="grid gap-4 border-t border-white/6 pt-5 first:border-t-0 first:pt-0 sm:grid-cols-[2.5rem_minmax(0,1fr)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-sm text-zinc-300">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-zinc-400">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/8 bg-black/25 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-[3px]">
            <h2 className="text-xl font-semibold text-white">{content.deliverables.title}</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-300">
              {content.deliverables.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-xl border border-white/8 bg-black/30 px-6 py-8 shadow-[0_24px_90px_rgba(0,0,0,0.34)] backdrop-blur-[3px] sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl text-left">
              <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                {content.card.accent}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{content.cta.title}</h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                {content.cta.text}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <NextLink
                href="mailto:info@niwosystems.com"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/16 bg-white px-4 py-2.5 text-sm font-medium text-black shadow-[0_10px_30px_rgba(255,255,255,0.06)] transition-colors duration-200 hover:bg-zinc-200"
              >
                {content.cta.primary}
              </NextLink>
              <Link
                href="/#what-i-do"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-zinc-100 transition-colors duration-200 hover:border-white/16 hover:bg-white/[0.05]"
              >
                {content.cta.secondary}
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-left">
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
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
                  className="group rounded-xl border border-white/8 bg-black/25 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.24)] transition-colors duration-200 hover:border-white/16 hover:bg-black/32"
                >
                  <div className="h-48">
                    <ServiceVisual visual={relatedService.visual} />
                  </div>
                  <div className="mt-5 text-left">
                    <p className="text-[0.7rem] uppercase tracking-[0.24em] text-zinc-500">
                      {relatedContent.card.eyebrow}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold text-white">
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
