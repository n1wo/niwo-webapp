import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import TopicArtwork from "@/components/home/TopicArtwork";
import TopicTocNav from "@/components/topics/TopicTocNav";
import {
  topicArticleDefinitions,
  type TopicArticleDefinition,
} from "@/data/topicArticles";
import { Link } from "@/i18n/navigation";

type TFunction = Awaited<ReturnType<typeof getTranslations>>;

type ArticleItem = {
  title: string;
  text: string;
};

type ArticleSource = {
  title: string;
  organization: string;
  href: string;
};

export type TopicArticleContent = {
  metadata: {
    title: string;
    description: string;
  };
  eyebrow: string;
  title: string;
  intro: string[];
  coreIdea: {
    title: string;
    paragraphs: string[];
  };
  howItWorks: {
    title: string;
    intro: string;
    steps: ArticleItem[];
  };
  whereUsed: {
    title: string;
    intro: string;
    items: ArticleItem[];
  };
  benefits?: {
    title: string;
    intro: string;
    items: string[];
  };
  example?: {
    title: string;
    paragraphs: string[];
  };
  risks: {
    title: string;
    intro: string;
    items: ArticleItem[];
  };
  humanResponsibility: {
    title: string;
    paragraphs: string[];
    items: string[];
  };
  takeaways: {
    title: string;
    items: string[];
  };
  sources: ArticleSource[];
};

function asStringArray(raw: unknown, key: string): string[] {
  if (!Array.isArray(raw) || !raw.every((item) => typeof item === "string")) {
    throw new Error(`Expected a string array at ${key}`);
  }

  return raw;
}

function asArticleItems(raw: unknown, key: string): ArticleItem[] {
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
    throw new Error(`Expected article items at ${key}`);
  }

  return raw as ArticleItem[];
}

function asSources(raw: unknown, key: string): ArticleSource[] {
  if (
    !Array.isArray(raw) ||
    !raw.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).title === "string" &&
        typeof (item as Record<string, unknown>).organization === "string" &&
        typeof (item as Record<string, unknown>).href === "string",
    )
  ) {
    throw new Error(`Expected source items at ${key}`);
  }

  return raw as ArticleSource[];
}

export function getTopicArticleContent(
  t: TFunction,
  topic: TopicArticleDefinition,
): TopicArticleContent {
  const prefix = `TopicArticles.items.${topic.key}` as const;

  return {
    metadata: {
      title: t(`${prefix}.metadata.title`),
      description: t(`${prefix}.metadata.description`),
    },
    eyebrow: t(`${prefix}.eyebrow`),
    title: t(`${prefix}.title`),
    intro: asStringArray(t.raw(`${prefix}.intro`), `${prefix}.intro`),
    coreIdea: {
      title: t(`${prefix}.coreIdea.title`),
      paragraphs: asStringArray(
        t.raw(`${prefix}.coreIdea.paragraphs`),
        `${prefix}.coreIdea.paragraphs`,
      ),
    },
    howItWorks: {
      title: t(`${prefix}.howItWorks.title`),
      intro: t(`${prefix}.howItWorks.intro`),
      steps: asArticleItems(
        t.raw(`${prefix}.howItWorks.steps`),
        `${prefix}.howItWorks.steps`,
      ),
    },
    whereUsed: {
      title: t(`${prefix}.whereUsed.title`),
      intro: t(`${prefix}.whereUsed.intro`),
      items: asArticleItems(
        t.raw(`${prefix}.whereUsed.items`),
        `${prefix}.whereUsed.items`,
      ),
    },
    benefits: t.has(`${prefix}.benefits.title`)
      ? {
          title: t(`${prefix}.benefits.title`),
          intro: t(`${prefix}.benefits.intro`),
          items: asStringArray(
            t.raw(`${prefix}.benefits.items`),
            `${prefix}.benefits.items`,
          ),
        }
      : undefined,
    example: t.has(`${prefix}.example.title`)
      ? {
          title: t(`${prefix}.example.title`),
          paragraphs: asStringArray(
            t.raw(`${prefix}.example.paragraphs`),
            `${prefix}.example.paragraphs`,
          ),
        }
      : undefined,
    risks: {
      title: t(`${prefix}.risks.title`),
      intro: t(`${prefix}.risks.intro`),
      items: asArticleItems(t.raw(`${prefix}.risks.items`), `${prefix}.risks.items`),
    },
    humanResponsibility: {
      title: t(`${prefix}.humanResponsibility.title`),
      paragraphs: asStringArray(
        t.raw(`${prefix}.humanResponsibility.paragraphs`),
        `${prefix}.humanResponsibility.paragraphs`,
      ),
      items: asStringArray(
        t.raw(`${prefix}.humanResponsibility.items`),
        `${prefix}.humanResponsibility.items`,
      ),
    },
    takeaways: {
      title: t(`${prefix}.takeaways.title`),
      items: asStringArray(
        t.raw(`${prefix}.takeaways.items`),
        `${prefix}.takeaways.items`,
      ),
    },
    sources: asSources(t.raw(`${prefix}.sources`), `${prefix}.sources`),
  };
}

function SectionHeading({ marker, children }: { marker: string; children: ReactNode }) {
  return (
    <div className="mb-7 grid gap-3 sm:grid-cols-[3rem_minmax(0,1fr)] sm:items-baseline">
      <span
        aria-hidden="true"
        className="font-mono text-[0.7rem] tracking-[0.24em] text-[var(--color-accent-light)]"
      >
        {marker}
      </span>
      <h2 className="font-mono text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {children}
      </h2>
    </div>
  );
}

export default async function TopicArticlePage({
  locale,
  topic,
}: {
  locale: string;
  topic: TopicArticleDefinition;
}) {
  const t = await getTranslations({ locale });
  const content = getTopicArticleContent(t, topic);
  const relatedTopics = topicArticleDefinitions.filter((item) => item.slug !== topic.slug);

  const numberedSections: [string, string][] = [
    ["core-idea", content.coreIdea.title],
    ["how-it-works", content.howItWorks.title],
    ["where-used", content.whereUsed.title],
    ...(content.benefits ? [["benefits", content.benefits.title] as [string, string]] : []),
    ...(content.example ? [["example", content.example.title] as [string, string]] : []),
    ["risks", content.risks.title],
    ["human-responsibility", content.humanResponsibility.title],
    ["takeaways", content.takeaways.title],
  ];
  const markerFor = (id: string) =>
    String(numberedSections.findIndex(([sectionId]) => sectionId === id) + 1).padStart(2, "0");
  const tocEntries: [string, string][] = [
    ...numberedSections,
    ["sources", t("TopicArticles.common.sources")],
  ];

  return (
    <article className="bg-[var(--background)] px-6 pb-28 pt-28 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl 2xl:max-w-[88rem]">
        <Link
          href="/topics"
          className="inline-flex items-center gap-2 rounded-sm font-mono text-xs uppercase tracking-[0.22em] text-zinc-500 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(140_127_224/0.74)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
        >
          <span aria-hidden="true">&larr;</span>
          {t("TopicArticles.common.backToTopics")}
        </Link>

        <header className="mt-10 grid gap-12 border-y border-white/[0.08] py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)] lg:items-center lg:gap-20">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-[var(--color-accent-light)]">
              {content.eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl font-mono text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {content.title}
            </h1>
            <div className="mt-7 max-w-3xl space-y-4">
              {content.intro.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-zinc-300 sm:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="h-64 min-w-0 sm:h-72 lg:h-80">
            <TopicArtwork type={topic.key} />
          </div>
        </header>

        <div className="mt-16 grid gap-14 lg:grid-cols-[13rem_minmax(0,48rem)] lg:justify-center lg:gap-20">
          <aside className="hidden lg:block">
            <nav aria-label={t("TopicArticles.common.onThisPage")} className="sticky top-28">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
                {t("TopicArticles.common.onThisPage")}
              </p>
              <TopicTocNav
                entries={tocEntries.map(([id, label]) => ({ id, label }))}
              />
            </nav>
          </aside>

          <div className="min-w-0">
            <section id="core-idea" className="scroll-mt-28">
              <SectionHeading marker={markerFor("core-idea")}>{content.coreIdea.title}</SectionHeading>
              <div className="space-y-5 sm:pl-12">
                {content.coreIdea.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-[1.02rem] leading-[1.9] text-zinc-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            <section id="how-it-works" className="mt-20 scroll-mt-28 border-t border-white/[0.08] pt-16">
              <SectionHeading marker={markerFor("how-it-works")}>{content.howItWorks.title}</SectionHeading>
              <p className="max-w-3xl text-[1.02rem] leading-[1.9] text-zinc-400 sm:pl-12">
                {content.howItWorks.intro}
              </p>
              <ol className="relative mt-10 space-y-0 sm:ml-12">
                {content.howItWorks.steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="relative grid gap-4 border-l border-white/[0.1] pb-10 pl-8 last:border-transparent last:pb-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-7"
                  >
                    <span className="absolute -left-[0.35rem] top-1 h-2.5 w-2.5 rounded-full border border-[var(--color-accent-light)] bg-[var(--background)] shadow-[0_0_16px_rgb(140_127_224/0.3)]" />
                    <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent-light)]">
                      {String(index + 1).padStart(2, "0")} · {step.title}
                    </h3>
                    <p className="text-[0.98rem] leading-8 text-zinc-400">{step.text}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section id="where-used" className="mt-20 scroll-mt-28 border-t border-white/[0.08] pt-16">
              <SectionHeading marker={markerFor("where-used")}>{content.whereUsed.title}</SectionHeading>
              <p className="max-w-3xl text-[1.02rem] leading-[1.9] text-zinc-400 sm:pl-12">
                {content.whereUsed.intro}
              </p>
              <div className="mt-9 divide-y divide-white/[0.08] border-y border-white/[0.08] sm:ml-12">
                {content.whereUsed.items.map((item) => (
                  <div key={item.title} className="grid gap-3 py-6 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8">
                    <h3 className="font-mono text-sm font-semibold text-zinc-100">{item.title}</h3>
                    <p className="text-[0.96rem] leading-8 text-zinc-400">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {content.benefits ? (
              <section id="benefits" className="mt-20 scroll-mt-28 border-t border-white/[0.08] pt-16">
                <SectionHeading marker={markerFor("benefits")}>{content.benefits.title}</SectionHeading>
                <p className="max-w-3xl text-[1.02rem] leading-[1.9] text-zinc-400 sm:pl-12">
                  {content.benefits.intro}
                </p>
                <ul className="mt-8 grid gap-x-10 gap-y-5 sm:ml-12 sm:grid-cols-2">
                  {content.benefits.items.map((item) => (
                    <li key={item} className="flex gap-4 border-t border-white/[0.08] pt-5 text-[0.96rem] leading-8 text-zinc-300">
                      <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 bg-[var(--color-accent-light)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {content.example ? (
              <section id="example" className="mt-20 scroll-mt-28 border-t border-white/[0.08] pt-16">
                <SectionHeading marker={markerFor("example")}>{content.example.title}</SectionHeading>
                <div className="space-y-5 border-l-2 border-white/[0.14] pl-6 sm:ml-12 sm:pl-8">
                  {content.example.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-[1.02rem] leading-[1.9] text-zinc-300">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ) : null}

            <section id="risks" className="mt-20 scroll-mt-28 border-t border-white/[0.08] pt-16">
              <SectionHeading marker={markerFor("risks")}>{content.risks.title}</SectionHeading>
              <div className="border-l-2 border-[rgb(140_127_224/0.38)] pl-6 sm:ml-12 sm:pl-8">
                <p className="text-[1.02rem] leading-[1.9] text-zinc-300">{content.risks.intro}</p>
                <div className="mt-8 space-y-8">
                  {content.risks.items.map((item) => (
                    <div key={item.title}>
                      <h3 className="font-mono text-base font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-[0.96rem] leading-8 text-zinc-400">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="human-responsibility" className="mt-20 scroll-mt-28 border-t border-white/[0.08] pt-16">
              <SectionHeading marker={markerFor("human-responsibility")}>{content.humanResponsibility.title}</SectionHeading>
              <div className="space-y-5 sm:pl-12">
                {content.humanResponsibility.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-[1.02rem] leading-[1.9] text-zinc-300">
                    {paragraph}
                  </p>
                ))}
                <ul className="mt-8 grid gap-x-10 gap-y-4 border-t border-white/[0.08] pt-7 sm:grid-cols-2">
                  {content.humanResponsibility.items.map((item) => (
                    <li key={item} className="font-mono text-sm leading-7 text-zinc-400">
                      <span aria-hidden="true" className="mr-2 text-[var(--color-accent-light)]">&rarr;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="takeaways" className="mt-20 scroll-mt-28 border-y border-white/[0.08] py-14">
              <SectionHeading marker={markerFor("takeaways")}>{content.takeaways.title}</SectionHeading>
              <ul className="space-y-4 sm:pl-12">
                {content.takeaways.items.map((item, index) => (
                  <li key={item} className="grid gap-3 sm:grid-cols-[2rem_minmax(0,1fr)]">
                    <span className="font-mono text-xs text-[var(--color-accent-light)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[1rem] leading-8 text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="sources" className="mt-16 scroll-mt-28">
              <h2 className="font-mono text-lg font-semibold text-white">
                {t("TopicArticles.common.sources")}
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-500">
                {t("TopicArticles.common.sourceNote")}
              </p>
              <ul className="mt-6 divide-y divide-white/[0.06] border-y border-white/[0.06]">
                {content.sources.map((source) => (
                  <li key={source.href} className="py-4">
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex max-w-full items-start gap-3 rounded-sm text-sm leading-7 text-zinc-300 transition-colors hover:text-[var(--color-accent-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(140_127_224/0.74)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
                    >
                      <span aria-hidden="true" className="mt-0.5 text-[var(--color-accent-light)]">&nearr;</span>
                      <span>
                        <span className="block">{source.title}</span>
                        <span className="block text-xs text-zinc-600">{source.organization}</span>
                        <span className="sr-only">
                          ({t("TopicArticles.common.opensInNewTab")})
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <footer className="mt-20 border-t border-white/[0.08] pt-10">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
            {t("TopicArticles.common.continueReading")}
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {relatedTopics.map((related) => (
              <Link
                key={related.slug}
                href={`/topics/${related.slug}`}
                className="group flex items-center justify-between gap-5 border-b border-white/[0.08] py-4 font-mono text-sm text-zinc-300 transition-colors hover:border-[rgb(140_127_224/0.4)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(140_127_224/0.74)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
              >
                <span>{t(`TopicArticles.items.${related.key}.title`)}</span>
                <span aria-hidden="true" className="text-[var(--color-accent-light)] transition-transform group-hover:translate-x-1">&rarr;</span>
              </Link>
            ))}
          </div>
        </footer>
      </div>
    </article>
  );
}
