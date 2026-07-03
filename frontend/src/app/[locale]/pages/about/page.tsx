import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";

const GITHUB_PROFILE_URL = "https://github.com/n1wo";
const WEBSITE_REPO_URL = "https://github.com/n1wo/niwo-webapp";
const OWASP_LAB_URL = "https://github.com/n1wo/owasp-lab-detection-engine";
const HABIT_TRACKER_URL = "https://github.com/n1wo/habit-tracker";
const GET_IN_IT_PROFILE_URL =
  "https://www.get-in-it.de/profil/plU9FgZHrsbCQuQ1QE4zWX3EPR2Hf9QN";
const CONTACT_MAILTO = "mailto:info@niwosystems.com";

type ProofLink = {
  label: string;
  href: string;
  external: boolean;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About.metadata" });

  return buildMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    path: "/pages/about",
  });
}

function ProofLinkRow({
  links,
  pendingLabel,
}: {
  links: ProofLink[];
  pendingLabel?: string;
}) {
  return (
    <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm">
      {links.map((link) =>
        link.external ? (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent-light)] transition-colors duration-200 hover:text-white"
          >
            → {link.label}
          </a>
        ) : (
          <Link
            key={link.href}
            href={link.href}
            className="text-[var(--color-accent-light)] transition-colors duration-200 hover:text-white"
          >
            → {link.label}
          </Link>
        ),
      )}
      {pendingLabel ? (
        <span className="text-zinc-500">→ {pendingLabel}</span>
      ) : null}
    </p>
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  const introParagraphs = t.raw("intro.paragraphs") as string[];

  const proofCards: {
    key: string;
    title: string;
    text: string;
    links: ProofLink[];
    pending?: boolean;
  }[] = [
    {
      key: "phishing",
      title: t("proof.cards.phishing.title"),
      text: t("proof.cards.phishing.text"),
      links: [
        {
          label: t("proof.cards.phishing.linkLabel"),
          href: "/pages/phishing-lab",
          external: false,
        },
      ],
    },
    {
      key: "owasp",
      title: t("proof.cards.owasp.title"),
      text: t("proof.cards.owasp.text"),
      links: [
        {
          label: t("proof.cards.owasp.linkLabel"),
          href: OWASP_LAB_URL,
          external: true,
        },
      ],
    },
    {
      key: "website",
      title: t("proof.cards.website.title"),
      text: t("proof.cards.website.text"),
      links: [
        {
          label: t("proof.cards.website.linkLabel"),
          href: WEBSITE_REPO_URL,
          external: true,
        },
      ],
    },
    {
      key: "wazuh",
      title: t("proof.cards.wazuh.title"),
      text: t("proof.cards.wazuh.text"),
      links: [],
      pending: true,
    },
    {
      key: "email",
      title: t("proof.cards.email.title"),
      text: t("proof.cards.email.text"),
      links: [],
      pending: true,
    },
    {
      key: "foundations",
      title: t("proof.cards.foundations.title"),
      text: t("proof.cards.foundations.text"),
      links: [
        {
          label: t("proof.cards.foundations.linkLabel"),
          href: HABIT_TRACKER_URL,
          external: true,
        },
      ],
    },
  ];

  const howItems = (["scoped", "documented", "noFear"] as const).map((key) => ({
    key,
    title: t(`how.items.${key}.title`),
    text: t(`how.items.${key}.text`),
  }));

  const ctaButtonPrimary =
    "inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_var(--color-accent-glow)] transition-all duration-200 hover:bg-[var(--color-accent-light)] hover:shadow-[0_0_32px_rgb(140_127_224/0.34)]";
  const ctaButtonSecondary =
    "inline-flex items-center justify-center rounded-lg border border-white/[0.15] bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-zinc-100 backdrop-blur-sm transition-colors duration-200 hover:border-white/[0.25] hover:bg-white/[0.1]";

  return (
    <main className="min-h-[75vh] bg-[#0a0a0a] px-6 pb-24 pt-28 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#111113] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
          <div className="border-b border-white/[0.06] px-5 py-3 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500 sm:px-8">
            /about
          </div>
          <div className="px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
            <p className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]">
              {t("eyebrow")}
            </p>
            <h1 className="mt-4 max-w-3xl break-words hyphens-auto font-mono text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>
            <div className="mt-6 max-w-3xl space-y-5">
              {introParagraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-base leading-8 text-zinc-300 sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="proof-of-work">
          <p className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]">
            {t("proof.eyebrow")}
          </p>
          <h2
            id="proof-of-work"
            className="mt-4 break-words hyphens-auto font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            {t("proof.heading")}
          </h2>
          <div className="mt-8 grid gap-5 md:auto-rows-fr md:grid-cols-2">
            {proofCards.map((card, index) => (
              <article
                key={card.key}
                className="group flex flex-col rounded-2xl border border-white/[0.08] bg-[#111113] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] transition-all duration-200 hover:border-[rgb(95_98_184/0.32)] hover:shadow-[0_0_40px_rgb(95_98_184/0.1)]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[rgb(95_98_184/0.2)] bg-[rgb(95_98_184/0.08)] font-mono text-sm font-semibold text-[var(--color-accent-light)] shadow-[0_0_16px_rgb(95_98_184/0.12)]">
                  0{index + 1}
                </div>
                <h3 className="break-words hyphens-auto font-mono text-lg font-semibold leading-7 text-white sm:text-xl">
                  {card.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-zinc-300 sm:text-[0.95rem]">
                  {card.text}
                </p>
                <ProofLinkRow
                  links={card.links}
                  pendingLabel={
                    card.pending ? t("proof.writeupPending") : undefined
                  }
                />
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="how-i-work"
          className="border-l-2 border-[rgb(95_98_184/0.35)] py-1 pl-6"
        >
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
            {t("how.eyebrow")}
          </p>
          <h2
            id="how-i-work"
            className="mt-3 font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            {t("how.heading")}
          </h2>
          <ul className="mt-6 max-w-3xl space-y-5">
            {howItems.map((item) => (
              <li key={item.key} className="text-sm leading-7 text-zinc-300">
                <span className="font-mono font-semibold text-white">
                  {item.title}
                </span>{" "}
                {item.text}
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="right-now"
          className="rounded-2xl border border-white/[0.08] bg-[#111113] px-8 py-10 sm:px-12 sm:py-11"
        >
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[var(--color-accent-light)]">
            {t("now.eyebrow")}
          </p>
          <h2
            id="right-now"
            className="mt-4 font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            {t("now.heading")}
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-[0.95rem]">
            {t("now.text")}
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                {t("now.recruiters.label")}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 font-mono">
                <a
                  href={GET_IN_IT_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={ctaButtonPrimary}
                >
                  {t("now.recruiters.profileCta")}
                </a>
                <a
                  href={GITHUB_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={ctaButtonSecondary}
                >
                  {t("now.recruiters.githubCta")}
                </a>
              </div>
            </div>
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                {t("now.business.label")}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 font-mono">
                <a href={CONTACT_MAILTO} className={ctaButtonPrimary}>
                  {t("now.business.cta")}
                </a>
                <span className="text-sm text-zinc-400">
                  {t("now.business.text")}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
