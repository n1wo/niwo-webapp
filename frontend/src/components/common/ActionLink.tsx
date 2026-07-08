import type { JSX, ReactNode } from "react";
import NextLink from "next/link";
import { Link as IntlLink } from "@/i18n/navigation";
import styles from "./ActionLink.module.css";

type ActionLinkVariant = "primary" | "secondary" | "subtle" | "pill";
type ActionLinkFont = "sans" | "mono";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: ActionLinkVariant;
  font?: ActionLinkFont;
  withArrow?: boolean;
};

export default function ActionLink({
  href,
  children,
  className = "",
  variant = "secondary",
  font = "sans",
  withArrow = false,
}: ActionLinkProps): JSX.Element {
  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("#");

  const variantClass = {
    primary: styles.primary,
    secondary: styles.secondary,
    subtle: styles.subtle,
    pill: styles.pill,
  }[variant];

  const fontClass = font === "mono" ? styles.fontMono : styles.fontSans;
  const sizeClass = variant === "pill" ? "" : styles.sizeMd;
  const classes = [styles.base, styles.focusable, fontClass, sizeClass, variantClass, className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span>{children}</span>
      {withArrow ? <span aria-hidden="true">&rarr;</span> : null}
    </>
  );

  if (isExternal) {
    return (
      <NextLink className={classes} href={href}>
        {content}
      </NextLink>
    );
  }

  return (
    <IntlLink className={classes} href={href}>
      {content}
    </IntlLink>
  );
}
