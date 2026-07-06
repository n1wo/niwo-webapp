import type { JSX } from "react";
import Image from "next/image";
import type { ServiceVisualType } from "@/data/services";

const serviceVisuals: Record<
  ServiceVisualType,
  {
    src: string;
    alt: string;
    imageClassName: string;
  }
> = {
  windows: {
    src: "/assets/graphics/topics/web-app-security.png",
    alt: "Dark web application security illustration with browser windows and security checks",
    imageClassName: "scale-[1.04] object-center group-hover:scale-[1.06]",
  },
  workflow: {
    src: "/assets/graphics/topics/secure-development.png",
    alt: "Dark secure development illustration with code review and shield check",
    imageClassName:
      "scale-[1.22] object-center brightness-[0.72] saturate-[0.82] opacity-[0.82] group-hover:scale-[1.24] group-hover:opacity-[0.88]",
  },
  pulse: {
    src: "/assets/graphics/topics/pentest-preparation.png",
    alt: "Dark pentest preparation radar scope illustration",
    imageClassName: "scale-[1.04] object-center group-hover:scale-[1.06]",
  },
};

export default function ServiceVisual({
  visual,
}: {
  visual: ServiceVisualType;
}): JSX.Element {
  const asset = serviceVisuals[visual];

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <Image
        src={asset.src}
        alt={asset.alt}
        width={720}
        height={360}
        className={`h-full w-full object-cover opacity-95 transition duration-300 group-hover:opacity-100 ${asset.imageClassName}`}
        sizes="(min-width: 768px) 30vw, 100vw"
        priority={false}
        unoptimized
      />
    </div>
  );
}
