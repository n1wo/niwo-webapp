import type { MetadataRoute } from "next";
import { topicArticleDefinitions } from "@/data/topicArticles";
import { SITE_URL } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/pages/about",
    "/pages/phishing-lab",
    "/pages/privacy-policy",
    "/pages/vdp",
    "/pages/imprint",
    "/topics",
    ...topicArticleDefinitions.map((topic) => `/topics/${topic.slug}`),
  ];

  const lastModified = new Date();

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((alt) => [alt, `${SITE_URL}/${alt}${path}`]),
        ),
      },
    })),
  );
}
