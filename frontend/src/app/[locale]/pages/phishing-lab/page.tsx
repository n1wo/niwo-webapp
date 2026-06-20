import type { Metadata } from "next";
import { buildMetadata } from "@/i18n/metadata";
import PhishingLab from "@/components/phishing-lab/PhishingLab";

const meta = {
  en: {
    title: "Phishing Defense Lab — niwo systems",
    description:
      "A hands-on inbox simulation. Review eight real-world emails and decide: phishing or legitimate? Train your team to spot the tells before a real attack lands.",
  },
  de: {
    title: "Phishing Defense Lab — niwo systems",
    description:
      "Eine praxisnahe Posteingangs-Simulation. Prüfe acht realistische E-Mails und entscheide: Phishing oder legitim? Trainiere dein Team, die Warnsignale zu erkennen, bevor ein echter Angriff landet.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { title, description } = meta[locale as keyof typeof meta] ?? meta.en;
  return buildMetadata({ locale, title, description, path: "/pages/phishing-lab" });
}

export default function PhishingLabPage() {
  return <PhishingLab />;
}
