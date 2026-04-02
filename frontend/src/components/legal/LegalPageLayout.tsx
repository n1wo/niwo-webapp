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
                                  : "bo