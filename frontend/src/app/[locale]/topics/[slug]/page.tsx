import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import TopicArticlePage, {
  getTopicArticleContent,
} from "@/components/topics/TopicArticlePage";
import { getTopicArticleBySlug, topicArticleDefinitions } from "@/data/topicArticles";
import { buildMetadata } from "@/i18n/metadata";

export function generateStaticParams() {
  return topicArticleDefinitions.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const topicArticle = getTopicArticleBySlug(slug);

  if (!topicArticle) {
    return {};
  }

  const t = await getTranslations({ locale });
  const content = getTopicArticleContent(t, topicArticle);

  return buildMetadata({
    locale,
    title: content.metadata.title,
    description: content.metadata.description,
    path: `/topics/${slug}`,
  });
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const topicArticle = getTopicArticleBySlug(slug);

  if (!topicArticle) {
    notFound();
  }

  return <TopicArticlePage locale={locale} topic={topicArticle} />;
}
