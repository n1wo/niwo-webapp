export type TopicArticleKey =
  | "aiDevSecOps"
  | "agenticEngineering"
  | "incidentResponse";

export type TopicArticleDefinition = {
  key: TopicArticleKey;
  slug: string;
};

export const topicArticleDefinitions: TopicArticleDefinition[] = [
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
