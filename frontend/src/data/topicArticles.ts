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
  },
  {
    key: "secureDevelopment",
    slug: "secure-development",
  },
  {
    key: "pentestPreparation",
    slug: "penetration-testing",
  },
  {
    key: "aiDevSecOps",
    slug: "ai-in-devsecops",
  },
  {
    key: "agenticEngineering",
    slug: "agentic-engineering",
  },
  {
    key: "incidentResponse",
    slug: "incident-response",
  },
];

export function getTopicArticleBySlug(
  slug: string,
): TopicArticleDefinition | undefined {
  return topicArticleDefinitions.find((topic) => topic.slug === slug);
}
