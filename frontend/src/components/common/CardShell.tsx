import type { ElementType, JSX, ReactNode, ComponentPropsWithoutRef } from "react";
import styles from "./CardShell.module.css";

type CardShellVariant = "default" | "interactive" | "promo" | "promoAccent";

type CardShellProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  variant?: CardShellVariant;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export default function CardShell<T extends ElementType = "div">({
  as,
  children,
  className = "",
  variant = "default",
  ...props
}: CardShellProps<T>): JSX.Element {
  const Component = (as ?? "div") as ElementType;
  const variantClass = {
    default: "",
    interactive: styles.interactive,
    promo: styles.promo,
    promoAccent: `${styles.promo} ${styles.promoAccent}`,
  }[variant];

  const classes = [styles.base, variantClass, className].filter(Boolean).join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
