import type { MetadataRoute } from "next";
import { SITE_URL } from "@/i18n/metadata";
import { nonPublicPrefixes } from "@/data/siteRoutes";

// Render-critical assets live under /_next/static/ and /_next/image; blocking
// them degrades how search engines render pages, so they are allowed while the
// rest of /_next/ stays blocked (longest-match rule wins over the disallow).
const publicAllowPaths = ["/", "/_next/static/", "/_next/image"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: ["Googlebot", "Bingbot", "OAI-SearchBot"], allow: publicAllowPaths, disallow: nonPublicPrefixes },
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ChatGPT-User", allow: publicAllowPaths, disallow: nonPublicPrefixes },
      { userAgent: "*", allow: publicAllowPaths, disallow: nonPublicPrefixes },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
