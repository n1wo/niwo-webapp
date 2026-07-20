import type { Metadata } from "next";
import { buildMetadata } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";

const copy = {
  en: {
    title: "About NIWO",
    description: "NIWO is a founder-led software, IT, and cybersecurity consulting practice in Bonn, Germany, focused on practical security and responsible technology adoption.",
    eyebrow: "Who NIWO is",
    intro: "NIWO is a founder-led software, IT, and cybersecurity consulting practice based in Bonn, Germany. It supports startups, small and medium-sized businesses, and individuals through carefully scoped reviews, practical guidance, and clear technical explanations.",
    founderTitle: "Founder-led, without agency theatre",
    founder: "Nikita Wokurka founded and operates NIWO. The website uses the NIWO name for the practice while making the operating context explicit: this is not a large agency or a 24/7 security operations centre. Specialist work outside NIWO's scope is referred to suitable qualified professionals.",
    approachTitle: "How the work is approached",
    approach: ["Start with the real decision, system, and constraints.", "Separate observed facts from assumptions and unsupported claims.", "Define authorization, scope, evidence handling, and limits before technical work.", "Explain findings in language that responsible owners can act on."],
    focusTitle: "Current focus",
    focus: "Current work centers on web application security, secure development, Microsoft 365 security configuration, incident-response orientation, and security-first AI adoption. Exact availability and scope are agreed individually.",
    founderLink: "Meet the founder",
    services: "View NIWO services",
    topics: "Read the security topics",
  },
  de: {
    title: "Über NIWO",
    description: "NIWO ist eine inhabergeführte Beratung für Software, IT und Cybersecurity in Bonn mit Fokus auf praktische Sicherheit und verantwortungsvolle Technologieeinführung.",
    eyebrow: "Wer NIWO ist",
    intro: "NIWO ist eine inhabergeführte Beratung für Software, IT und Cybersecurity mit Sitz in Bonn. Sie unterstützt Start-ups, kleine und mittelgroße Unternehmen sowie Privatpersonen mit klar abgegrenzten Reviews, praktischer Orientierung und verständlichen technischen Erklärungen.",
    founderTitle: "Inhabergeführt, ohne Agenturtheater",
    founder: "Nikita Wokurka hat NIWO gegründet und betreibt die Beratung. Die Website nutzt den Namen NIWO für die Praxis und macht den Betriebskontext transparent: NIWO ist keine große Agentur und kein 24/7 Security Operations Center. Aufgaben außerhalb des eigenen Scopes werden an passende qualifizierte Fachstellen verwiesen.",
    approachTitle: "Arbeitsweise",
    approach: ["Mit der tatsächlichen Entscheidung, dem System und den Einschränkungen beginnen.", "Beobachtete Fakten von Annahmen und unbelegten Aussagen trennen.", "Autorisierung, Scope, Umgang mit Nachweisen und Grenzen vor technischer Arbeit klären.", "Befunde so erklären, dass Verantwortliche handeln können."],
    focusTitle: "Aktueller Fokus",
    focus: "Der aktuelle Fokus liegt auf Webanwendungssicherheit, sicherer Entwicklung, Microsoft-365-Sicherheitskonfiguration, Incident-Orientierung und Security-first-Einführung von KI. Verfügbarkeit und Scope werden individuell vereinbart.",
    founderLink: "Den Gründer kennenlernen",
    services: "NIWO Leistungen ansehen",
    topics: "Security-Themen lesen",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const c = copy[locale === "de" ? "de" : "en"];
  return buildMetadata({ locale, title: `${c.title} | niwo`, description: c.description, path: "/pages/about", socialImageAlt: c.title });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const c = copy[locale === "de" ? "de" : "en"];
  return <article className="bg-[var(--background)] px-6 pb-28 pt-32 text-foreground sm:px-10 lg:px-16"><div className="mx-auto max-w-5xl">
    <header className="border-b border-white/[0.08] pb-14"><p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-accent-light)]">{c.eyebrow}</p><h1 className="mt-5 font-mono text-4xl font-bold text-white sm:text-5xl">{c.title}</h1><p className="mt-7 max-w-4xl text-lg leading-9 text-zinc-200">{c.intro}</p></header>
    <div className="mt-14 grid gap-12 md:grid-cols-2"><section><h2 className="font-mono text-2xl font-semibold text-white">{c.founderTitle}</h2><p className="mt-5 leading-8 text-zinc-300">{c.founder}</p><p className="mt-5"><Link href="/pages/whoami" className="font-mono text-sm text-[var(--color-accent-light)] hover:text-white">{c.founderLink} &rarr;</Link></p></section><section><h2 className="font-mono text-2xl font-semibold text-white">{c.approachTitle}</h2><ul className="mt-5 space-y-3">{c.approach.map((item) => <li key={item} className="flex gap-3 leading-7 text-zinc-300"><span aria-hidden="true" className="text-[var(--color-accent-light)]">&rarr;</span>{item}</li>)}</ul></section></div>
    <section className="mt-14 border-y border-white/[0.08] py-12"><h2 className="font-mono text-2xl font-semibold text-white">{c.focusTitle}</h2><p className="mt-5 max-w-4xl leading-8 text-zinc-300">{c.focus}</p><div className="mt-7 flex flex-wrap gap-5"><Link href="/services" className="font-mono text-sm text-[var(--color-accent-light)] hover:text-white">{c.services} &rarr;</Link><Link href="/topics" className="font-mono text-sm text-[var(--color-accent-light)] hover:text-white">{c.topics} &rarr;</Link></div></section>
  </div></article>;
}
