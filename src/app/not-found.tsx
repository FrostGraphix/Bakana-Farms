import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-page grid min-h-[75vh] place-items-center pt-28 sm:pt-32 pb-20">
      <div className="max-w-[46ch] text-center">
        <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.14em] text-[var(--accent-text)]">
          404
        </p>
        <h1 className="mt-5 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] font-semibold leading-[1.15] text-[var(--text-primary)]">
          This page has not grown here.
        </h1>
        <p className="mt-4 text-[length:var(--text-body)] leading-relaxed text-[var(--text-secondary)]">
          The link may be old, or the page may have moved. The blend and the
          wholesale enquiry are both still where you left them.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/products">Shop the blend</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
