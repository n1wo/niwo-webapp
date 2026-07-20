import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import TopicArticlePage, {
  getTopicArticleContent,
} from "@/components/topics/TopicArticlePage";
import { getTopicArticleBySlug, topicArticleDefinitions } from "@/data/topicArticles";
import { buildMetadata, SITE_NAME, SITE_URL } from "@/i18n/metadata";

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
    ogType: "article",
    articleDates: {
      published: topicArticle.datePublished,
      modified: topicArticle.dateModified,
    },
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

  const t = await getTranslations({ locale });
  const content = getTopicArticleContent(t, topicArticle);
  const pageUrl = `${SITE_URL}/${locale}/topics/${slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: content.title,
    description: content.metadata.description,
    inLanguage: locale,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    datePublished: topicArticle.datePublished,
    dateModified: topicArticle.dateModified,
    author: {
      "@type": "Person",
      name: "Nikita Wokurka",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <TopicArticlePage locale={locale} topic={topicArticle} />
    </>
  );
}
