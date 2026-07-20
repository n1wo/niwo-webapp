import type { MetadataRoute } from "next";
import { getPublicContentRoutes } from "@/data/siteRoutes";
import { SITE_URL } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  return getPublicContentRoutes().flatMap(({ path, lastModified }) =>
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
