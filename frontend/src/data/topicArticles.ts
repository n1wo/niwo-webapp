export type TopicArticleKey =
  | "webAppSecurity"
  | "secureDevelopment"
  | "pentestPreparation"
  | "aiDevSecOps"
  | "agenticEngineering"
  | "incidentResponse";

export type TopicArticleDefinition = {
  key: TopicArticleKey;
  slug: string;
  /** ISO date (YYYY-MM-DD); feeds JSON-LD and og:article meta. */
  datePublished: string;
  /** Bump manually whenever the article content changes. */
  dateModified: string;
};

/*
 * Order matters: it drives the navbar Topics menu, the topics index page,
 * and related-topic footers. Foundations first, then the newer workflows.
 * The pentest slug stays "penetration-testing" so existing links keep working.
 */
export const topicArticleDefinitions: TopicArticleDefinition[] = [
  {
    key: "webAppSecurity",
    slug: "web-app-security",
    datePublished: "2026-07-11",
    dateModified: "2026-07-12",
  },
  {
    key: "secureDevelopment",
    slug: "secure-development",
    datePublished: "2026-07-11",
    dateModified: "2026-07-12",
  },
  {
    key: "pentestPreparation",
    slug: "penetration-testing",
    datePublished: "2026-07-11",
    dateModified: "2026-07-12",
  },
  {
    key: "aiDevSecOps",
    slug: "ai-in-devsecops",
    datePublished: "2026-07-11",
    dateModified: "2026-07-12",
  },
  {
    key: "agenticEngineering",
    slug: "agentic-engineering",
    datePublished: "2026-07-11",
    dateModified: "2026-07-12",
  },
  {
    key: "incidentResponse",
    slug: "incident-response",
    datePublished: "2026-07-11",
    dateModified: "2026-07-12",
  },
];

export function getTopicArticleBySlug(
  slug: string,
): TopicArticleDefinition | undefined {
  return topicArticleDefinitions.find((topic) => topic.slug === slug);
}
