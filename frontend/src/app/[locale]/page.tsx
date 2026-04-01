import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HomePage from "@/components/home/HomePage";
import { getLocalizedAlternates } from "@/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getLocalizedAlternates(""),
  };
}

export default function LocaleHomePage() {
  return <HomePage />;
}
