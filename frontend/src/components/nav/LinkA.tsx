import Link from "next/link";
import BBorderAnimation from "../animations/BBorderAnimation";
import { ReactNode } from "react";

interface LinkProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
  // Custom properties go here
  href: string;
  children: ReactNode;
}

const LinkA: React.FC<LinkProps> = ({ href, children }) => {
  return (
    <Link className="relative flex h-fit w-fit" href={href}>
      <p>{children}</p>
      <BBorderAnimation />
    </Link>
  );
};

export default LinkA;
