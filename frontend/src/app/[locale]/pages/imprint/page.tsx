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
  const footer = await getTranslations({ locale, namespace: "Footer" });
  const docGroups = getLegalDocGroups(common, footer);
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
      path="/pages/imprint"
      lastUpdated={t("lastUpdated")}
      lastUpdatedLabel={common("lastUpdated")}
      docsNavLabel={common("browseDocs")}
      docGroups={docGroups}
      navLabel={common("onThisPage")}
      sections={sections}
    >
      <section id="provider-identification" className="scroll-mt-28">
        <h2>{t("sections.provider.title")}</h2>
        <p>
          <strong>{t("sections.provider.body")}</strong>
          <br />
          niwo systems
          <br />
          {t("sections.provider.owner")}
          <br />
          Email:{" "}
          <a href="mailto:legal@niwosystems.com">legal@niwosystems.com</a>
          <br />
          {t("sections.provider.address")}
        </p>
      </section>

      <section id="nature-of-website" className="scroll-mt-28">
        <h2>{t("sections.nature.title")}</h2>
        <p>{t("sections.nature.body")}</p>
        <div className="not-prose my-5 border-l-2 border-[rgb(95_98_184/0.35)] pl-5 py-1">
          <p className="text-[0.94rem] leading-[1.85] text-zinc-300">
            <strong className="font-semibold text-zinc-100">{t("sections.nature.disclaimerTitle")}</strong>{" "}
            {t("sections.nature.disclaimerText")}
          </p>
        </div>
      </section>

      <section id="contact" className="scroll-mt-28">
        <h2>{t("sections.contact.title")}</h2>
        <p>{t("sections.contact.body")}</p>
      </section>

      <section id="liability" className="scroll-mt-28">
        <h2>{t("sections.liability.title")}</h2>
        <p>{t("sections.liability.body")}</p>
      </section>
    </LegalPageLayout>
  );
}
