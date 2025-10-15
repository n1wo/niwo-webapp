import Link from "next/link";
import React, { ReactNode } from "react";

interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The URL or route to navigate to */
  href: string;
  /** Text or elements displayed inside the button-like link */
  children: ReactNode;
}

/**
 * 🔗 ButtonLink Component
 *
 * A button-styled link component built on Next.js's `Link`.
 * Renders as an accessible `<a>` element styled to look like a button.
 *
 * @example
 * ```tsx
 * <ButtonLink href="/contact">Contact Us</ButtonLink>
 * ```
 */
const ButtonLink: React.FC<ButtonLinkProps> = ({ href, children, ...props }) => {
  return (
    <Link
      href={href}
      {...props}
      className={`inline-flex items-center justify-center rounded-md border 
                  border-content-1 px-4 py-2 text-md font-medium border-zinc-600
                  text-zinc-200 hover:bg-zinc-800
                  transition-colors duration-200
                  bg-content-24/5
                  hover:bg-content-24/10 
                  ${props.className ?? ""}`}
    >
      {children}
    </Link>
  );
};

export default ButtonLink;
