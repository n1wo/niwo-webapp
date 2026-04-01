import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { getLocalizedAlternates } from "@/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Imprint.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    robots: { index: true, follow: true },
    alternates: getLocalizedAlternates("/pages/imprint"),
  };
}

export default async function ImprintPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Imprint" });
  const common = await getTranslations({ locale, namespace: "Common" });
  const sections = [
    { id: "provider-identification", title: t("sections.provider.title") },
    { id: "nature-of-website", title: t("sections.nature.title") },
    { id: "contact", title: t("sections.contact.title") },
    { id: "liability", title: t("sections.liability.title") },
  ];

  return (
    <LegalPageLayout
      eyebrow={t("eyebrow")}
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      lastUpdatedLabel={common("lastUpdated")}
      navLabel={common("onThisPage")}
      sections={sections}
    >
      <section
        id="provider-identification"
        className="rounded-lg border border-white/10 bg-white/5/0 p-6"
      >
        <h2 className="pb-1 text-2xl">{t("sections.provider.title")}</h2>
        <p>
          <strong>{t("sections.provider.body")}</strong>
          <br />
          niwo systems
          <br />
          {t("sections.provider.owner")}
          <br />
          Email:{" "}
          <a
            href="mailto:legal@niwosystems.com"
            className="text-white underline decoration-white/30 underline-offset-4"
          >
            legal@niwosystems.com
          </a>
          <br />
          {t("sections.provider.address")}
        </p>
      </section>

      <section
        id="nature-of-website"
        className="mt-8 rounded-lg border border-white/10 p-6"
      >
        <h2 className="pb-1 text-2xl">{t("sections.nature.title")}</h2>
        <p>{t("sections.nature.body")}</p>
        <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/80">
          <strong>{t("sections.nature.disclaimerTitle")}</strong>{" "}
          {t("sections.nature.disclaimerText")}
        </div>
      </section>

      <section id="contact" className="mt-8 rounded-lg border border-white/10 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.contact.title")}</h2>
        <p>{t("sections.contact.body")}</p>
      </section>

      <section id="liability" className="mt-8 rounded-lg border border-white/10 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.liability.title")}</h2>
        <p>{t("sections.liability.body")}</p>
      </section>
    </LegalPageLayout>
  );
}
