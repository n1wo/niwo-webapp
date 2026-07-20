import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { getServiceBySlug, serviceDefinitions } from "@/data/services";
import { topicArticleDefinitions } from "@/data/topicArticles";
import { buildMetadata, SITE_NAME, SITE_URL } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() { return serviceDefinitions.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  const lang = locale === "de" ? "de" : "en";
  const content = service.content[lang];
  return buildMetadata({ locale, title: `${content.title} | niwo`, description: content.description, path: `/services/${slug}`, socialImageAlt: content.title });
}

function ListSection({ id, title, items }: { id: string; title: string; items: string[] }) {
  return <section id={id} className="scroll-mt-28 border-t border-white/[0.08] pt-10"><h2 className="font-mono text-2xl font-semibold text-white">{title}</h2><ul className="mt-6 space-y-3">{items.map((item) => <li key={item} className="flex gap-3 leading-7 text-zinc-300"><span aria-hidden="true" className="text-[var(--color-accent-light)]">&rarr;</span><span>{item}</span></li>)}</ul></section>;
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  const lang = locale === "de" ? "de" : "en";
  const c = service.content[lang];
  const labels = lang === "de" ? { home: "Start", services: "Leistungen", audience: "Für wen", situations: "Typische Situationen", included: "Enthalten", excluded: "Nicht enthalten", process: "Ablauf", deliverables: "Mögliche Ergebnisse", prerequisites: "Voraussetzungen", availability: "Verfügbarkeit", topics: "Verwandte Themen", contact: "Nächster Schritt" } : { home: "Home", services: "Services", audience: "Who it is for", situations: "Typical situations", included: "What is included", excluded: "What is not included", process: "How it works", deliverables: "Likely deliverables", prerequisites: "Prerequisites", availability: "Availability", topics: "Related educational topics", contact: "Next step" };
  const pageUrl = `${SITE_URL}/${locale}/services/${slug}`;
  const serviceJsonLd = { "@context": "https://schema.org", "@type": "Service", name: c.title, description: c.description, url: pageUrl, provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL }, areaServed: "Remote", availableChannel: { "@type": "ServiceChannel", serviceUrl: pageUrl, availableLanguage: ["English", "German"] } };
  return <article className="bg-[var(--background)] px-6 pb-28 pt-28 text-foreground sm:px-10 lg:px-16">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
    <div className="mx-auto max-w-5xl">
      <Breadcrumbs locale={locale} items={[{ label: labels.home, href: "" }, { label: labels.services, href: "/services" }, { label: c.shortTitle, href: `/services/${slug}` }]} />
      <header className="mt-10 min-w-0 border-y border-white/[0.08] py-12 sm:py-16"><p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-accent-light)]">{c.eyebrow}</p><h1 className="mt-5 max-w-4xl break-words [overflow-wrap:anywhere] font-mono text-4xl font-bold leading-tight text-white sm:text-5xl">{c.title}</h1><p className="mt-7 max-w-4xl text-lg leading-9 text-zinc-200">{c.directAnswer}</p></header>
      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <ListSection id="audience" title={labels.audience} items={c.audience} /><ListSection id="situations" title={labels.situations} items={c.situations} /><ListSection id="included" title={labels.included} items={c.included} /><ListSection id="limits" title={labels.excluded} items={c.excluded} /><ListSection id="process" title={labels.process} items={c.process} /><ListSection id="deliverables" title={labels.deliverables} items={c.deliverables} /><ListSection id="prerequisites" title={labels.prerequisites} items={c.prerequisites} />
        <section className="border-t border-white/[0.08] pt-10"><h2 className="font-mono text-2xl font-semibold text-white">{labels.availability}</h2><p className="mt-6 leading-8 text-zinc-300">{c.availability}</p></section>
      </div>
      <section className="mt-14 border-y border-white/[0.08] py-10"><h2 className="font-mono text-2xl font-semibold text-white">{labels.topics}</h2><div className="mt-5 flex flex-wrap gap-4">{service.topicSlugs.map((topicSlug) => { const topic = topicArticleDefinitions.find((item) => item.slug === topicSlug); return topic ? <Link key={topicSlug} href={`/topics/${topicSlug}`} className="font-mono text-sm text-[var(--color-accent-light)] hover:text-white">{topicSlug.replaceAll("-", " ")} &rarr;</Link> : null; })}</div></section>
      <section className="mt-14 rounded-lg border border-[rgb(140_127_224/0.35)] bg-[var(--color-surface)] p-8"><h2 className="font-mono text-2xl font-semibold text-white">{labels.contact}</h2><p className="mt-4 text-zinc-300">{c.nextAction}</p><a href={`mailto:info@niwosystems.com?subject=${encodeURIComponent(c.title)}`} className="mt-6 inline-flex rounded-lg bg-[var(--color-accent)] px-5 py-3 font-mono text-sm font-semibold text-white hover:bg-[var(--color-accent-light)]">{c.nextAction}</a></section>
    </div>
  </article>;
}
