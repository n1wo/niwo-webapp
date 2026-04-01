import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LinkAnimation from "./LinkAnimation";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer>
      {/* Container */}
      <div
        className="flex flex-col justify-between bg-black h-70 px-10
       py-8 pb-12 gap-10 font-ibm z-30"
      >
        {/* Links Coontainer */}
        
        <div className="flex sm:gap-40 gap-20">
          {/* Links List */}
          <ul className="flex flex-col gap-2 text-sm w-fit font-bold text-zinc-500">
          {/* 
            <li className="hover:text-white">
              <LinkA href="/pages/work">Work</LinkA>
            </li>
            <li className="hover:text-white">
              <LinkA href="/pages/services">Services</LinkA>
            </li>
            */}
            <li className="hover:text-white">
              <LinkAnimation href="/pages/about">{t("about")}</LinkAnimation>
            </li>
            <li className="hover:text-white">
              <LinkAnimation href="https://github.com/n1wo/niwo-webapp">{t("github")}</LinkAnimation>
            </li>
          </ul>
          
          <ul className="flex flex-col gap-2 text-sm w-fit font-bold text-zinc-500">
            {/*
            <li className="hover:text-white">
              <LinkA href="/pages/terms">Terms</LinkA>
            </li>
            */}
            <li className="hover:text-white">
              <LinkAnimation href="/pages/privacy-policy">{t("privacyPolicy")}</LinkAnimation>
            </li>
             <li className="hover:text-white">
              <LinkAnimation href="/pages/vdp">{t("vdp")}</LinkAnimation>
            </li>
            <li className="hover:text-white">
              <LinkAnimation href="/pages/imprint">{t("imprint")}</LinkAnimation>
            </li>
            {/*
            <li className="hover:text-white">
              <LinkA href="/pages/cookie-settings">Cookie settings</LinkA>
            </li>
            <li className="hover:text-white">
              <LinkA href="/pages/impressum">Impressum</LinkA>
            </li>
            */}
          </ul>
        </div>
        
        {/* Logo */}
        <div className="flex w-fit">
          <Link className="flex h-fit w-fit" href="/">
            <Image
              src="/assets/logos/niwologo.svg"
              width={220}
              height={60}
              alt="Logo"
              className="h-9 w-auto invert"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
