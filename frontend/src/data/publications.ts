import type { AppLocale } from "@/i18n/routing";

export const publicationTypes = ["technical-article", "research-summary", "project-write-up", "case-study"] as const;
export type PublicationType = (typeof publicationTypes)[number];

type Reference = { label: string; organization: string; href: string };
type LocalizedPublication = {
  title: string; summary: string; context: string; method: string[]; evidence: string[];
  findings: string[]; limitations: string[]; implications: string[]; references: Reference[];
};
export type Publication = {
  slug: string; type: PublicationType; author: string; published: string; reviewed: string; updated: string;
  relatedServices: string[]; relatedTopics: string[]; sanitized: boolean;
  content: Record<AppLocale, LocalizedPublication>;
};

/**
 * Intentionally empty: /insights stays hidden (404, no sitemap or nav entry)
 * until a publication listed here has actually been written and reviewed by
 * its named author. AI-drafted starting points live in docs/insights-drafts/.
 */
export const publications: Publication[] = [];

export function getPublication(slug: string): Publication | undefined {
  return publications.find((publication) => publication.slug === slug);
}
