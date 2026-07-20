import { Link } from "@/i18n/navigation";
import { SITE_URL } from "@/i18n/metadata";

export type BreadcrumbItem = { label: string; href: string };

export default function Breadcrumbs({
  locale,
  items,
}: {
  locale: string;
  items: BreadcrumbItem[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}/${locale}${item.href}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label={locale === "de" ? "Brotkrumen" : "Breadcrumb"}>
        <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-zinc-500">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {index === items.length - 1 ? (
                <span aria-current="page" className="text-zinc-300">{item.label}</span>
              ) : (
                <Link href={item.href} className="transition-colors hover:text-white">{item.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

