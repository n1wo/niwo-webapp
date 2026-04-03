"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LinkAnimation from "./LinkAnimation";

export default function Footer() {
  const t = useTranslations("Footer");
  const pathname = usePathname();

  if (pathname.includes("/lab/trust-boundry-prototype")) {
    return null;
  }

  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-10 px-6 py-12 pb-16 sm:px-12 md:px-20">
        <div className="flex sm:gap-40 gap-20">
          <ul className="flex flex-col gap-3 text-sm font-medium text-zinc-500">
            <li className="hover:text-white transition-colors">
              <LinkAnimation href="/pages/about">{t("about")}</LinkAnimation>
            </li>
            <li className="hover:text-white transition-colors">
              <LinkAnimation href="https://github.com/n1wo/niwo-webapp">{t("github")}</LinkAnimation>
            </li>
          </ul>

          <ul className="flex flex-col gap-3 text-sm font-medium text-zinc-500">
            <li className="hover:text-white transition-colors">
              <LinkAnimation href="/pages/privacy-policy">{t("privacyPolicy")}</LinkAnimation>
            </li>
            <li className="hover:text-white transition-colors">
              <LinkAnimation href="/pages/vdp">{t("vdp")}</LinkAnimation>
            </li>
            <li className="hover:text-white transition-colors">
              <LinkAnimation href="/pages/imprint">{t("imprint")}</LinkAnimation>
            </li>
          </ul>
        </div>

        <div className="flex w-fit">
          <Link className="flex h-fit w-fit" href="/">
            <Image
              src="/assets/logos/niwologo.svg"
              width={220}
              height={60}
              alt="Niwo Systems"
              className="h-8 w-auto invert"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
