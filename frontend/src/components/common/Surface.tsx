import type { ComponentPropsWithoutRef, ElementType, JSX, ReactNode } from "react";
import styles from "./Surface.module.css";

type SurfaceVariant = "hero" | "panel";

type SurfaceProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  variant?: SurfaceVariant;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export default function Surface<T extends ElementType = "div">({
  as,
  children,
  className = "",
  variant = "panel",
  ...props
}: SurfaceProps<T>): JSX.Element {
  const Component = (as ?? "div") as ElementType;
  const variantClass = variant === "hero" ? styles.hero : styles.panel;
  const classes = [styles.base, variantClass, className].filter(Boolean).join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
