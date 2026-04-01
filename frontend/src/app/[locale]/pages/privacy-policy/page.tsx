import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { getLocalizedAlternates } from "@/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivacyPolicy.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getLocalizedAlternates("/pages/privacy-policy"),
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivacyPolicy" });
  const common = await getTranslations({ locale, namespace: "Common" });
  const voluntaryItems = t.raw("sections.dataWeCollect.voluntaryItems") as string[];
  const rightsItems = t.raw("sections.rights.items") as string[];
  const sections = [
    { id: "intro", title: t("sections.intro.navTitle") },
    { id: "controller", title: t("sections.controller.navTitle") },
    { id: "data-we-collect", title: t("sections.dataWeCollect.navTitle") },
    { id: "purpose-legal-basis", title: t("sections.purposeLegalBasis.navTitle") },
    { id: "storage-retention", title: t("sections.storageRetention.navTitle") },
    { id: "third-parties", title: t("sections.thirdParties.navTitle") },
    { id: "sharing", title: t("sections.sharing.navTitle") },
    { id: "rights", title: t("sections.rights.navTitle") },
    { id: "security", title: t("sections.security.navTitle") },
    { id: "cookies", title: t("sections.cookies.navTitle") },
    { id: "changes", title: t("sections.changes.navTitle") },
    { id: "contact", title: t("sections.contact.navTitle") },
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
      <section id="intro" className="rounded-lg border border-white/10 bg-white/5/0 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.intro.title")}</h2>
        <p>{t("sections.intro.body")}</p>
      </section>

      <section id="controller" className="mt-8 rounded-lg border border-white/10 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.controller.title")}</h2>
        <p>
          <strong>{t("sections.controller.controllerLabel")}</strong>{" "}
          {t("sections.controller.controllerValue")}
          <br />
          <strong>{t("sections.controller.emailLabel")}</strong>{" "}
          <Link href="mailto:legal@niwosystems.com">legal@niwosystems.com</Link>
          <br />
          <strong>{t("sections.controller.addressLabel")}</strong>{" "}
          {t("sections.controller.addressValue")}
        </p>
        <p>{t("sections.controller.body")}</p>
      </section>

      <section id="data-we-collect" className="mt-8 rounded-lg border border-white/10 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.dataWeCollect.title")}</h2>
        <h3>{t("sections.dataWeCollect.voluntaryTitle")}</h3>
        <p>{t("sections.dataWeCollect.voluntaryIntro")}</p>
        <ul>
          {voluntaryItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{t("sections.dataWeCollect.voluntaryOutro")}</p>

        <h3>{t("sections.dataWeCollect.automaticTitle")}</h3>
        <p>{t("sections.dataWeCollect.automaticBody")}</p>
      </section>

      <section id="purpose-legal-basis" className="mt-8 rounded-lg border border-white/10 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.purposeLegalBasis.title")}</h2>
        <p>{t("sections.purposeLegalBasis.body")}</p>
      </section>

      <section id="storage-retention" className="mt-8 rounded-lg border border-white/10 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.storageRetention.title")}</h2>
        <p>{t("sections.storageRetention.body")}</p>
      </section>

      <section id="third-parties" className="mt-8 rounded-lg border border-white/10 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.thirdParties.title")}</h2>
        <h3>{t("sections.thirdParties.hostingTitle")}</h3>
        <p>{t("sections.thirdParties.hostingBody")}</p>
        <h3>{t("sections.thirdParties.fontsTitle")}</h3>
        <p>{t("sections.thirdParties.fontsBody")}</p>
      </section>

      <section id="sharing" className="mt-8 rounded-lg border border-white/10 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.sharing.title")}</h2>
        <p>{t("sections.sharing.body")}</p>
      </section>

      <section id="rights" className="mt-8 rounded-lg border border-white/10 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.rights.title")}</h2>
        <p>{t("sections.rights.intro")}</p>
        <ul>
          {rightsItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{t("sections.rights.outro")}</p>
      </section>

      <section id="security" className="mt-8 rounded-lg border border-white/10 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.security.title")}</h2>
        <p>{t("sections.security.body")}</p>
      </section>

      <section id="cookies" className="mt-8 rounded-lg border border-white/10 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.cookies.title")}</h2>
        <p>{t("sections.cookies.body")}</p>
      </section>

      <section id="changes" className="mt-8 rounded-lg border border-white/10 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.changes.title")}</h2>
        <p>{t("sections.changes.body")}</p>
      </section>

      <section id="contact" className="mt-8 rounded-lg border border-white/10 p-6">
        <h2 className="pb-1 text-2xl">{t("sections.contact.title")}</h2>
        <p>{t("sections.contact.body")}</p>
      </section>
    </LegalPageLayout>
  );
}
