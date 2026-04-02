import NextLink from "next/link";
import { ReactNode } from "react";
import { Link as IntlLink } from "@/i18n/navigation";
import BottomBorderAnimation from "../animations/BottomBorderAnimation";

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
  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("#");

  const content = (
    <>
      <p>{children}</p>
      <BottomBorderAnimation />
    </>
  );

  if (isExternal) {
    return (
      <NextLink className="relative flex h-fit w-fit font-mono" href={href}>
        {content}
      </NextLink>
    );
  }

  return (
    <IntlLink className="relative flex h-fit w-fit font-mono" href={href}>
      {content}
    </IntlLink>
  );
};

export default LinkAnimation;
