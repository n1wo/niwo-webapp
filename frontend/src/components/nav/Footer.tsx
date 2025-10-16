import Link from "next/link";
import Image from "next/image";
import LinkAnimation from "./LinkAnimation";

export default function Footer() {
  return (
    <footer>
      {/* Container */}
      <div
        className="flex flex-col justify-between bg-black h-80 px-12
       py-6 pb-12 gap-10 font-ibm"
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
              <LinkAnimation href="/pages/about">About</LinkAnimation>
            </li>
            <li className="hover:text-white">
              <LinkAnimation href="https://github.com/n1wo/niwo-webapp">GitHub</LinkAnimation>
            </li>
             <li className="hover:text-white">
              <LinkAnimation href="/pages/contact">Contact</LinkAnimation>
            </li>
          </ul>
          
          <ul className="flex flex-col gap-2 text-sm w-fit font-bold text-zinc-500">
            {/*
            <li className="hover:text-white">
              <LinkA href="/pages/terms">Terms</LinkA>
            </li>
            */}
            <li className="hover:text-white">
              <LinkAnimation href="/pages/privacy-policy">Privacy policy</LinkAnimation>
            </li>
             <li className="hover:text-white">
              <LinkAnimation href="/pages/vdp">VDP</LinkAnimation>
            </li>
            <li className="hover:text-white">
              <LinkAnimation href="/pages/imprint">Imprint</LinkAnimation>
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
          <Link className="flex h-full" href="/">
            <Image
              src="/assets/logos/niwologo.svg"
              width="100"
              height="100"
              alt="Logo"
              className="invert"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
