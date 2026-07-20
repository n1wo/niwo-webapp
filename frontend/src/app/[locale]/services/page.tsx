import type { Metadata } from "next";
import { serviceDefinitions } from "@/data/services";
import { buildMetadata } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";

const copy = {
  en: { title: "Software, IT and cybersecurity services", description: "Focused, founder-led reviews and guidance for startups, SMEs, and individuals: incident orientation, Microsoft 365, web application security, and safe AI adoption.", eyebrow: "NIWO services", intro: "Each service has a defined scope, visible limits, and a practical next step. Educational topics explain the underlying concepts; these pages describe work NIWO can scope with you." },
  de: { title: "Leistungen für Software, IT und Cybersecurity", description: "Fokussierte, inhabergeführte Reviews und Orientierung für Start-ups, KMU und Privatpersonen: Incidents, Microsoft 365, Webanwendungssicherheit und sichere KI-Einführung.", eyebrow: "NIWO Leistungen", intro: "Jede Leistung hat einen klaren Scope, sichtbare Grenzen und einen praktischen nächsten Schritt. Themenartikel erklären die Grundlagen; diese Seiten beschreiben Arbeit, die NIWO mit dir abgrenzen kann." },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const c = copy[locale as keyof typeof copy] ?? copy.en;
  return buildMetadata({ locale, title: `${c.title} | niwo`, description: c.description, path: "/services", socialImageAlt: c.title });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale === "de" ? "de" : "en";
  const c = copy[lang];
  return (
    <section className="bg-[var(--background)] px-6 pb-28 pt-32 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-4xl border-b border-white/[0.08] pb-14">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-accent-light)]">{c.eyebrow}</p>
          <h1 className="mt-5 font-mono text-4xl font-bold leading-tight text-white sm:text-5xl">{c.title}</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-300">{c.intro}</p>
        </header>
        <div className="grid gap-5 pt-12 md:grid-cols-2">
          {serviceDefinitions.map((service) => {
            const item = service.content[lang];
            return <article key={service.slug} className="rounded-lg border border-white/[0.08] bg-[var(--color-surface)] p-7">
              <h2 className="font-mono text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400">{item.description}</p>
              <Link href={`/services/${service.slug}`} className="mt-6 inline-flex font-mono text-sm text-[var(--color-accent-light)] hover:text-white">{lang === "de" ? `${item.shortTitle} ansehen` : `View ${item.shortTitle}`} <span aria-hidden="true" className="ml-2">&rarr;</span></Link>
            </article>;
          })}
        </div>
      </div>
    </section>
  );
}

