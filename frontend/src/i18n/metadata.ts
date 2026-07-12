import type {Metadata} from "next";
import {routing} from "./routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.niwosystems.com";

export const SITE_NAME = "niwo systems";

const SOCIAL_IMAGE_ALT = "niwo - Practical web security for developers and small teams";

const OG_LOCALES: Record<string, string> = {
  en: "en_US",
  de: "de_DE",
};

export function getLocalizedAlternates(pathname = ""): Metadata["alternates"] {
  return {
    languages: Object.fromEntries(
      routing.locales.map((locale) => [locale, `/${locale}${pathname}`]),
    ),
  };
}

type BuildMetadataArgs = {
  locale: string;
  title: string;
  description: string;
  path?: string;
  ogType?: "website" | "article";
};

/**
 * Builds page metadata with canonical/hreflang alternates plus Open Graph and
 * Twitter cards. The Open Graph / Twitter image is supplied automatically by the
 * file-based `app/opengraph-image` (and `twitter-image`) routes.
 */
export function buildMetadata({
  locale,
  title,
  description,
  path = "",
  ogType = "website",
}: BuildMetadataArgs): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      ...getLocalizedAlternates(path),
    },
    openGraph: {
      type: ogType,
      siteName: SITE_NAME,
      title,
      description,
      url: `/${locale}${path}`,
      locale: OG_LOCALES[locale] ?? OG_LOCALES[routing.defaultLocale],
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: SOCIAL_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: "/twitter-image",
          alt: SOCIAL_IMAGE_ALT,
        },
      ],
    },
  };
}
