import type { MetadataRoute } from "next";
import { SITE_URL } from "@/i18n/metadata";
import { nonPublicPrefixes } from "@/data/siteRoutes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: ["Googlebot", "Bingbot", "OAI-SearchBot"], allow: "/", disallow: nonPublicPrefixes },
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ChatGPT-User", allow: "/", disallow: nonPublicPrefixes },
      { userAgent: "*", allow: "/", disallow: nonPublicPrefixes },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
