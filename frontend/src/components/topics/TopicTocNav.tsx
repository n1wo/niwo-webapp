"use client";

import { useEffect, useRef, useState } from "react";

export type TopicTocEntry = {
  id: string;
  label: string;
};

export default function TopicTocNav({ entries }: { entries: TopicTocEntry[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (observed) => {
        for (const entry of observed) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );

    const elements = entries
      .map((entry) => document.getElementById(entry.id))
      .filter(Boolean) as HTMLElement[];

    for (const element of elements) {
      observerRef.current.observe(element);
    }

    return () => observerRef.current?.disconnect();
  }, [entries]);

  return (
    <ol className="mt-4 space-y-1 border-l border-white/[0.08]">
      {entries.map(({ id, label }) => {
        const isActive = activeId === id;

        return (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={isActive ? "true" : undefined}
              className={`-ml-px block border-l-2 py-1.5 pl-3 text-sm leading-snug transition-colors ${
                isActive
                  ? "border-[var(--color-accent-light)] text-[var(--color-accent-light)]"
                  : "border-transparent text-zinc-500 hover:border-[var(--color-accent-light)] hover:text-zinc-200"
              }`}
            >
              {label}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
