"use client";

import Image from "next/image";
import type { MouseEvent } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

type HomeLogoLinkProps = {
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  onNavigate?: () => void;
};

export default function HomeLogoLink({
  className = "flex h-fit w-fit",
  imageClassName = "h-8 w-auto invert",
  width = 220,
  height = 60,
  onNavigate,
}: HomeLogoLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();

    if (pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    event.preventDefault();
    router.push("/");
  };

  return (
    <Link className={className} href="/" onClick={handleClick}>
      <Image
        src="/assets/logos/niwologo.svg"
        width={width}
        height={height}
        alt="niwo systems"
        className={imageClassName}
      />
    </Link>
  );
}
