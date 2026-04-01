"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import type { LegalDocGroup } from "@/data/legalDocs";
import { Link } from "@/i18n/navigation";

type LegalSectionLink = {
  id: string;
  title: string;
};

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  path?: string;
  description?: string;
  lastUpdated?: string;
  lastUpdatedLabel?: string;
  docsNavLabel?: string;
  docGroups: LegalDocGroup[];
  sections: LegalSectionLink[];
  navLabel?: string;
  children: ReactNode;
};

export default function LegalPageLayout({
  eyebrow,
  title,
  path,
  description,
  lastUpdated,
  lastUpdatedLabel = "Last updated",
  docsNavLabel = "Browse docs",
  docGroups,
  sections,
  navLabel = "On this page",
  children,
}: LegalPageLayoutProps) {
  const terminalPath = path ?? `/${title.toLowerCase().replace(/\s+/g, "-")}`;
  const activePath = path ?? terminalPath;
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );

    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean) as HTMLElement[];

    for (const element of elements) {
      observerRef.current.observe(element);
    }

    return () => observerRef.current?.disconnect();
  }, [sections]);

  return (
    <main className="min-h-[75vh] bg-[#0a0a0a] px-6 pb-24 pt-28 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[88rem]">
        <div className="mb-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113] lg:hidden">
          <div className="border-b border-white/[0.06] px-5 py-3 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
            {docsNavLabel}
          </div>
          <div className="space-y-5 px-5 py-5">
            {docGroups.map((group) => (
              <div key={group.title}>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                  {group.title}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const isActive = item.href === activePath;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`inline-flex rounded-full border px-3 py-1.5 text-sm transition-colors duration-150 ${
                          isActive
                            ? "border-[rgb(140_127_224/0.32)] bg-[rgb(95_98_184/0.16)] text-zinc-100"
                            : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:border-white/[0.14] hover:text-zinc-100"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[15rem_minmax(0,1fr)_13rem] lg:gap-12 xl:grid-cols-[16rem_minmax(0,46rem)_14rem]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113]">
              <div className="border-b border-white/[0.06] px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
                {docsNavLabel}
              </div>
              <div className="space-y-6 p-4">
                {docGroups.map((group) => (
                  <div key={group.title}>
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                      {group.title}
                    </p>
                    <ul className="mt-2 space-y-0.5 border-l border-white/[0.08]">
                      {group.items.map((item) => {
                        const isActive = item.href === activePath;

                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              aria-current={isActive ? "page" : undefined}
                              className={`-ml-px block border-l-2 py-1.5 pl-3 text-[0.84rem] leading-snug transition-colors duration-150 ${
                                isActive
                                  ? "border-[var(--color-accent-light)] text-zinc-100"
                                  : "border-transparent text-zinc-500 hover:text-zinc-300"
                              }`}
                            >
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <header className="border-b border-white/[0.08] pb-8">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
                {terminalPath}
              </p>
              <p className="mt-5 font-mono text-[0.72rem] font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]">
                {eyebrow}
              </p>
              <h1 className="mt-3 max-w-3xl font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-5 max-w-3xl text-[0.98rem] leading-8 text-zinc-400">
                  {description}
                </p>
              ) : null}
              {lastUpdated ? (
                <p className="mt-5 font-mono text-[0.72rem] text-zinc-500">
                  {lastUpdatedLabel}: {lastUpdated}
                </p>
              ) : null}
            </header>

            <article
              className="
                mt-10 min-w-0 max-w-[46rem]

                prose prose-invert max-w-none
                prose-headings:font-sans prose-headings:tracking-tight
                prose-h2:mb-4 prose-h2:text-[1.55rem] prose-h2:font-semibold prose-h2:text-white
                prose-h3:mb-2 prose-h3:mt-7 prose-h3:text-[0.98rem] prose-h3:font-semibold prose-h3:text-zinc-200
                prose-p:my-4 prose-p:text-[0.98rem] prose-p:leading-[1.9] prose-p:text-zinc-400
                prose-li:text-[0.98rem] prose-li:leading-[1.9] prose-li:text-zinc-400
                prose-li:marker:text-zinc-600
                prose-ul:my-4 prose-ul:pl-5
                prose-a:text-[var(--color-accent-light)] prose-a:no-underline prose-a:font-normal hover:prose-a:underline
                prose-strong:text-zinc-200 prose-strong:font-semibold

                [&>section+section]:mt-12
                [&>section+section]:border-t
                [&>section+section]:border-white/[0.06]
                [&>section+section]:pt-12
              "
            >
              {children}
            </article>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
                {navLabel}
              </p>
              <ul className="space-y-0.5 border-l border-white/[0.08]">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={`-ml-px block border-l-2 py-1 pl-3 text-[0.8rem] leading-snug transition-colors duration-150 ${
                        activeId === section.id
                          ? "border-[var(--color-accent-light)] text-[var(--color-accent-light)]"
                          : "border-transparent text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
