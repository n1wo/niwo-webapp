"use client";

import { useState } from "react";
import Link from "next/link";
import LinkAnimation from "./LinkAnimation";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header>
      <nav>
        <div className="fixed top-0 z-50 w-full grid grid-cols-2 sm:grid-cols-3 justify-items-stretch px-8 h-16 backdrop-blur-sm dark:bg-bkg-1/60 bg-bkg-1/80 font-ibm">
          {/* Links */}
          
          <ul className="hidden sm:flex my-auto w-fit h-fit gap-4">
            {/* 
            <li>
              <LinkA href="/pages/services">Services</LinkA>
            </li>
             */}
            <li>
              <LinkAnimation href="/pages/about">About</LinkAnimation>
            </li>
           
          </ul>
          

          {/* Logo */}
          <Link className="sm:flex my-auto sm:mx-auto h-fit w-fit" href="/">
            <Image
              src="/assets/logos/niwologo.svg"
              width="110"
              height="110"
              className="dark:invert"
              alt="Logo"
            />
          </Link>
          {/* Contacts */}
          <div className="flex items-center justify-self-end w-fit">
            <div className="hidden sm:flex">
              <LinkAnimation href="/pages/contact">Contact</LinkAnimation>
            </div>
            {/* Mobile Menu Button with Animation */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="relative sm:hidden flex flex-col justify-center items-center"
              aria-expanded={isOpen}
            >
              <span
                className={`bg-white block transition-all duration-300 ease-out 
                h-0.5 w-6 rounded-sm ${isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`}
              ></span>
              <span
                className={`bg-white block transition-all duration-300 ease-out 
                h-0.5 w-6 rounded-sm my-0.5 ${isOpen ? "opacity-0" : "opacity-100"}`}
              ></span>
              <span
                className={`bg-white block transition-all duration-300 ease-out 
                h-0.5 w-6 rounded-sm ${isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}`}
              ></span>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isOpen && (
          <div className="fixed sm:hidden z-30 top-16 px-8 my-auto w-full h-fit pb-10 backdrop-blur-sm bg-bkg-1/60">
            <ul className="flex flex-col gap-4 font-ibm pt-4">
              <li>
                <LinkAnimation href="/pages/about">About</LinkAnimation>
              </li>
              <li>
                <LinkAnimation href="/pages/contact">Contact</LinkAnimation>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
