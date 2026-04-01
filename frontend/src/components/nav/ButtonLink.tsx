import Link from "next/link";
import React, { ReactNode } from "react";

interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ href, children, ...props }) => {
  return (
    <Link
      href={href}
      {...props}
      className={`inline-flex items-center justify-center rounded-lg border
                  px-5 py-2.5 text-sm font-semibold border-zinc-700 bg-transparent
                  text-zinc-300 hover:border-zinc-500 hover:text-white
                  transition-colors duration-200
                  ${props.className ?? ""}`}
    >
      {children}
    </Link>
  );
};

export default ButtonLink;
