import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getLocalizedAlternates } from "@/i18n/metadata";
import TrustBoundaryPrototype from "@/components/trust-boundary/TrustBoundaryPrototype";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "TrustBoundaryPrototype.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getLocalizedAlternates("/lab/trust-boundry-prototype"),
  };
}

export default async function TrustBoundryPrototypePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  return <TrustBoundaryPrototype />;
}
