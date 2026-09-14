import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Package, Storefront } from "@phosphor-icons/react/dist/ssr";
import { VideoCarousel } from "@/components/sections/video-carousel";
import { Grain } from "@/components/effects/grain";
import { Marquee } from "@/components/effects/marquee";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { CinematicGallery } from "@/components/sections/cinematic-gallery";
import { DualPath } from "@/components/sections/dual-path";
import { UpdatesSection } from "@/components/sections/updates-section";

const PROVENANCE = ["Moringa leaf", "Golden honey", "Warming ginger", "Twenty tea bags", "Forty gram pack", "Made for ritual"];
const MOMENTS = [
  { step: "01", title: "Boil", copy: "Bring fresh water." },
  { step: "02", title: "Steep", copy: "Let flavour unfold." },
  { step: "03", title: "Pause", copy: "Make time yours." },
];

export default function HomePage() {
  return (
    <>
      <Grain />
      <VideoCarousel />
      <section aria-label="Product details" className="border-y border-[color-mix(in_srgb,var(--scene-accent)_25%,transparent)] bg-[var(--scene-bg)] text-[var(--scene-text)]">
        <Marquee items={PROVENANCE} />
      </section>
      <RitualChapter />
      <IngredientChapter />
      <CinematicGallery />
      <DualPath />
      <PurposeGrid />
      <WholesaleChapter />
      <UpdatesSection />
      <Finale />
    </>
  );
}

function RitualChapter() {
  return (
    <section className="relative overflow-hidden bg-[var(--ritual-surface)] py-(--spacing-section-lg) text-[var(--ritual-text)]">
      <div aria-hidden className="absolute -right-24 top-0 font-[family-name:var(--font-display)] text-[clamp(12rem,32vw,34rem)] font-semibold leading-none text-[color-mix(in_srgb,var(--ritual-text)_4%,transparent)]">B</div>
      <div className="container-page relative grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
        <Reveal><p className="eyebrow">The daily ritual</p><h2 className="mt-5 max-w-[9ch] text-[length:var(--text-display-lg)] leading-[1.02]">A quieter kind of energy.</h2></Reveal>
        <Reveal delay={0.08}><p className="max-w-[43ch] text-[length:var(--text-body-lg)] leading-relaxed text-[var(--ritual-muted)]">Not another rushed moment. Just warmth, aroma, pause.</p></Reveal>
      </div>
      <RevealGroup className="container-page mt-16 grid border-y border-[var(--ritual-border)] md:grid-cols-3" stagger={0.08}>
        {MOMENTS.map((moment) => <RevealItem key={moment.step} className="group border-b border-[var(--ritual-border)] py-8 last:border-b-0 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"><span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--accent-text)]">{moment.step}</span><h3 className="mt-10 text-[length:var(--text-display-md)] text-[var(--ritual-text)] transition-transform duration-500 group-hover:translate-x-2">{moment.title}</h3><p className="mt-2 text-[var(--ritual-muted)]">{moment.copy}</p></RevealItem>)}
      </RevealGroup>
    </section>
  );
}

function IngredientChapter() {
  return (
    <section className="relative min-h-[90svh] overflow-hidden bg-[var(--scene-bg-soft)] text-[var(--scene-text)]">
      <div className="absolute inset-0 lg:left-1/2"><Image src="/images/bakana-open-box-honey-8k.webp" alt="Open Bakana Farms Moringa, Honey and Ginger Tea box" fill sizes="(min-width:1024px) 50vw, 100vw" quality={90} className="object-cover" /><div className="absolute inset-0 bg-[linear-gradient(0deg,var(--scene-bg-soft)_0%,transparent_60%),linear-gradient(90deg,var(--scene-bg-soft)_0%,transparent_70%)] lg:bg-[linear-gradient(90deg,var(--scene-bg-soft)_0%,transparent_45%)]" /></div>
      <div className="container-page relative flex min-h-[90svh] items-end py-(--spacing-section-lg) lg:items-center">
        <Reveal className="max-w-[34rem]"><p className="font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em] text-[var(--scene-accent)]">Inside every box</p><h2 className="mt-5 text-[length:var(--text-display-lg)] leading-[1.02] text-[var(--scene-text)]">Measured moments. Individually wrapped.</h2><p className="mt-6 max-w-[38ch] text-[length:var(--text-body-lg)] leading-relaxed text-[var(--scene-muted)]">Twenty tea bags. Ready when your water is.</p><Link href="/products" className="group mt-9 inline-flex items-center gap-3 border-b border-[var(--scene-accent)] pb-2 font-medium text-[var(--scene-text)]">Explore the tea <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} aria-hidden /></Link></Reveal>
      </div>
    </section>
  );
}

function PurposeGrid() {
  const cards = [
    { icon: Leaf, label: "Ingredients", title: "Moringa, honey, ginger.", href: "/sourcing" },
    { icon: Package, label: "Product", title: "Packed for freshness.", href: "/products" },
    { icon: Storefront, label: "Trade", title: "Built for shelves.", href: "/wholesale" },
  ];
  return (
    <section className="bg-[var(--ritual-surface)] py-(--spacing-section-lg) text-[var(--ritual-text)]"><div className="container-page"><Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow">One purposeful blend</p><h2 className="mt-5 max-w-[12ch] text-[length:var(--text-display-lg)] leading-[1.02] text-[var(--ritual-text)]">Made to travel well.</h2></div><p className="max-w-[30ch] text-[var(--ritual-muted)]">From your cupboard onward.</p></Reveal><RevealGroup className="mt-14 grid gap-3 lg:grid-cols-3" stagger={0.08}>{cards.map(({ icon: Icon, label, title, href }, index) => <RevealItem key={label}><Link href={href} className="group flex min-h-[24rem] flex-col justify-between border border-[var(--ritual-border)] bg-[var(--ritual-card)] p-7 text-[var(--ritual-text)] transition-[transform,background-color] duration-500 hover:-translate-y-2 hover:bg-[var(--ritual-card-hover)]"><div className="flex items-start justify-between"><Icon size={28} weight="light" aria-hidden /><span className="font-[family-name:var(--font-mono)] text-[length:var(--text-caption)] text-[var(--ritual-muted)]">0{index + 1}</span></div><div><p className="eyebrow">{label}</p><h3 className="mt-3 max-w-[10ch] text-[length:var(--text-display-md)] leading-[1.05] text-[var(--ritual-text)]">{title}</h3><ArrowRight className="mt-6 transition-transform group-hover:translate-x-2" size={22} aria-hidden /></div></Link></RevealItem>)}</RevealGroup></div></section>
  );
}

function WholesaleChapter() {
  return <section className="border-y border-[color-mix(in_srgb,var(--scene-text)_15%,transparent)] bg-[var(--scene-bg)] py-(--spacing-section-lg) text-[var(--scene-text)]"><div className="container-page grid gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-end"><Reveal><p className="font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em] text-[var(--scene-accent)]">For retailers</p><h2 className="mt-5 max-w-[10ch] text-[length:var(--text-display-lg)] leading-[1.02] text-[var(--scene-text)]">Bring Bakana closer.</h2></Reveal><Reveal delay={0.08}><p className="max-w-[38ch] text-[length:var(--text-body-lg)] text-[var(--scene-muted)]">Tell us about your market. We will shape the conversation.</p><Button size="lg" className="mt-8 bg-[var(--scene-accent)] text-[var(--scene-bg)] hover:bg-[var(--accent-line)]" asChild><Link href="/wholesale">Start wholesale enquiry</Link></Button></Reveal></div></section>;
}

function Finale() {
  return <section className="relative overflow-hidden bg-[var(--finale-surface)] py-(--spacing-section-lg) text-[var(--finale-text)]"><div aria-hidden className="absolute -bottom-[.32em] left-1/2 -translate-x-1/2 whitespace-nowrap font-[family-name:var(--font-display)] text-[clamp(7rem,21vw,22rem)] font-semibold leading-none text-[color-mix(in_srgb,var(--finale-text)_10%,transparent)]">BAKANA</div><Reveal className="container-page relative text-center"><p className="font-[family-name:var(--font-mono)] text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em]">Your cup awaits</p><h2 className="mx-auto mt-5 max-w-[11ch] text-[length:var(--text-display-lg)] leading-[1.02] text-[var(--finale-text)]">Make room for ritual.</h2><Button size="lg" className="mt-9 bg-[var(--finale-text)] text-[var(--finale-surface)] hover:opacity-90" asChild><Link href="/products">Shop the collection</Link></Button></Reveal></section>;
}
