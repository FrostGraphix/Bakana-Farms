"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary.
 *
 * Deliberately never renders `error.message`. A raw exception can
 * carry a connection string or a gateway response, and this
 * component is public.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // TODO(observability): forward to Sentry. Vercel Hobby keeps
    // runtime logs for one hour, so an error reported the next
    // morning has no trace left. See roadmap 14.6 M2.
    console.error("route.error", { digest: error.digest });
  }, [error]);

  return (
    <section className="container-page grid min-h-[70dvh] place-items-center py-(--spacing-section-lg)">
      <div className="max-w-[46ch] text-center">
        <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.14em] text-[var(--state-error)]">
          Something broke
        </p>
        <h1 className="mt-5 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold leading-[1.15] text-[var(--text-primary)]">
          We could not load this page.
        </h1>
        <p className="mt-4 text-[length:var(--text-body)] leading-relaxed text-[var(--text-secondary)]">
          The fault is on our side, not yours. Try again, and if it keeps
          happening tell us and we will look into it.
        </p>

        {error.digest ? (
          <p className="mt-6 font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--text-secondary)]">
            Reference {error.digest}
          </p>
        ) : null}

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset}>Try again</Button>
          <Button variant="secondary" asChild>
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
