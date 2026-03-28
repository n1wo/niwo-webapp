import type { ReactNode } from "react";

type LegalSectionLink = {
  id: string;
  title: string;
};

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  description?: string;
  lastUpdated?: string;
  sections: LegalSectionLink[];
  children: ReactNode;
};

export default function LegalPageLayout({
  eyebrow,
  title,
  description,
  lastUpdated,
  sections,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 lg:py-16">
      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 sm:p-10">
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-widest text-white/60">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm text-white/60">{description}</p>
          ) : null}
          {lastUpdated ? (
            <p className="mt-2 text-sm text-white/60">Last updated: {lastUpdated}</p>
          ) : null}
        </div>
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-4 xl:col-span-3">
          <nav className="sticky top-20 rounded-lg border border-white/10 p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/60">
              On this page
            </p>
            <ul className="space-y-2 text-sm leading-6 [&_a:hover]:text-white">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    className="block truncate text-white/70 transition"
                    href={`#${section.id}`}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="prose prose-invert prose-headings:font-semibold prose-h3:text-base prose-p:text-[15px] prose-li:marker:text-white/60 lg:col-span-8 xl:col-span-9">
          {children}
        </article>
      </div>
    </main>
  );
}
