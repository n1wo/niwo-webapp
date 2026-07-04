import { permanentRedirect } from "@/i18n/navigation";

export default async function LegacyServiceRedirectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  permanentRedirect({
    href: `/topics/${slug}`,
    locale,
  });
}
