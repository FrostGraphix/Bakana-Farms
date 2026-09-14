import type { Metadata } from "next";
import Link from "next/link";
import { Leaf } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Maintenance", robots: { index: false, follow: false } };

export default function MaintenancePage() {
  return <main className="container-page grid min-h-[70svh] place-items-center py-16 text-center"><div className="max-w-xl"><Leaf className="mx-auto text-[var(--accent-text)]" size={42} weight="light" aria-hidden /><p className="eyebrow mt-6">A brief farm pause</p><h1 className="mt-4 text-[length:var(--text-display-md)]">We are tending things.</h1><p className="mt-5 text-[length:var(--text-body-lg)] text-[var(--text-secondary)]">The store will return shortly. Existing orders remain safe.</p><Button className="mt-8" asChild><Link href="/contact">Contact support</Link></Button></div></main>;
}
