import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { getLegalDocGroups } from "@/data/legalDocs";
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
  const footer = await getTranslations({ locale, namespace: "Footer" });
  const guidelineItems = t.raw("sections.guidelines.items") as string[];
  const reportingItems = t.raw("sections.reporting.items") as string[];
  const docGroups = getLegalDocGroups(common, footer);
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
      path="/pages/vdp"
      description={t("description")}
      docsNavLabel={common("browseDocs")}
      docGroups={docGroups}
      navLabel={common("onThisPage")}
      sections={sections}
    >
      <section id="overview" className="scroll-mt-28">
        <h2>{t("sections.overview.title")}</h2>
        <p>{t("sections.overview.body")}</p>
      </section>

      <section id="scope" className="scroll-mt-28">
        <h2>{t("sections.scope.title")}</h2>
        <p>{t("sections.scope.body")}</p>
      </section>

      <section id="guidelines" className="scroll-mt-28">
        <h2>{t("sections.guidelines.title")}</h2>
        <ul>
          {guidelineItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="reporting" className="scroll-mt-28">
        <h2>{t("sections.reporting.title")}</h2>
        <p>{t("sections.reporting.body")}</p>
        <div className="not-prose my-5 border-l-2 border-[rgb(95_98_184/0.35)] pl-5 py-1">
          <p className="mb-3 text-[0.94rem] font-semibold leading-[1.85] text-zinc-100">
            {t("sections.reporting.calloutTitle")}
          </p>
          <ul className="space-y-1.5 text-[0.94rem] leading-[1.85] text-zinc-300">
            {reportingItems.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
                {item}
              </li>
            ))}
          </u