import Link from "next/link";
import Image from "next/image";
import LinkA from "./LinkA";

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
          <ul className="flex flex-col gap-2 text-sm w-fit font-bold text-gray-500">
          {/* 
            <li className="hover:text-white">
              <LinkA href="/pages/work">Work</LinkA>
            </li>
            <li className="hover:text-white">
              <LinkA href="/pages/services">Services</LinkA>
            </li>
            <li className="hover:text-white">
              <LinkA href="/pages/about">About</LinkA>
            </li>
          */}
            
            <li className="hover:text-white">
              <LinkA href="/pages/contact">Contact</LinkA>
            </li>
          </ul>
          
          <ul className="flex flex-col gap-2 text-sm w-fit font-bold text-gray-500">
            {/*
            <li className="hover:text-white">
              <LinkA href="/pages/terms">Terms</LinkA>
            </li>
            */}
            <li className="hover:text-white">
              <LinkA href="/pages/privacy-policy">Privacy policy</LinkA>
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
