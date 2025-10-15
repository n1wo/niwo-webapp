import Link from "next/link";
import BottomBorderAnimation from "../animations/BottomBorderAnimation";
import { ReactNode } from "react";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
}

/**
 * 🔗 Link Component
 *
 * A reusable animated link component that wraps Next.js's `Link` element.
 * It displays its child text or element with a subtle bottom border animation on hover.
 */

const LinkAnimation: React.FC<LinkProps> = ({ href, children }) => {
  return (
    <Link className="relative flex h-fit w-fit" href={href}>
      <p>{children}</p>
      <BottomBorderAnimation />
    </Link>
  );
};

export default LinkAnimation;
