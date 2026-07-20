import type {Metadata} from "next";
import {routing} from "./routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.niwosystems.com";

export const SITE_NAME = "niwo systems";

const SOCIAL_IMAGE_ALT: Record<string, string> = {
  en: "niwo systems — Software, IT and cybersecurity consulting",
  de: "niwo systems — Beratung für Software, IT und Cybersecurity",
};

const OG_LOCALES: Record<string, string> = {
  en: "en_US",
  de: "de_DE",
};

export function getLocalizedAlternates(pathname = ""): Metadata["alternates"] {
  return {
    languages: {
      ...Object.fromEntries(routing.locales.map((locale) => [locale, `/${locale}${pathname}`])),
      "x-default": `/${routing.defaultLocale}${pathname}`,
    },
  };
}

type BuildMetadataArgs = {
  locale: string;
  title: string;
  description: string;
  path?: string;
  ogType?: "website" | "article";
  /** ISO dates; only used when ogType is "article". */
  articleDates?: {
    published: string;
    modified: string;
  };
  socialImageAlt?: string;
};

/**
 * Builds page metadata with canonical/hreflang alternates plus Open Graph and
 * Twitter cards. The Open Graph / Twitter image is supplied automatically by the
 * localized file-based `app/[locale]/opengraph-image` and `twitter-image` routes.
 */
export function buildMetadata({
  locale,
  title,
  description,
  path = "",
  ogType = "website",
  articleDates,
  socialImageAlt,
}: BuildMetadataArgs): Metadata {
  const imageAlt =
    socialImageAlt ??
    SOCIAL_IMAGE_ALT[locale] ??
    SOCIAL_IMAGE_ALT[routing.defaultLocale];
  return {
    title,
    description,
    robots: { index: true, follow: true },
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
      ...(ogType === "article" && articleDates
        ? {
            publishedTime: articleDates.published,
            modifiedTime: articleDates.modified,
          }
        : {}),
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: `/${locale}/twitter-image`,
          alt: imageAlt,
        },
      ],
    },
  };
}
