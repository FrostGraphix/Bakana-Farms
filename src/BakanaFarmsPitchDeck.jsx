import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowRight, ArrowLeft, Leaf, MapPin, Mail, Globe2, Package, Sparkles,
  Check, ExternalLink, ChevronRight, Award, Clock3, Star, ShoppingBag,
  Palette, LayoutGrid, Code2, Server, TrendingUp, Users, Search, Compass,
  PenTool, Hammer, Rocket, Ship, Droplet, Sun, Menu, PlayCircle, BadgeCheck, Quote,
} from "lucide-react";

const Linkedin = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Twitter = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

/* ============================================================
   BAKANA FARMS LIMITED  ×  FLOW PIXELS
   Brand & Website Transformation — Pitch Deck
   ============================================================ */

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Manrope:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

:root{
  --forest:#16281F;
  --forest-2:#0F1C15;
  --canopy:#2F5233;
  --canopy-tint:#EAF0E4;
  --gold:#C9A227;
  --gold-light:#E8CC72;
  --ginger:#B5602C;
  --ginger-tint:#F4E3D3;
  --ivory:#F5EFE0;
  --ivory-2:#EFE7D2;
  --bark:#241A12;
}
.ff-serif{ font-family:'Fraunces', serif; }
.ff-sans{ font-family:'Manrope', sans-serif; }
.ff-mono{ font-family:'Space Mono', monospace; }

.bf-root *{ box-sizing:border-box; }
.bf-root{ font-family:'Manrope', sans-serif; color:var(--bark); }

.grain::before{
  content:"";
  position:absolute; inset:0;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  pointer-events:none; mix-blend-mode:overlay;
}

@keyframes bfFadeUp{
  from{ opacity:0; transform:translateY(14px); }
  to{ opacity:1; transform:translateY(0); }
}
.bf-anim > *{ animation:bfFadeUp .6s cubic-bezier(.16,.8,.28,1) both; }
.bf-anim > *:nth-child(1){ animation-delay:.02s; }
.bf-anim > *:nth-child(2){ animation-delay:.08s; }
.bf-anim > *:nth-child(3){ animation-delay:.14s; }
.bf-anim > *:nth-child(4){ animation-delay:.20s; }
.bf-anim > *:nth-child(5){ animation-delay:.26s; }
.bf-anim > *:nth-child(6){ animation-delay:.32s; }
.bf-anim > *:nth-child(7){ animation-delay:.38s; }

.leaf-rule{
  display:flex; align-items:center; gap:10px;
}
.leaf-rule .line{ height:1px; flex:1; background:currentColor; opacity:.25; }

.stamp-spin{ animation:spin 22s linear infinite; }
@keyframes spin{ from{ transform:rotate(0deg);} to{ transform:rotate(360deg);} }

.dotted-border{
  background-image: repeating-linear-gradient(90deg, currentColor 0 6px, transparent 6px 14px);
  height:1px; opacity:.35;
}

::selection{ background:var(--gold-light); color:var(--forest-2); }

.no-scrollbar::-webkit-scrollbar{ display:none; }
.no-scrollbar{ -ms-overflow-style:none; scrollbar-width:none; }
`;

/* ---------- shared bits ---------- */

const BLogo = ({ size = 20, className }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <defs>
      <linearGradient id="logoFarmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1C3F24" />
        <stop offset="50%" stop-color="#2F5233" />
        <stop offset="100%" stop-color="#68B277" />
      </linearGradient>
    </defs>
    <g transform="translate(6, 0)">
      {/* Stem / Spine of B */}
      <path d="M 32 18 L 32 82" fill="none" stroke="url(#logoFarmGrad)" strokeWidth="10" stroke-linecap="round" />
      <path d="M 32 18 L 32 82" fill="none" stroke="#EAF0E4" stroke-width="2" stroke-linecap="round" opacity="0.4" />
      
      {/* Top Leaf Loop */}
      <path d="M 32 20 C 65 14 80 40 54 50 C 42 50 35 46 32 48 Z" fill="url(#logoFarmGrad)" />
      {/* Top Leaf Vein */}
      <path d="M 32 20 Q 48 33 54 50" fill="none" stroke="#EAF0E4" stroke-width="2.5" stroke-linecap="round" opacity="0.8" />

      {/* Bottom Leaf Loop */}
      <path d="M 32 48 C 68 44 85 72 56 82 C 44 82 35 78 32 80 Z" fill="url(#logoFarmGrad)" />
      {/* Bottom Leaf Vein */}
      <path d="M 32 48 Q 50 64 56 82" fill="none" stroke="#EAF0E4" stroke-width="2.5" stroke-linecap="round" opacity="0.8" />
    </g>
  </svg>
);

const Eyebrow = ({ children, dark }) => (
  <div
    className="ff-mono uppercase flex items-center gap-2 text-[11px] tracking-[0.25em]"
    style={{ color: dark ? "var(--gold-light)" : "var(--ginger)" }}
  >
    <span
      className="inline-block w-1.5 h-1.5 rounded-full"
      style={{ background: dark ? "var(--gold-light)" : "var(--ginger)" }}
    />
    {children}
  </div>
);

const Stamp = ({ size = 108, dark }) => (
  <div
    className="relative flex items-center justify-center rounded-full shrink-0"
    style={{
      width: size,
      height: size,
      border: `1px solid ${dark ? "rgba(232,204,114,.55)" : "rgba(36,26,18,.4)"}`,
    }}
  >
    <svg viewBox="0 0 100 100" width={size - 14} height={size - 14} className="stamp-spin">
      <defs>
        <path id="circlePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
      </defs>
      <text
        fill={dark ? "#E8CC72" : "#241A12"}
        fontSize="7.6"
        letterSpacing="2.5"
        className="ff-mono uppercase"
      >
        <textPath href="#circlePath" startOffset="0%">
          • BAKANA FARMS LIMITED • PRODUCE OF NIGERIA •
        </textPath>
      </text>
    </svg>
    <BLogo
      className="absolute"
      size={size * 0.35}
    />
  </div>
);

const SlideShell = ({ children, bg, tone = "light", index, total }) => (
  <div
    className="grain relative w-full h-full flex flex-col"
    style={{ background: bg, color: tone === "dark" ? "var(--ivory)" : "var(--bark)" }}
  >
    <div className="relative z-10 flex-1 min-h-0 flex flex-col px-8 md:px-16 py-8 md:py-10">
      {children}
    </div>
  </div>
);

const TopBar = ({ tone, label }) => (
  <div className="flex items-center justify-between mb-6 md:mb-10 shrink-0">
    <div className="flex items-center gap-2.5">
      <BLogo size={16} />
      <span className="ff-mono text-[10px] md:text-[11px] tracking-[0.22em] uppercase opacity-70">
        Flow Pixels <span className="opacity-50">for</span> Bakana Farms Ltd.
      </span>
    </div>
    <span className="ff-mono text-[10px] md:text-[11px] tracking-[0.22em] uppercase opacity-50">
      {label}
    </span>
  </div>
);

const BigNum = ({ n }) => (
  <span className="ff-serif italic" style={{ fontSize: "clamp(2.2rem,5vw,3.6rem)", color: "var(--gold)" }}>
    {n}
  </span>
);

const PillTag = ({ children, tone = "canopy" }) => {
  const map = {
    canopy: { bg: "var(--canopy-tint)", color: "var(--canopy)" },
    ginger: { bg: "var(--ginger-tint)", color: "var(--ginger)" },
    gold: { bg: "rgba(201,162,39,.14)", color: "#8a6c17" },
    darkgold: { bg: "rgba(232,204,114,.15)", color: "var(--gold-light)" },
  };
  return (
    <span
      className="ff-mono text-[10px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full"
      style={{ background: map[tone].bg, color: map[tone].color }}
    >
      {children}
    </span>
  );
};

/* browser chrome mockup wrapper */
const BrowserFrame = ({ children, url = "bakanafarms.com" }) => (
  <div className="w-full rounded-xl overflow-hidden shadow-2xl border" style={{ borderColor: "rgba(36,26,18,.12)" }}>
    <div
      className="flex items-center gap-2 px-4 py-2.5"
      style={{ background: "#EDE6D4", borderBottom: "1px solid rgba(36,26,18,.1)" }}
    >
      <div className="flex gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#D98676" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#E8CC72" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#8FAE8B" }} />
      </div>
      <div
        className="ff-mono text-[10px] flex-1 text-center rounded-full py-1"
        style={{ background: "#F7F2E5", color: "#5c5140" }}
      >
        {url}
      </div>
    </div>
    <div style={{ background: "var(--ivory)" }}>{children}</div>
  </div>
);

/* ============================================================
   SLIDE 1 — COVER
   ============================================================ */
const SlideCover = () => (
  <SlideShell tone="dark" bg="radial-gradient(120% 100% at 15% 0%, #1E3627 0%, #16281F 45%, #0F1C15 100%)">
    <TopBar tone="dark" label="Brand & Website Transformation" />
    <div className="flex-1 min-h-0 flex flex-col justify-center bf-anim">
      <Eyebrow dark>A Pitch Presentation · 2026</Eyebrow>
      <h1
        className="ff-serif mt-5 leading-[0.98]"
        style={{ fontSize: "clamp(2.4rem,7vw,5.2rem)" }}
      >
        From farm soil<br />
        to a <span className="italic" style={{ color: "var(--gold-light)" }}>global</span> shelf.
      </h1>
      <p className="ff-sans mt-6 max-w-xl text-[15px] md:text-base opacity-80 leading-relaxed">
        A complete brand and website transformation for Bakana Farms Limited —
        turning three years of quiet cultivation into an elegant, export-ready
        identity for Blended Moringa, Honey &amp; Ginger tea.
      </p>

      <div className="flex flex-wrap items-end justify-between gap-8 mt-14">
        <div className="flex items-center gap-5">
          <Stamp dark size={92} />
          <div className="ff-mono text-[11px] uppercase tracking-[0.16em] opacity-70 leading-6">
            Prepared for<br />
            <span className="ff-serif italic text-lg tracking-normal normal-case opacity-100" style={{ color: "var(--gold-light)" }}>
              Bakana Farms Limited
            </span>
          </div>
        </div>
        <div className="ff-mono text-[11px] uppercase tracking-[0.16em] opacity-70 leading-6 text-right">
          Prepared by<br />
          <span className="ff-serif italic text-lg tracking-normal normal-case opacity-100" style={{ color: "var(--gold-light)" }}>
            Flow Pixels Studio
          </span>
        </div>
      </div>
    </div>
  </SlideShell>
);

/* ============================================================
   SLIDE 2 — AGENDA
   ============================================================ */
const SlideAgenda = () => {
  const items = [
    ["01", "Understanding Bakana Farms", "Where the brand stands today"],
    ["02", "The Opportunity", "Why now is the moment to move"],
    ["03", "Our Vision", "The transformation, in one line"],
    ["04", "About Flow Pixels", "Who will build this with you"],
    ["05", "Our Process", "How we get from soil to shelf"],
    ["06", "Selected Work", "Proof, not promises"],
    ["07", "Brand Design", "Identity, palette, voice, application"],
    ["08", "Website Design", "Sitemap, homepage, shop experience"],
    ["09", "Timeline & Investment", "What it takes, and what it costs"],
    ["10", "Let's Begin", "How we start next week"],
  ];
  return (
    <SlideShell bg="var(--ivory)">
      <TopBar label="Manifest / Contents" />
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bf-anim">
        <Eyebrow>Cargo Manifest</Eyebrow>
        <h2 className="ff-serif mt-3 mb-8" style={{ fontSize: "clamp(1.8rem,3.4vw,2.6rem)" }}>
          What's inside this deck
        </h2>
        <div className="grid md:grid-cols-2 gap-x-10">
          {items.map(([n, t, d]) => (
            <div key={n} className="flex items-baseline gap-4 py-3.5" style={{ borderBottom: "1px solid rgba(36,26,18,.12)" }}>
              <span className="ff-mono text-xs opacity-40 w-6">{n}</span>
              <div className="flex-1">
                <div className="ff-serif text-lg">{t}</div>
                <div className="ff-sans text-xs opacity-55">{d}</div>
              </div>
              <ChevronRight size={15} className="opacity-30" />
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
};

/* ============================================================
   SLIDE 3 — ABOUT BAKANA FARMS TODAY
   ============================================================ */
const SlideAboutBakana = () => (
  <SlideShell bg="var(--ivory)">
    <TopBar label="Where things stand" />
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bf-anim grid md:grid-cols-5 gap-10">
      <div className="md:col-span-2">
        <Eyebrow>The Company Today</Eyebrow>
        <h2 className="ff-serif mt-3 leading-tight" style={{ fontSize: "clamp(1.9rem,3.6vw,2.8rem)" }}>
          A real product,<br /> three years without<br /> a real face.
        </h2>
        <p className="ff-sans text-sm opacity-70 mt-5 leading-relaxed">
          Bakana Farms Limited was founded in 2022 around a genuinely good product —
          a blended Moringa, honey and ginger tea bag, built for export. What it has
          never had is a brand: no visual identity, no website, no consistent way
          for buyers, distributors or retail partners to find, trust and remember it.
        </p>
      </div>

      <div className="md:col-span-3 grid sm:grid-cols-2 gap-4">
        {[
          [Package, "The Product", "A single-origin blend of Moringa, honey and ginger, packaged as a convenient tea bag — a wellness product with genuine export appeal."],
          [Clock3, "Founded 2022", "Three full years of operating history and production, with no matching brand story to show for it."],
          [Globe2, "Export Ambition", "Built from the start to leave Nigeria and reach international shelves, wholesalers and wellness retailers."],
          [Search, "The Gap", "No logo system, no website, no packaging language — meaning every sale currently happens on trust alone, not brand equity."],
        ].map(([Icon, t, d]) => (
          <div key={t} className="p-5 rounded-xl" style={{ background: "var(--ivory-2)", border: "1px solid rgba(36,26,18,.08)" }}>
            <Icon size={18} color="var(--ginger)" strokeWidth={1.6} />
            <div className="ff-serif text-base mt-3">{t}</div>
            <div className="ff-sans text-xs opacity-65 mt-1.5 leading-relaxed">{d}</div>
          </div>
        ))}
      </div>
    </div>
  </SlideShell>
);

/* ============================================================
   SLIDE 4 — THE OPPORTUNITY
   ============================================================ */
const SlideOpportunity = () => (
  <SlideShell tone="dark" bg="linear-gradient(160deg,#16281F 0%,#1C3325 55%,#16281F 100%)">
    <TopBar tone="dark" label="Why now" />
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bf-anim">
      <Eyebrow dark>The Opportunity</Eyebrow>
      <h2 className="ff-serif mt-3 leading-tight" style={{ fontSize: "clamp(1.9rem,3.8vw,2.9rem)" }}>
        Functional wellness tea is booming —<br className="hidden md:block" />
        <span className="italic" style={{ color: "var(--gold-light)" }}>and buyers are choosing on brand.</span>
      </h2>

      <div className="grid md:grid-cols-3 gap-5 mt-10">
        {[
          [TrendingUp, "A Growing Category", "Herbal and functional tea is one of the fastest-growing segments in global wellness — and moringa, honey and ginger sit at the centre of that trend."],
          [Star, "Origin Sells", "African-grown, single-origin wellness ingredients carry genuine premium appeal abroad — if the packaging and story look the part."],
          [Users, "Buyers Judge Fast", "Distributors, retailers and shoppers decide in seconds whether a product looks export-ready. Right now, Bakana Farms has no visual answer to that question."],
        ].map(([Icon, t, d]) => (
          <div key={t} className="p-6 rounded-xl" style={{ background: "rgba(245,239,224,.05)", border: "1px solid rgba(232,204,114,.18)" }}>
            <Icon size={20} color="var(--gold-light)" strokeWidth={1.6} />
            <div className="ff-serif text-lg mt-4">{t}</div>
            <div className="ff-sans text-sm opacity-70 mt-2 leading-relaxed">{d}</div>
          </div>
        ))}
      </div>

      <div className="leaf-rule mt-10 opacity-60">
        <div className="line" />
        <span className="ff-mono text-[10px] tracking-[0.2em] uppercase">The gap between the product and the perception</span>
        <div className="line" />
      </div>

      <p className="ff-sans text-sm md:text-base opacity-80 mt-6 max-w-2xl leading-relaxed">
        The product is already good enough to export. What's missing is everything
        around it — the identity that lets a buyer in Lagos, London or Los Angeles
        trust it on sight. That's the gap this deck closes.
      </p>
    </div>
  </SlideShell>
);

/* ============================================================
   SLIDE 5 — OUR VISION
   ============================================================ */
const SlideVision = () => (
  <SlideShell bg="var(--ivory)">
    <TopBar label="The transformation" />
    <div className="flex-1 min-h-0 flex flex-col justify-center bf-anim">
      <Eyebrow>Our Vision For Bakana Farms</Eyebrow>
      <h2 className="ff-serif mt-4 leading-[1.05]" style={{ fontSize: "clamp(2rem,5vw,3.6rem)" }}>
        From <span className="line-through decoration-2 opacity-40">unbranded farm produce</span>
        <br />
        to an <span className="italic" style={{ color: "var(--ginger)" }}>elegant, export-grade</span> wellness house.
      </h2>
      <p className="ff-sans text-sm md:text-base opacity-70 mt-6 max-w-2xl leading-relaxed">
        We're not proposing a logo refresh. We're proposing the brand Bakana Farms
        should have had since day one — one built on the language of the land it
        comes from: moringa green, raw honey gold, and sun-dried ginger — carried
        with the restraint and polish of a luxury export house.
      </p>

      <div className="flex flex-wrap gap-3 mt-8">
        {["Rooted in soil", "Refined for the world", "Single-origin honesty", "Quietly luxurious", "Export-first"].map((t) => (
          <span key={t} className="ff-mono text-[11px] uppercase tracking-[0.12em] px-4 py-2 rounded-full" style={{ background: "var(--forest)", color: "var(--ivory)" }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  </SlideShell>
);

/* ============================================================
   SLIDE 6 — ABOUT FLOW PIXELS
   ============================================================ */
const SlideAboutFlowPixels = () => (
  <SlideShell bg="var(--ivory)">
    <TopBar label="Your partner" />
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bf-anim grid md:grid-cols-5 gap-10">
      <div className="md:col-span-2">
        <Eyebrow>Who We Are</Eyebrow>
        <h2 className="ff-serif mt-3 leading-tight" style={{ fontSize: "clamp(1.9rem,3.6vw,2.7rem)" }}>
          Flow Pixels —<br />brand &amp; Framer<br />development studio.
        </h2>
        <p className="ff-sans text-sm opacity-70 mt-5 leading-relaxed">
          We partner with businesses and brands to aid them in their evolution,
          rebranding, or establishment of their identity — applying strategic
          thought to deliver effective design solutions across sectors, at every scale.
        </p>
        <div className="flex gap-8 mt-8">
          {[["45+", "Happy Clients"], ["15k+", "Hours Crafted"], ["4.8", "Client Rating"]].map(([n, l]) => (
            <div key={l}>
              <div className="ff-serif italic text-3xl" style={{ color: "var(--ginger)" }}>{n}</div>
              <div className="ff-mono text-[10px] uppercase tracking-[0.1em] opacity-55 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="md:col-span-3">
        <div className="ff-mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3">Our Operating Principle</div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            [Sparkles, "Vibrant", "Our vibrant company culture is the heart that fuels our success."],
            [Compass, "Innovative", "We cultivate an environment that celebrates innovation at every step."],
            [Rocket, "Boundary-Pushing", "Every team member is encouraged to think creatively, on every brief."],
          ].map(([Icon, t, d]) => (
            <div key={t} className="p-5 rounded-xl" style={{ background: "var(--forest)", color: "var(--ivory)" }}>
              <Icon size={18} color="var(--gold-light)" strokeWidth={1.6} />
              <div className="ff-serif text-base mt-3">{t}</div>
              <div className="ff-sans text-xs opacity-75 mt-1.5 leading-relaxed">{d}</div>
            </div>
          ))}
        </div>

        <div className="ff-mono text-[10px] uppercase tracking-[0.2em] opacity-50 mt-8 mb-3">Contact</div>
        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-2 ff-sans text-sm px-4 py-2 rounded-full" style={{ background: "var(--ivory-2)" }}>
            <Mail size={14} /> youngdanmusa@gmail.com
          </span>
          <span className="flex items-center gap-2 ff-sans text-sm px-4 py-2 rounded-full" style={{ background: "var(--ivory-2)" }}>
            <Globe2 size={14} /> flowpixels.evcng.com
          </span>
        </div>
      </div>
    </div>
  </SlideShell>
);

/* ============================================================
   SLIDE 7 — OUR SERVICES
   ============================================================ */
const SlideServices = () => (
  <SlideShell tone="dark" bg="linear-gradient(150deg,#0F1C15,#16281F 60%,#1C3325)">
    <TopBar tone="dark" label="Capabilities" />
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bf-anim">
      <Eyebrow dark>What We Do</Eyebrow>
      <h2 className="ff-serif mt-3 mb-8" style={{ fontSize: "clamp(1.9rem,3.6vw,2.7rem)" }}>
        Everything Bakana Farms needs, under one studio.
      </h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          [Palette, "Brand Design", "Logo systems, colour, typography, packaging language, social templates."],
          [LayoutGrid, "Web Design", "Elegant, conversion-minded UI design in Figma before a line of code is written."],
          [Code2, "Web Development", "Fast, animated, production-grade builds on Framer and modern web stacks."],
          [ShoppingBag, "Ecommerce Websites", "Full storefronts — product catalogues, cart, checkout and payments, built to sell."],
          [Server, "Full-Stack Projects", "Custom systems where the brief goes beyond a website — dashboards, portals, tools."],
          [Globe2, "Web Hosting & Care", "We help select the right hosting and manage it, so the site simply stays online."],
        ].map(([Icon, t, d]) => (
          <div key={t} className="p-6 rounded-xl" style={{ background: "rgba(245,239,224,.05)", border: "1px solid rgba(232,204,114,.16)" }}>
            <Icon size={20} color="var(--gold-light)" strokeWidth={1.5} />
            <div className="ff-serif text-lg mt-4">{t}</div>
            <div className="ff-sans text-sm opacity-70 mt-2 leading-relaxed">{d}</div>
          </div>
        ))}
      </div>
    </div>
  </SlideShell>
);

/* ============================================================
   SLIDE 8 — OUR PROCESS
   ============================================================ */
const SlideProcess = () => {
  const steps = [
    [Search, "Discover", "We study the product, the category, competitors and export buyers."],
    [Compass, "Define", "Positioning, brand pillars, tone of voice and the visual direction, agreed upfront."],
    [PenTool, "Design", "Identity system and full website UI, designed and reviewed with you."],
    [Hammer, "Develop", "The site is built, animated and tested — fast, responsive, ready to sell."],
    [Rocket, "Launch", "Domain, hosting and go-live — Bakana Farms, live to the world."],
    [Ship, "Grow", "Ongoing care, hosting management and iteration as the brand scales."],
  ];
  return (
    <SlideShell bg="var(--ivory)">
      <TopBar label="How we work" />
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bf-anim">
        <Eyebrow>Our Process</Eyebrow>
        <h2 className="ff-serif mt-3 mb-8" style={{ fontSize: "clamp(1.9rem,3.6vw,2.7rem)" }}>
          From soil to shelf, in six moves.
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
          {steps.map(([Icon, t, d], i) => (
            <div key={t} className="relative pl-1">
              <div className="flex items-center gap-3">
                <span className="ff-serif italic text-2xl" style={{ color: "var(--gold)" }}>0{i + 1}</span>
                <Icon size={18} color="var(--ginger)" strokeWidth={1.6} />
              </div>
              <div className="ff-serif text-lg mt-2">{t}</div>
              <div className="ff-sans text-xs opacity-65 mt-1.5 leading-relaxed max-w-[24ch]">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
};

/* ============================================================
   SLIDE 9 — SELECTED WORK
   ============================================================ */
const SlideWork = () => {
  const projects = [
    ["EVC Global", "Ecommerce real estate platform connecting developers to buyers.", "Real Estate", "evcng.com"],
    ["Nashrai AI", "Where automation meets intelligence — AI product site.", "AI / SaaS", "nashrai.framer.website"],
    ["Lamischolero", "Construction, IT and HR firm brand and web platform.", "Corporate", "lamischolero.com"],
    ["A1 Homes & Properties", "Revitalising real estate with marketing and data.", "Real Estate", "a1hpltd.com"],
    ["ACOB Lighting", "Corporate site for a solar & lighting energy company.", "Energy", "acoblighting.com"],
    ["Saudi2Naija", "Cross-border logistics and currency exchange platform.", "Fintech", "saudi2naija.vercel.app"],
  ];
  return (
    <SlideShell bg="var(--ivory)">
      <TopBar label="Proof of craft" />
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bf-anim">
        <Eyebrow>Selected Work</Eyebrow>
        <h2 className="ff-serif mt-3 mb-2" style={{ fontSize: "clamp(1.9rem,3.6vw,2.7rem)" }}>
          A few brands we've already shipped.
        </h2>
        <p className="ff-sans text-sm opacity-60 mb-7">flowpixels.evcng.com/portfolio</p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {projects.map(([t, d, tag, url], i) => (
            <div key={t} className="rounded-xl overflow-hidden group" style={{ border: "1px solid rgba(36,26,18,.1)" }}>
              <div
                className="h-24 flex items-center justify-center relative"
                style={{ background: [`linear-gradient(135deg,#2F5233,#16281F)`, `linear-gradient(135deg,#B5602C,#7A3D18)`, `linear-gradient(135deg,#C9A227,#8a6c17)`][i % 3] }}
              >
                <span className="ff-serif italic text-2xl text-white opacity-90">{t.split(" ")[0]}</span>
              </div>
              <div className="p-4" style={{ background: "var(--ivory-2)" }}>
                <div className="flex items-center justify-between">
                  <span className="ff-serif text-base">{t}</span>
                  <ExternalLink size={13} className="opacity-40" />
                </div>
                <p className="ff-sans text-xs opacity-60 mt-1.5 leading-relaxed">{d}</p>
                <div className="flex items-center justify-between mt-3">
                  <PillTag tone="canopy">{tag}</PillTag>
                  <span className="ff-mono text-[10px] opacity-40">{url}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-xl flex items-start gap-4" style={{ background: "var(--forest)", color: "var(--ivory)" }}>
          <Quote size={22} color="var(--gold-light)" className="shrink-0 mt-1" />
          <p className="ff-serif italic text-base leading-relaxed">
            "Working with Flow Pixels has been a game-changer for our website's user
            experience. Their innovative UI design and seamless development elevated
            our product to new heights." <span className="ff-sans not-italic text-xs opacity-60">— Client testimonial, Flow Pixels</span>
          </p>
        </div>
      </div>
    </SlideShell>
  );
};

/* ============================================================
   SECTION DIVIDERS
   ============================================================ */
const SlideDivider = ({ eyebrow, title, sub, num }) => (
  <SlideShell tone="dark" bg="radial-gradient(120% 100% at 85% 100%, #2A4A31 0%, #16281F 45%, #0F1C15 100%)">
    <TopBar tone="dark" label={eyebrow} />
    <div className="flex-1 min-h-0 flex flex-col justify-center items-start bf-anim">
      <span className="ff-mono text-sm opacity-40">{num}</span>
      <h2 className="ff-serif mt-4 leading-[0.95]" style={{ fontSize: "clamp(2.6rem,8vw,6rem)" }}>
        {title}
      </h2>
      <p className="ff-sans mt-6 max-w-lg text-sm md:text-base opacity-70 leading-relaxed">{sub}</p>
      <Stamp dark size={80} />
    </div>
  </SlideShell>
);

const SlideBrandDivider = () => (
  <SlideDivider
    num="Section One"
    eyebrow="Brand Design"
    title={<>Brand<br /><span className="italic" style={{ color: "var(--gold-light)" }}>Design.</span></>}
    sub="Building the identity Bakana Farms should have launched with — the mark, the palette, the voice, and how it lives on every touchpoint."
  />
);

const SlideWebDivider = () => (
  <SlideDivider
    num="Section Two"
    eyebrow="Website Design"
    title={<>Website<br /><span className="italic" style={{ color: "var(--gold-light)" }}>Design.</span></>}
    sub="Translating the new identity into a fast, elegant, export-ready website — built to convert distributors, retailers and everyday customers."
  />
);

/* ============================================================
   SLIDE — BRAND STRATEGY & POSITIONING
   ============================================================ */
const SlideBrandStrategy = () => (
  <SlideShell bg="var(--ivory)">
    <TopBar label="Brand design · Strategy" />
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bf-anim grid md:grid-cols-5 gap-10">
      <div className="md:col-span-2">
        <Eyebrow>Positioning</Eyebrow>
        <h2 className="ff-serif mt-3 leading-tight" style={{ fontSize: "clamp(1.9rem,3.4vw,2.6rem)" }}>
          Quietly luxurious.<br />Unmistakably Nigerian.
        </h2>
        <p className="ff-sans text-sm opacity-70 mt-5 leading-relaxed">
          Bakana Farms is positioned as a premium, single-origin wellness house —
          not a bulk agro-exporter. The brand should feel closer to a fine tea
          label than a commodity supplier, while never hiding where it's from.
        </p>
        <div className="mt-7 p-5 rounded-xl" style={{ background: "var(--forest)", color: "var(--ivory)" }}>
          <div className="ff-mono text-[10px] uppercase tracking-[0.2em] opacity-60">Proposed Tagline</div>
          <div className="ff-serif italic text-2xl mt-2" style={{ color: "var(--gold-light)" }}>
            "Rooted in soil. Refined for the world."
          </div>
        </div>
      </div>

      <div className="md:col-span-3">
        <div className="ff-mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3">Brand Pillars</div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            ["Purity", "Single-origin ingredients, minimal processing — and packaging that says so honestly."],
            ["Heritage", "Nigerian soil and craft, worn with pride rather than hidden behind generic design."],
            ["Wellness", "Every visual choice reinforces calm, care and everyday ritual, not novelty."],
            ["Global Standard", "Design and packaging held to the same bar as the export shelves it's aiming for."],
          ].map(([t, d]) => (
            <div key={t} className="p-5 rounded-xl" style={{ background: "var(--ivory-2)", border: "1px solid rgba(36,26,18,.08)" }}>
              <BadgeCheck size={16} color="var(--ginger)" />
              <div className="ff-serif text-base mt-2.5">{t}</div>
              <div className="ff-sans text-xs opacity-65 mt-1.5 leading-relaxed">{d}</div>
            </div>
          ))}
        </div>

        <div className="ff-mono text-[10px] uppercase tracking-[0.2em] opacity-50 mt-7 mb-3">Voice</div>
        <div className="flex flex-wrap gap-2.5">
          {["Warm", "Confident", "Unhurried", "Honest", "Never shouty"].map((t) => (
            <PillTag key={t} tone="ginger">{t}</PillTag>
          ))}
        </div>
      </div>
    </div>
  </SlideShell>
);

/* ============================================================
   SLIDE — VISUAL IDENTITY (palette, type, logo concept)
   ============================================================ */
const SlideVisualIdentity = () => {
  const palette = [
    ["Forest", "#16281F", "Primary — packaging, headers, authority"],
    ["Canopy", "#2F5233", "Secondary — supporting green, foliage"],
    ["Honey Gold", "#C9A227", "Accent — foil stamping, highlights"],
    ["Ginger Rust", "#B5602C", "Accent — warmth, ginger cues"],
    ["Ivory", "#F5EFE0", "Base — packaging paper, backgrounds"],
    ["Bark", "#241A12", "Text — grounding neutral"],
  ];
  return (
    <SlideShell bg="var(--ivory)">
      <TopBar label="Brand design · Visual identity" />
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bf-anim">
        <Eyebrow>Visual Identity System</Eyebrow>
        <h2 className="ff-serif mt-3 mb-8" style={{ fontSize: "clamp(1.9rem,3.4vw,2.6rem)" }}>
          A palette drawn from the product itself.
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="ff-mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3">Colour Palette</div>
            <div className="grid grid-cols-2 gap-3">
              {palette.map(([n, hex, d]) => (
                <div key={n} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(36,26,18,.1)" }}>
                  <div className="h-16" style={{ background: hex }} />
                  <div className="p-3" style={{ background: "var(--ivory-2)" }}>
                    <div className="flex items-center justify-between">
                      <span className="ff-serif text-sm">{n}</span>
                      <span className="ff-mono text-[10px] opacity-50">{hex}</span>
                    </div>
                    <p className="ff-sans text-[11px] opacity-55 mt-1 leading-snug">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="ff-mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3">Typography</div>
            <div className="p-6 rounded-xl mb-4" style={{ background: "var(--forest)", color: "var(--ivory)" }}>
              <div className="ff-mono text-[10px] uppercase tracking-[0.15em] opacity-50 mb-2">Display — Fraunces</div>
              <div className="ff-serif text-4xl italic" style={{ color: "var(--gold-light)" }}>Bakana Farms</div>
              <div className="ff-serif text-4xl">Bakana Farms</div>
            </div>
            <div className="p-6 rounded-xl" style={{ background: "var(--ivory-2)", border: "1px solid rgba(36,26,18,.08)" }}>
              <div className="ff-mono text-[10px] uppercase tracking-[0.15em] opacity-50 mb-2">Body & UI — Manrope</div>
              <p className="ff-sans text-sm leading-relaxed">
                A blended Moringa, Honey &amp; Ginger tea — single-origin, sun-honest,
                and made for the world. ABCDEFGHIJ 0123456789
              </p>
            </div>
            <div className="ff-mono text-[10px] uppercase tracking-[0.2em] opacity-50 mt-5 mb-2">Utility — Space Mono</div>
            <div className="ff-mono text-xs px-4 py-3 rounded-lg" style={{ background: "var(--bark)", color: "var(--gold-light)" }}>
              PRODUCE OF NIGERIA · EST. 2022 · LOT №017
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="col-span-1 p-6 rounded-xl flex flex-col items-center justify-center" style={{ background: "var(--forest)" }}>
            <Stamp dark size={110} />
          </div>
          <div className="md:col-span-2 p-6 rounded-xl" style={{ background: "var(--ivory-2)", border: "1px solid rgba(36,26,18,.08)" }}>
            <div className="ff-mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-2">Logo Concept</div>
            <p className="ff-sans text-sm opacity-75 leading-relaxed">
              A wordmark set in Fraunces, paired with a circular export seal — three
              interlocking moringa leaves forming a subtle "B" monogram, ringed by a
              customs-stamp typographic border. The seal works alone on packaging caps,
              wax seals and social avatars; the full lock-up carries the wordmark and
              "Produce of Nigeria" mark for export documentation and cartons.
            </p>
          </div>
        </div>
      </div>
    </SlideShell>
  );
};

/* ============================================================
   SLIDE — BEFORE / AFTER TRANSFORMATION
   ============================================================ */
const SlideBeforeAfter = () => (
  <SlideShell bg="var(--ivory)">
    <TopBar label="Brand design · The transformation" />
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bf-anim">
      <Eyebrow>Before &amp; After</Eyebrow>
      <h2 className="ff-serif mt-3 mb-8" style={{ fontSize: "clamp(1.9rem,3.4vw,2.6rem)" }}>
        The same product. A completely different first impression.
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* BEFORE */}
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(36,26,18,.12)" }}>
          <div className="flex items-center justify-between px-5 py-3" style={{ background: "var(--ivory-2)" }}>
            <span className="ff-mono text-[10px] uppercase tracking-[0.2em] opacity-60">Before — Today</span>
            <PillTag tone="ginger">No brand system</PillTag>
          </div>
          <div className="p-6" style={{ background: "#EDE8DA" }}>
            <div className="rounded-lg p-5 bg-white/70 border border-dashed" style={{ borderColor: "rgba(36,26,18,.25)" }}>
              <div className="ff-sans text-sm font-bold opacity-70">Bakana Farms</div>
              <div className="ff-sans text-[11px] opacity-50 mt-1">Moringa Honey Ginger Tea Bags</div>
              <div className="ff-mono text-[9px] opacity-40 mt-4">No website · No logo · No packaging system</div>
              <div className="ff-mono text-[9px] opacity-40 mt-1">Sold via WhatsApp &amp; word of mouth only</div>
            </div>
            <ul className="mt-4 space-y-1.5">
              {["No visual identity to earn trust at first glance", "No website — every enquiry funnels through DMs", "Generic, inconsistent packaging across batches", "Invisible to international distributors & search"].map((t) => (
                <li key={t} className="ff-sans text-xs opacity-60 flex items-start gap-2">
                  <span className="opacity-50">–</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AFTER */}
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--gold)" }}>
          <div className="flex items-center justify-between px-5 py-3" style={{ background: "var(--forest)", color: "var(--ivory)" }}>
            <span className="ff-mono text-[10px] uppercase tracking-[0.2em] opacity-70">After — Flow Pixels</span>
            <PillTag tone="darkgold">Complete identity</PillTag>
          </div>
          <div className="p-6" style={{ background: "linear-gradient(160deg,#1C3325,#16281F)" }}>
            <div className="flex items-center gap-4">
              <Stamp dark size={64} />
              <div>
                <div className="ff-serif italic text-xl" style={{ color: "var(--gold-light)" }}>Bakana Farms</div>
                <div className="ff-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: "var(--ivory)", opacity: 0.6 }}>Rooted in soil. Refined for the world.</div>
              </div>
            </div>
            <ul className="mt-5 space-y-1.5">
              {["A mark & seal that reads premium in one glance", "A live website that sells, and qualifies distributors", "One consistent packaging language, every batch", "SEO-ready, export-credible, everywhere it's seen"].map((t) => (
                <li key={t} className="ff-sans text-xs flex items-start gap-2" style={{ color: "var(--ivory)", opacity: 0.85 }}>
                  <Check size={13} className="mt-0.5 shrink-0" color="var(--gold-light)" />{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="ff-sans text-sm opacity-65 mt-6 max-w-2xl leading-relaxed">
        Nothing about the tea changes. What changes is whether a buyer trusts it
        enough to say yes — before they've even tasted it.
      </p>
    </div>
  </SlideShell>
);

/* ============================================================
   SLIDE — BRAND IN APPLICATION (packaging mockups)
   ============================================================ */
const TeaBox = ({ label = "MORINGA · HONEY · GINGER" }) => (
  <div
    className="relative w-40 h-52 rounded-md shrink-0 flex flex-col justify-between p-3 shadow-xl"
    style={{ background: "linear-gradient(160deg,#1C3325,#16281F)", border: "1px solid rgba(232,204,114,.3)" }}
  >
    <div className="flex items-center justify-between">
      <BLogo size={14} />
      <span className="ff-mono text-[7px] tracking-widest opacity-60" style={{ color: "var(--ivory)" }}>EST 2022</span>
    </div>
    <div className="text-center">
      <div className="ff-serif italic text-lg" style={{ color: "var(--gold-light)" }}>Bakana</div>
      <div className="ff-serif text-xl -mt-1" style={{ color: "var(--ivory)" }}>Farms</div>
      <div className="dotted-border my-2" style={{ color: "var(--gold-light)" }} />
      <div className="ff-mono text-[6.5px] tracking-[0.15em]" style={{ color: "var(--ivory)", opacity: 0.75 }}>{label}</div>
    </div>
    <div className="ff-mono text-[6px] tracking-widest text-center" style={{ color: "var(--ivory)", opacity: 0.5 }}>PRODUCE OF NIGERIA · 20 TEA BAGS</div>
  </div>
);

const SlideBrandApplication = () => (
  <SlideShell bg="linear-gradient(180deg,#EFE7D2,#E4D8B8)">
    <TopBar label="Brand design · Application" />
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bf-anim">
      <Eyebrow>Brand In Application</Eyebrow>
      <h2 className="ff-serif mt-3 mb-8" style={{ fontSize: "clamp(1.9rem,3.4vw,2.6rem)" }}>
        How the identity lives, in the real world.
      </h2>

      <div className="flex flex-wrap items-end gap-8">
        <div className="flex gap-5">
          <TeaBox />
          <TeaBox label="GINGER · MORINGA · HONEY" />
        </div>

        <div className="w-56 p-4 rounded-xl shadow-xl" style={{ background: "var(--ivory)" }}>
          <div className="ff-mono text-[9px] uppercase tracking-[0.2em] opacity-50 mb-2">Export Carton Label</div>
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--forest)" }}>
            <Stamp dark size={50} />
            <div className="ff-mono text-[7px] leading-relaxed" style={{ color: "var(--ivory)" }}>
              LOT №017<br />NET 200g<br />ORIGIN: RIVERS STATE, NG<br />BAKANAFARMS.COM
            </div>
          </div>
        </div>

        <div className="w-56 p-4 rounded-xl shadow-xl" style={{ background: "var(--forest)", color: "var(--ivory)" }}>
          <div className="ff-mono text-[9px] uppercase tracking-[0.2em] opacity-50 mb-3">Social Post Template</div>
          <div className="aspect-square rounded-lg flex flex-col items-center justify-center gap-2" style={{ background: "linear-gradient(160deg,#2F5233,#16281F)" }}>
            <BLogo size={22} />
            <span className="ff-serif italic text-sm" style={{ color: "var(--gold-light)" }}>Rooted in soil.</span>
            <span className="ff-serif text-xs">Refined for the world.</span>
          </div>
        </div>

        <div className="w-56 p-4 rounded-xl shadow-xl" style={{ background: "var(--ivory)" }}>
          <div className="ff-mono text-[9px] uppercase tracking-[0.2em] opacity-50 mb-2">Business Card</div>
          <div className="rounded-lg p-4 h-28 flex flex-col justify-between" style={{ background: "var(--bark)", color: "var(--ivory)" }}>
            <BLogo size={14} />
            <div>
              <div className="ff-serif italic text-sm" style={{ color: "var(--gold-light)" }}>Bakana Farms</div>
              <div className="ff-mono text-[7px] opacity-60 mt-1">EXPORT & TRADE · NIGERIA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SlideShell>
);

/* ============================================================
   SLIDE — WEBSITE STRATEGY & SITEMAP
   ============================================================ */
const SlideWebStrategy = () => (
  <SlideShell bg="var(--ivory)">
    <TopBar label="Website design · Strategy" />
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bf-anim grid md:grid-cols-5 gap-10">
      <div className="md:col-span-2">
        <Eyebrow>Site Goals</Eyebrow>
        <h2 className="ff-serif mt-3 leading-tight" style={{ fontSize: "clamp(1.9rem,3.4vw,2.6rem)" }}>
          A website that sells to buyers and shoppers alike.
        </h2>
        <p className="ff-sans text-sm opacity-70 mt-5 leading-relaxed">
          The new site has two audiences: international distributors evaluating
          Bakana Farms as an export partner, and everyday customers buying a box
          of tea online. Every page is designed to earn trust for both.
        </p>
        <div className="mt-6 space-y-3">
          {["Establish credibility in under 5 seconds", "Sell the tea directly, with ecommerce checkout", "Give distributors a clear wholesale / export path", "Rank for moringa & ginger tea search terms"].map((t) => (
            <div key={t} className="flex items-center gap-2.5">
              <Check size={14} color="var(--canopy)" />
              <span className="ff-sans text-sm">{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="md:col-span-3">
        <div className="ff-mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3">Proposed Sitemap</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            ["Home", "The brand story in one scroll — hero, product, origin, trust."],
            ["Shop", "Full catalogue — tea bags, bundles, gifting sets, subscriptions."],
            ["Our Story", "2022 to now — the farm, the process, the people."],
            ["Wholesale / Export", "MOQs, certifications, shipping terms — for distributors."],
            ["Product Detail", "Ingredients, brewing guide, nutrition, reviews."],
            ["Journal", "Wellness content — SEO engine for organic search."],
            ["Contact", "Export enquiries and customer support, split clearly."],
            ["Cart & Checkout", "Fast, secure, multi-currency checkout for global buyers."],
          ].map(([t, d]) => (
            <div key={t} className="p-4 rounded-xl" style={{ background: "var(--ivory-2)", border: "1px solid rgba(36,26,18,.08)" }}>
              <div className="ff-serif text-base">{t}</div>
              <div className="ff-sans text-xs opacity-60 mt-1 leading-relaxed">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </SlideShell>
);

/* ============================================================
   SLIDE — HOMEPAGE UI DESIGN (mockup)
   ============================================================ */
const SlideHomepageUI = () => (
  <SlideShell bg="var(--ivory-2)">
    <TopBar label="Website design · Homepage UI" />
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bf-anim">
      <Eyebrow>Homepage Design</Eyebrow>
      <h2 className="ff-serif mt-3 mb-6" style={{ fontSize: "clamp(1.9rem,3.4vw,2.6rem)" }}>
        The first five seconds, designed to earn trust.
      </h2>

      <BrowserFrame url="bakanafarms.com">
        {/* nav */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(36,26,18,.08)" }}>
          <div className="flex items-center gap-2">
            <BLogo size={14} />
            <span className="ff-serif italic text-sm">Bakana Farms</span>
          </div>
          <div className="hidden sm:flex gap-6 ff-mono text-[9px] uppercase tracking-[0.14em] opacity-60">
            <span>Shop</span><span>Our Story</span><span>Wholesale</span><span>Journal</span>
          </div>
          <div className="flex items-center gap-3">
            <ShoppingBag size={14} className="opacity-60" />
            <span className="ff-mono text-[9px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-full" style={{ background: "var(--forest)", color: "var(--ivory)" }}>Shop Now</span>
          </div>
        </div>

        {/* hero */}
        <div className="grid md:grid-cols-2 gap-6 px-6 md:px-10 py-10 items-center" style={{ background: "linear-gradient(160deg,#F5EFE0,#EAE0C4)" }}>
          <div>
            <PillTag tone="ginger">Est. 2022 · Rivers State, Nigeria</PillTag>
            <h3 className="ff-serif mt-4 leading-[1.05]" style={{ fontSize: "clamp(1.5rem,3vw,2.3rem)" }}>
              Rooted in soil.<br /><span className="italic" style={{ color: "var(--ginger)" }}>Refined for the world.</span>
            </h3>
            <p className="ff-sans text-xs opacity-65 mt-3 max-w-xs leading-relaxed">
              A single-origin blend of Moringa, honey and ginger — grown, blended
              and bagged for export from Nigerian soil.
            </p>
            <div className="flex gap-3 mt-5">
              <span className="ff-mono text-[9px] uppercase tracking-[0.12em] px-4 py-2.5 rounded-full" style={{ background: "var(--bark)", color: "var(--ivory)" }}>Shop the Blend</span>
              <span className="ff-mono text-[9px] uppercase tracking-[0.12em] px-4 py-2.5 rounded-full border" style={{ borderColor: "var(--bark)" }}>Our Story →</span>
            </div>
          </div>
          <div className="flex justify-center">
            <TeaBox />
          </div>
        </div>

        {/* trust strip */}
        <div className="flex flex-wrap justify-around gap-3 px-6 py-4 ff-mono text-[9px] uppercase tracking-[0.12em] opacity-60" style={{ background: "var(--forest)", color: "var(--ivory)" }}>
          <span>Single-Origin</span><span>Export Certified</span><span>Handblended</span><span>20 Tea Bags / Box</span>
        </div>

        {/* product grid teaser */}
        <div className="px-6 md:px-10 py-8">
          <div className="ff-mono text-[9px] uppercase tracking-[0.16em] opacity-50 mb-3">The Range</div>
          <div className="grid grid-cols-3 gap-3">
            {["Moringa · Honey · Ginger", "Pure Moringa", "Honey Ginger"].map((t) => (
              <div key={t} className="rounded-lg p-3 flex flex-col items-center gap-2" style={{ background: "var(--ivory)", border: "1px solid rgba(36,26,18,.08)" }}>
                <div className="w-10 h-14 rounded" style={{ background: "linear-gradient(160deg,#2F5233,#16281F)" }} />
                <span className="ff-sans text-[9px] text-center opacity-70 leading-tight">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </BrowserFrame>

      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {[
          ["Hero that qualifies fast", "Origin, category and trust signal appear before any scrolling."],
          ["One clear action", "Shop and Story are the only two paths — nothing competes for attention."],
          ["Export cues throughout", "Certification and origin marks reassure distributors on every scroll."],
        ].map(([t, d]) => (
          <div key={t} className="p-4 rounded-xl" style={{ background: "var(--ivory)", border: "1px solid rgba(36,26,18,.08)" }}>
            <div className="ff-serif text-sm">{t}</div>
            <div className="ff-sans text-xs opacity-60 mt-1 leading-relaxed">{d}</div>
          </div>
        ))}
      </div>
    </div>
  </SlideShell>
);

/* ============================================================
   SLIDE — SHOP / PRODUCT UI DESIGN
   ============================================================ */
const SlideShopUI = () => (
  <SlideShell bg="var(--ivory-2)">
    <TopBar label="Website design · Shop UI" />
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bf-anim">
      <Eyebrow>Product & Shop Design</Eyebrow>
      <h2 className="ff-serif mt-3 mb-6" style={{ fontSize: "clamp(1.9rem,3.4vw,2.6rem)" }}>
        Built to sell — one box or a container load.
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <BrowserFrame url="bakanafarms.com/shop/blend">
          <div className="p-6 grid grid-cols-2 gap-5">
            <div className="flex items-center justify-center rounded-lg" style={{ background: "linear-gradient(160deg,#F5EFE0,#EAE0C4)" }}>
              <TeaBox />
            </div>
            <div>
              <PillTag tone="canopy">In Stock</PillTag>
              <div className="ff-serif text-lg mt-2">Moringa, Honey<br />&amp; Ginger — 20 Bags</div>
              <div className="flex items-center gap-1 mt-1.5">
                {[1,2,3,4,5].map(i=><Star key={i} size={10} fill="var(--gold)" color="var(--gold)"/>)}
                <span className="ff-mono text-[8px] opacity-50 ml-1">128 reviews</span>
              </div>
              <div className="ff-serif italic text-xl mt-3" style={{ color: "var(--ginger)" }}>$14.00</div>
              <p className="ff-sans text-[10px] opacity-60 mt-2 leading-relaxed">
                Single-origin, hand-blended, sun-honest wellness tea — ready to ship worldwide.
              </p>
              <div className="ff-mono text-[9px] uppercase tracking-[0.12em] px-4 py-2.5 rounded-full text-center mt-4" style={{ background: "var(--bark)", color: "var(--ivory)" }}>
                Add To Cart
              </div>
            </div>
          </div>
        </BrowserFrame>

        <BrowserFrame url="bakanafarms.com/wholesale">
          <div className="p-6" style={{ background: "var(--forest)", color: "var(--ivory)" }}>
            <PillTag tone="darkgold">For Distributors</PillTag>
            <div className="ff-serif text-lg mt-2">Wholesale & Export</div>
            <p className="ff-sans text-[10px] opacity-70 mt-2 leading-relaxed">
              Minimum order quantities, shipping terms and certification — laid out
              clearly, so a buyer never has to email to ask the basics.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {[["MOQ", "500 boxes"], ["Incoterms", "FOB Lagos"], ["Lead Time", "10–14 days"], ["Certs", "NAFDAC · Export"]].map(([k,v]) => (
                <div key={k} className="p-2.5 rounded-lg" style={{ background: "rgba(245,239,224,.06)" }}>
                  <div className="ff-mono text-[8px] uppercase opacity-50">{k}</div>
                  <div className="ff-sans text-xs mt-0.5">{v}</div>
                </div>
              ))}
            </div>
            <div className="ff-mono text-[9px] uppercase tracking-[0.12em] px-4 py-2.5 rounded-full text-center mt-4" style={{ background: "var(--gold)", color: "var(--bark)" }}>
              Request Export Quote
            </div>
          </div>
        </BrowserFrame>
      </div>

      <div className="grid sm:grid-cols-4 gap-3 mt-6">
        {[
          [ShoppingBag, "Ecommerce Checkout", "Cards, transfer & multi-currency, so global customers can buy directly."],
          [Ship, "Export Portal", "A dedicated flow for distributors, separate from retail checkout."],
          [Droplet, "Ingredient Story", "Every product page explains sourcing, honestly and specifically."],
          [Sun, "Fast, Light Build", "Framer-built for speed — critical for buyers on slower connections."],
        ].map(([Icon, t, d]) => (
          <div key={t} className="p-4 rounded-xl" style={{ background: "var(--ivory)", border: "1px solid rgba(36,26,18,.08)" }}>
            <Icon size={16} color="var(--ginger)" />
            <div className="ff-serif text-sm mt-2">{t}</div>
            <div className="ff-sans text-[11px] opacity-60 mt-1 leading-relaxed">{d}</div>
          </div>
        ))}
      </div>
    </div>
  </SlideShell>
);

/* ============================================================
   SLIDE — TIMELINE
   ============================================================ */
const SlideTimeline = () => {
  const phases = [
    ["Week 1–2", "Discover & Define", "Brand strategy, positioning, competitor & market research, sign-off."],
    ["Week 3–4", "Brand Design", "Logo system, palette, typography, packaging & social templates."],
    ["Week 5–6", "Website UI Design", "Full page designs — home, shop, story, wholesale, product, contact."],
    ["Week 7–8", "Development", "Framer build, ecommerce setup, animation, responsive QA."],
    ["Week 9", "Launch", "Domain, hosting, go-live, and handover training."],
  ];
  return (
    <SlideShell bg="var(--ivory)">
      <TopBar label="Timeline" />
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bf-anim">
        <Eyebrow>Project Timeline</Eyebrow>
        <h2 className="ff-serif mt-3 mb-8" style={{ fontSize: "clamp(1.9rem,3.4vw,2.6rem)" }}>
          Nine weeks — from nothing, to launch.
        </h2>
        <div className="space-y-0">
          {phases.map(([w, t, d], i) => (
            <div key={t} className="flex items-start gap-5 py-4" style={{ borderBottom: i < phases.length - 1 ? "1px solid rgba(36,26,18,.1)" : "none" }}>
              <span className="ff-mono text-xs w-20 shrink-0 opacity-50 mt-1">{w}</span>
              <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: "var(--ginger)" }} />
              <div>
                <div className="ff-serif text-lg">{t}</div>
                <div className="ff-sans text-xs opacity-60 mt-1 leading-relaxed">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
};

/* ============================================================
   SLIDE — INVESTMENT
   ============================================================ */
const SlideInvestment = () => {
  const tiers = [
    {
      name: "Brand Foundation",
      price: "From $1,000",
      desc: "For getting a real identity in market, fast.",
      items: ["Logo & mark system", "Colour & type system", "Packaging label design", "Social media templates", "Brand guideline PDF"],
    },
    {
      name: "Brand + Website",
      price: "From $2,500",
      desc: "The complete transformation — recommended.",
      items: ["Everything in Brand Foundation", "5-page website: Home, Shop, Story, Wholesale, Contact", "CMS for products & journal", "Basic SEO setup", "Responsive, launch-ready build"],
      featured: true,
    },
    {
      name: "Full Export Platform",
      price: "Custom",
      desc: "For scaling wholesale & ecommerce together.",
      items: ["Everything in Brand + Website", "Full ecommerce & multi-currency checkout", "Wholesale / export request system", "Ongoing hosting & maintenance", "Marketing & CRM integrations"],
    },
  ];
  return (
    <SlideShell bg="var(--ivory)">
      <TopBar label="Investment" />
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bf-anim">
        <Eyebrow>Investment</Eyebrow>
        <h2 className="ff-serif mt-3 mb-8" style={{ fontSize: "clamp(1.9rem,3.4vw,2.6rem)" }}>
          Plans built for where Bakana Farms is headed.
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {tiers.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl p-6 flex flex-col"
              style={t.featured
                ? { background: "var(--forest)", color: "var(--ivory)", border: "1px solid var(--gold)" }
                : { background: "var(--ivory-2)", border: "1px solid rgba(36,26,18,.08)" }}
            >
              {t.featured && <PillTag tone="darkgold">Recommended</PillTag>}
              <div className="ff-serif text-xl mt-3">{t.name}</div>
              <div className="ff-sans text-xs opacity-60 mt-1">{t.desc}</div>
              <div className="ff-serif italic text-3xl mt-4" style={{ color: t.featured ? "var(--gold-light)" : "var(--ginger)" }}>{t.price}</div>
              <div className="mt-5 space-y-2.5 flex-1">
                {t.items.map((it) => (
                  <div key={it} className="flex items-start gap-2">
                    <Check size={13} className="mt-0.5 shrink-0" color={t.featured ? "var(--gold-light)" : "var(--canopy)"} />
                    <span className="ff-sans text-xs opacity-80 leading-relaxed">{it}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
};

/* ============================================================
   SLIDE — CTA
   ============================================================ */
const SlideCTA = () => (
  <SlideShell tone="dark" bg="radial-gradient(120% 100% at 50% 100%, #1E3627 0%, #16281F 50%, #0F1C15 100%)">
    <TopBar tone="dark" label="Let's begin" />
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center bf-anim">
      <Stamp dark size={100} />
      <Eyebrow dark>Ready When You Are</Eyebrow>
      <h2 className="ff-serif mt-4 leading-[1.02]" style={{ fontSize: "clamp(2rem,5.5vw,4rem)" }}>
        Let's give Bakana Farms<br />
        <span className="italic" style={{ color: "var(--gold-light)" }}>the brand it has earned.</span>
      </h2>
      <p className="ff-sans mt-5 max-w-md text-sm opacity-70 leading-relaxed">
        We're ready to start with Discovery next week. Let's turn three years of
        good product into a brand that opens doors, worldwide.
      </p>

      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <span className="flex items-center gap-2 ff-sans text-sm px-5 py-3 rounded-full" style={{ background: "var(--gold)", color: "var(--bark)" }}>
          <Mail size={15} /> youngdanmusa@gmail.com
        </span>
        <span className="flex items-center gap-2 ff-sans text-sm px-5 py-3 rounded-full border" style={{ borderColor: "rgba(232,204,114,.4)" }}>
          <Globe2 size={15} /> flowpixels.evcng.com
        </span>
      </div>

      <div className="flex items-center gap-5 mt-8 opacity-60 ff-mono text-[10px] uppercase tracking-[0.14em]">
        <span className="flex items-center gap-1.5"><Linkedin size={14} /> LinkedIn</span>
        <span className="flex items-center gap-1.5"><Globe2 size={14} /> Contra</span>
      </div>

      <div className="ff-mono text-[10px] uppercase tracking-[0.2em] opacity-40 mt-10">
        Flow Pixels Studio · Brand Design · Web Design & Development · Ecommerce · Hosting
      </div>
    </div>
  </SlideShell>
);

/* ============================================================
   DECK ASSEMBLY
   ============================================================ */
const SLIDES = [
  { C: SlideCover, group: "intro" },
  { C: SlideAgenda, group: "intro" },
  { C: SlideAboutBakana, group: "intro" },
  { C: SlideOpportunity, group: "intro" },
  { C: SlideVision, group: "intro" },
  { C: SlideAboutFlowPixels, group: "studio" },
  { C: SlideServices, group: "studio" },
  { C: SlideProcess, group: "studio" },
  { C: SlideWork, group: "studio" },
  { C: SlideBrandDivider, group: "brand" },
  { C: SlideBrandStrategy, group: "brand" },
  { C: SlideVisualIdentity, group: "brand" },
  { C: SlideBeforeAfter, group: "brand" },
  { C: SlideBrandApplication, group: "brand" },
  { C: SlideWebDivider, group: "web" },
  { C: SlideWebStrategy, group: "web" },
  { C: SlideHomepageUI, group: "web" },
  { C: SlideShopUI, group: "web" },
  { C: SlideTimeline, group: "close" },
  { C: SlideInvestment, group: "close" },
  { C: SlideCTA, group: "close" },
];

const GROUP_COLOR = {
  intro: "#C9A227",
  studio: "#8FAE8B",
  brand: "#B5602C",
  web: "#7FA8C9",
  close: "#E8CC72",
};

export default function BakanaFarmsPitchDeck() {
  const [idx, setIdx] = useState(0);
  const total = SLIDES.length;

  const go = useCallback((n) => setIdx((i) => Math.min(Math.max(i + n, 0), total - 1)), [total]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const Current = SLIDES[idx].C;

  return (
    <div className="bf-root w-full h-screen relative overflow-hidden select-none" style={{ background: "#0F1C15" }}>
      <style>{FONT_IMPORT}</style>

      <div className="absolute inset-0" key={idx}>
        <Current />
      </div>

      {/* progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] z-20" style={{ background: "rgba(0,0,0,.15)" }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${((idx + 1) / total) * 100}%`, background: "var(--gold)" }}
        />
      </div>

      {/* bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10 py-4 pointer-events-none">
        <button
          onClick={() => go(-1)}
          disabled={idx === 0}
          className="pointer-events-auto flex items-center gap-2 ff-mono text-[10px] uppercase tracking-[0.16em] px-4 py-2.5 rounded-full disabled:opacity-30 transition-opacity"
          style={{ background: "rgba(15,28,21,.55)", color: "#F5EFE0", backdropFilter: "blur(6px)" }}
        >
          <ArrowLeft size={13} /> Prev
        </button>

        <div className="pointer-events-auto hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-full" style={{ background: "rgba(15,28,21,.55)", backdropFilter: "blur(6px)" }}>
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all"
              style={{
                width: i === idx ? 18 : 6,
                height: 6,
                background: i === idx ? GROUP_COLOR[s.group] : "rgba(245,239,224,.35)",
              }}
            />
          ))}
        </div>

        <div className="pointer-events-auto flex items-center gap-3">
          <span className="ff-mono text-[10px] tracking-[0.16em]" style={{ color: "#F5EFE0", opacity: 0.7 }}>
            {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button
            onClick={() => go(1)}
            disabled={idx === total - 1}
            className="flex items-center gap-2 ff-mono text-[10px] uppercase tracking-[0.16em] px-4 py-2.5 rounded-full disabled:opacity-30 transition-opacity"
            style={{ background: "var(--gold)", color: "#241A12" }}
          >
            Next <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* click zones for quick nav on desktop */}
      <button
        aria-label="Previous slide"
        onClick={() => go(-1)}
        className="absolute left-0 top-0 bottom-16 w-1/6 z-10 cursor-w-resize"
        style={{ background: "transparent" }}
      />
      <button
        aria-label="Next slide"
        onClick={() => go(1)}
        className="absolute right-0 top-0 bottom-16 w-1/6 z-10 cursor-e-resize"
        style={{ background: "transparent" }}
      />
    </div>
  );
}
