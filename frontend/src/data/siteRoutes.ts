import { serviceDefinitions } from "@/data/services";
import { topicArticleDefinitions } from "@/data/topicArticles";
import { publications } from "@/data/publications";

export const staticPublicPaths = [
  "",
  "/pages/about",
  "/pages/whoami",
  "/pages/contact",
  "/pages/phishing-lab",
  "/pages/privacy-policy",
  "/pages/vdp",
  "/pages/imprint",
  "/topics",
  "/services",
] as const;

/**
 * ISO date for routes without per-content dates (static pages and services).
 * Update when their copy changes meaningfully.
 */
export const STATIC_CONTENT_UPDATED = "2026-07-20";

export type PublicContentRoute = { path: string; lastModified: string };

export function getPublicContentRoutes(): PublicContentRoute[] {
  return [
    ...staticPublicPaths.map((path) => ({ path: path as string, lastModified: STATIC_CONTENT_UPDATED })),
    ...topicArticleDefinitions.map((topic) => ({ path: `/topics/${topic.slug}`, lastModified: topic.dateModified })),
    ...serviceDefinitions.map((service) => ({ path: `/services/${service.slug}`, lastModified: STATIC_CONTENT_UPDATED })),
    ...publications.map((publication) => ({ path: `/insights/${publication.slug}`, lastModified: publication.updated })),
  ];
}

export function getPublicContentPaths(): string[] {
  return getPublicContentRoutes().map((route) => route.path);
}

export const nonPublicPrefixes = ["/api/", "/admin/", "/_next/", "/private/"];
