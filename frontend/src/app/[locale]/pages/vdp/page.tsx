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
  const t = await getTranslations({ locale, namespace: "Vdp.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getLocalizedAlternates("/pages/vdp"),
  };
}

export default async function VdpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Vdp" });
  const common = await getTranslations({ locale, namespace: "Common" });
  const guidelineItems = t.raw("sections.guidelines.items") as string[];
  const reportingItems = t.raw("sections.reporting.items") as string[];
  const sections = [
    { id: "overview", title: t("sections.overview.title") },
    { id: "scope", title: t("sections.scope.title") },
    { id: "guidelines", title: t("sections.guidelines.title") },
    { id: "reporting", title: t("sections.reporting.title") },
    { id: "acknowledgement", title: t("sections.acknowledgement.title") },
  ];

  return (
    <LegalPageLayout
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      navLabel={common("onThisPage")}
      sections={sections}
    >
      <section id="overview" className="rounded-lg border border-white/10 bg-white/5/0 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.overview.title")}</h2>
        <p>{t("sections.overview.body")}</p>
      </section>

      <section id="scope" className="mt-8 rounded-lg border border-white/10 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.scope.title")}</h2>
        <p>{t("sections.scope.body")}</p>
      </section>

      <section id="guidelines" className="mt-8 rounded-lg border border-white/10 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.guidelines.title")}</h2>
        <ul>
          {guidelineItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="reporting" className="mt-8 rounded-lg border border-white/10 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.reporting.title")}</h2>
        <p>{t("sections.reporting.body")}</p>
        <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/80">
          {t("sections.reporting.calloutTitle")}
          <ul className="mt-3">
            {reportingItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="acknowledgement"
        className="mt-8 rounded-lg border border-white/10 p-6"
      >
        <h2 className="pb-1 text-2xl">{t("sections.acknowledgement.title")}</h2>
        <p>{t("sections.acknowledgement.body")}</p>
      </section>
    </LegalPageLayout>
  );
}
