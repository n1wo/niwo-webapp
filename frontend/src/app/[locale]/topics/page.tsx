import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { topicArticleDefinitions } from "@/data/topicArticles";
import { buildMetadata } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "TopicArticles.index" });

  return buildMetadata({
    locale,
    title: t("metadata.title"),
    description: t("metadata.description"),
    path: "/topics",
  });
}

export default async function TopicsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <section
      data-topics-index
      className="bg-[var(--background)] px-6 pb-28 pt-32 text-foreground sm:px-10 sm:pt-36 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <header className="max-w-4xl border-b border-white/[0.08] pb-14 sm:pb-16">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-[var(--color-accent-light)]">
            {t("TopicArticles.index.eyebrow")}
          </p>
          <h1 className="mt-5 font-mono text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("TopicArticles.index.title")}
          </h1>
          <p className="mt-7 max-w-3xl text-base leading-8 text-zinc-300 sm:text-lg">
            {t("TopicArticles.index.intro")}
          </p>
        </header>

        <ol className="divide-y divide-white/[0.08] border-b border-white/[0.08]">
          {topicArticleDefinitions.map((topic, index) => {
            const title = t(`TopicArticles.items.${topic.key}.title`);

            return (
              <li key={topic.slug} data-topic-index={topic.key}>
                <Link
                  href={`/topics/${topic.slug}`}
                  className="group grid gap-6 rounded-sm py-9 transition-colors hover:bg-white/[0.018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(140_127_224/0.74)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)] sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-start sm:gap-8 sm:px-3 sm:py-11"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs tracking-[0.22em] text-[var(--color-accent-light)]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                      {t(`TopicArticles.items.${topic.key}.eyebrow`)}
                    </p>
                    <h2 className="mt-3 font-mono text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      {title}
                    </h2>
                    <p className="mt-4 max-w-3xl text-[0.98rem] leading-8 text-zinc-400">
                      {t(`TopicArticles.items.${topic.key}.metadata.description`)}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 self-center font-mono text-sm text-zinc-300 transition-colors group-hover:text-[var(--color-accent-light)] sm:justify-self-end">
                    {t("TopicArticles.index.readTopic")}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
