import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mono flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-semibold uppercase"
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          {index > 0 && (
            <span className="mut opacity-50" aria-hidden="true">
              /
            </span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="mut py-1 underline decoration-dotted underline-offset-2 transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ) : (
            <span className="py-1" style={{ color: "var(--ink)" }} aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
