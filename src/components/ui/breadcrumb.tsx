import * as React from "react";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

export interface BreadcrumbItemData {
  label: string;
  href?: string;
}

/**
 * Generates schema.org BreadcrumbList JSON-LD object for SEO.
 */
export function generateBreadcrumbSchema(
  items: BreadcrumbItemData[],
  siteUrl = "https://bakanafarms.com"
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${siteUrl}${item.href}` : undefined,
    })),
  };
}

interface BreadcrumbsProps extends React.ComponentPropsWithoutRef<"nav"> {
  items: BreadcrumbItemData[];
  className?: string;
}

export function Breadcrumbs({ items, className, ...props }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-[length:var(--text-caption)]", className)}
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[var(--text-secondary)]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
              {index > 0 && (
                <CaretRight
                  size={12}
                  className="shrink-0 text-[var(--text-disabled)]"
                  aria-hidden="true"
                />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center min-h-[24px] py-1 transition-colors hover:text-[var(--text-primary)] hover:underline underline-offset-4"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "font-medium",
                    isLast ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
