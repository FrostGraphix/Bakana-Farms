"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
} from "motion/react";
import {
  List,
  X,
  ShoppingBag,
  MagnifyingGlass,
  CaretDown,
  ArrowRight,
  Package,
  Leaf,
  Certificate,
  NewspaperClipping,
  Buildings,
  Compass,
  Megaphone,
  FileText,
  CalendarBlank,
  Sparkle,
  ImageSquare,
  MapPin,
  ChatCircleDots,
  Briefcase,
  Question,
} from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSelector } from "@/components/i18n/language-selector";
import { CurrencySelector } from "@/components/currency/currency-selector";
import { useLanguage } from "@/components/i18n/language-provider";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Wordmark } from "@/components/brand/wordmark";
import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface DropdownLink {
  label: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
}

interface NavItem {
  key: string;
  defaultLabel: string;
  href?: string;
  dropdown?: {
    featured?: {
      title: string;
      description: string;
      href: string;
      cta: string;
    };
    links: DropdownLink[];
  };
}

const NAVIGATION: NavItem[] = [
  {
    key: "nav.products",
    defaultLabel: "Products",
    dropdown: {
      featured: {
        title: "20-Sachet Ritual Pack",
        description:
          "Single-origin Moringa leaves, cold-filtered honey, and warming ginger.",
        href: "/products",
        cta: "Explore blend",
      },
      links: [
        {
          label: "Shop All Products",
          href: "/products",
          description: "Browse individual packs and bundles.",
          icon: Package,
        },
        {
          label: "Botanical Sourcing",
          href: "/sourcing",
          description: "Sun, soil, and ethical farm partnerships.",
          icon: Leaf,
        },
        {
          label: "The Brewing Ritual",
          href: "/how-to-use",
          description: "Step-by-step guidance for morning clarity.",
          icon: Compass,
        },
      ],
    },
  },
  {
    key: "nav.ourStory",
    defaultLabel: "Our Story",
    dropdown: {
      featured: {
        title: "Rooted in Rivers State",
        description:
          "Cultivating African botanicals with dignity and scientific rigor.",
        href: "/our-story",
        cta: "Read our story",
      },
      links: [
        {
          label: "The Bakana Heritage",
          href: "/our-story",
          description: "Our origins, philosophy, and land stewardship.",
          icon: Buildings,
        },
        {
          label: "Quality & Testing",
          href: "/certifications",
          description: "Phytosanitary assurance and laboratory analysis.",
          icon: Certificate,
        },
        {
          label: "The Journal",
          href: "/journal",
          description: "Botanical wellness and export insights.",
          icon: NewspaperClipping,
        },
      ],
    },
  },
  {
    key: "nav.updates",
    defaultLabel: "Updates & Media",
    dropdown: {
      links: [
        {
          label: "Announcements",
          href: "/updates/category/announcements",
          description: "Company announcements and news",
          icon: Megaphone,
        },
        {
          label: "Case Studies",
          href: "/updates/category/case-studies",
          description: "Real-world implementation stories",
          icon: FileText,
        },
        {
          label: "Press Releases",
          href: "/updates/category/press-releases",
          description: "Official press releases and updates",
          icon: NewspaperClipping,
        },
        {
          label: "Events",
          href: "/updates/category/events",
          description: "Upcoming and past events",
          icon: CalendarBlank,
        },
        {
          label: "Celebrations",
          href: "/updates/category/celebrations",
          description: "Company milestones and celebrations",
          icon: Sparkle,
        },
        {
          label: "Media Gallery",
          href: "/updates/gallery",
          description: "Photos and videos from our projects",
          icon: ImageSquare,
        },
      ],
    },
  },
  {
    key: "nav.contactUs",
    defaultLabel: "Contact Us",
    dropdown: {
      links: [
        {
          label: "Office Locations",
          href: "/contact#locations",
          description: "Find our offices near you",
          icon: MapPin,
        },
        {
          label: "Support",
          href: "/contact#support",
          description: "Technical support and assistance",
          icon: ChatCircleDots,
        },
        {
          label: "Careers",
          href: "/contact#careers",
          description: "Join our team",
          icon: Briefcase,
        },
        {
          label: "FAQ",
          href: "/faq",
          description: "Frequently asked questions & answers",
          icon: Question,
        },
      ],
    },
  },
  {
    key: "nav.wholesale",
    defaultLabel: "Wholesale",
    dropdown: {
      featured: {
        title: "International Export",
        description:
          "Full pallet and master carton supply ready for global retail shelves.",
        href: "/wholesale",
        cta: "B2B Enquiries",
      },
      links: [
        {
          label: "Wholesale Information",
          href: "/wholesale",
          description: "MOQ tiers, carton specs, and distribution terms.",
          icon: Package,
        },
        {
          label: "Commercial Samples",
          href: "/contact",
          description: "Request buyer evaluation packs.",
          icon: Compass,
        },
      ],
    },
  },
  {
    key: "nav.stores",
    defaultLabel: "Stores",
    href: "/stores",
  },
  {
    key: "nav.trackOrder",
    defaultLabel: "Track Order",
    href: "/track-order",
  },
];

export function SiteHeader({ authEnabled }: { authEnabled: boolean }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const [condensed, setCondensed] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const { scrollY } = useScroll();
  const cinematic = pathname === "/" && !condensed;

  useMotionValueEvent(scrollY, "change", (v) => {
    setCondensed(v > 32);
  });

  const handleMouseEnter = (key: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  React.useEffect(() => {
    setActiveDropdown(null);
    setOpen(false);
  }, [pathname]);

  // Lock scroll when mobile sheet is open
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname?.startsWith("/checkout")) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-2.5 sm:top-4 z-40 mx-auto w-[min(94vw,1160px)] transition-all duration-300 pointer-events-none",
        condensed ? "translate-y-0" : "translate-y-0"
      )}
    >
      <header
        className={cn(
          "pointer-events-auto relative flex items-center justify-between rounded-full px-3.5 py-2 sm:px-6 sm:py-2.5 transition-all duration-300",
          cinematic
            ? "border border-white/20 bg-black/40 text-white shadow-xl backdrop-blur-xl"
            : "glass-pill border border-[var(--border-subtle)]/70 text-[var(--text-primary)] shadow-[var(--glass-shadow-pill)]"
        )}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
          aria-label="Bakana Farms, home"
        >
          <Wordmark className="h-7 sm:h-9" />
        </Link>

        {/* Desktop Navbar with Text Dropdowns */}
        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center gap-1"
          onMouseLeave={handleMouseLeave}
        >
          {NAVIGATION.map((item) => {
            const hasDropdown = Boolean(item.dropdown);
            const isOpen = activeDropdown === item.key;
            const label = t(item.key, item.defaultLabel);
            const isItemActive =
              (item.href && pathname === item.href) ||
              (item.dropdown?.links.some(
                (l) => pathname === l.href || (l.href !== "/" && pathname.startsWith(`${l.href}/`))
              ) ?? false);

            if (!hasDropdown && item.href) {
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-3 py-1.5 text-[length:var(--text-body-sm)] font-medium transition-colors duration-150 cursor-pointer",
                    isItemActive
                      ? "text-[var(--accent-text)] font-semibold"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]/70 hover:text-[var(--text-primary)]"
                  )}
                >
                  <span>{label}</span>
                  <div
                    className={cn(
                      "absolute -bottom-1 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-[var(--accent-line)] to-[var(--accent-text)] origin-center transition-all duration-300 ease-out",
                      isItemActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                    )}
                  />
                </Link>
              );
            }

            const useTwoColumns = Boolean(item.dropdown && !item.dropdown.featured && item.dropdown.links.length > 4);

            return (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.key)}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setActiveDropdown(isOpen ? null : item.key)
                  }
                  className={cn(
                    "relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[length:var(--text-body-sm)] font-medium transition-colors duration-150 cursor-pointer",
                    isOpen || isItemActive
                      ? "text-[var(--accent-text)] font-semibold"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]/70 hover:text-[var(--text-primary)]"
                  )}
                >
                  <span>{label}</span>
                  <CaretDown
                    size={12}
                    weight="bold"
                    className={cn(
                      "transition-transform duration-200",
                      isOpen
                        ? "rotate-180 text-[var(--accent-text)]"
                        : "text-[var(--text-secondary)]"
                    )}
                    aria-hidden
                  />
                  <div
                    className={cn(
                      "absolute -bottom-1 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-[var(--accent-line)] to-[var(--accent-text)] origin-center transition-all duration-300 ease-out",
                      isOpen || isItemActive
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0"
                    )}
                  />
                </button>

                {/* Dropdown Popover */}
                <AnimatePresence>
                  {isOpen && item.dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className={cn(
                        "absolute left-1/2 top-full mt-3 -translate-x-1/2 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-3 text-[var(--text-primary)] shadow-2xl backdrop-blur-2xl max-w-[calc(100vw-2rem)]",
                        item.dropdown.featured
                          ? "w-[34rem] p-5"
                          : useTwoColumns
                            ? "w-[560px]"
                            : "w-[320px]"
                      )}
                    >
                      {item.dropdown.featured ? (
                        <div className="grid grid-cols-[1.2fr_1fr] gap-4">
                          {/* Links List */}
                          <div className="flex flex-col gap-1.5">
                            {item.dropdown.links.map((link) => {
                              const Icon = link.icon;
                              const isLinkActive = pathname === link.href;
                              return (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  onClick={() => setActiveDropdown(null)}
                                  className={cn(
                                    "group flex items-start gap-3 rounded-[var(--radius-md)] p-2.5 transition-all duration-200",
                                    isLinkActive
                                      ? "bg-[var(--surface-subtle)] shadow-xs"
                                      : "hover:bg-[var(--surface-subtle)] hover:shadow-xs"
                                  )}
                                >
                                  <div
                                    className={cn(
                                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                                      isLinkActive
                                        ? "bg-[var(--accent-text)] text-[var(--surface-page)]"
                                        : "bg-[var(--surface-subtle)] text-[var(--accent-text)] group-hover:bg-[var(--accent-text)] group-hover:text-[var(--surface-page)]"
                                    )}
                                  >
                                    <Icon size={16} aria-hidden />
                                  </div>
                                  <div>
                                    <span
                                      className={cn(
                                        "block text-[length:var(--text-body-sm)] font-semibold transition-colors duration-200",
                                        isLinkActive
                                          ? "text-[var(--accent-text)]"
                                          : "text-[var(--text-primary)] group-hover:text-[var(--accent-text)]"
                                      )}
                                    >
                                      {link.label}
                                    </span>
                                    <span className="mt-0.5 block text-[length:var(--text-caption)] text-[var(--text-secondary)] leading-tight">
                                      {link.description}
                                    </span>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>

                          {/* Featured Callout Card */}
                          <div className="flex flex-col justify-between rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-4">
                            <div>
                              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--accent-text)] font-semibold">
                                Featured
                              </span>
                              <h4 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-semibold text-[var(--text-primary)] leading-snug">
                                {item.dropdown.featured.title}
                              </h4>
                              <p className="mt-2 text-[length:var(--text-caption)] text-[var(--text-secondary)] leading-relaxed">
                                {item.dropdown.featured.description}
                              </p>
                            </div>
                            <Link
                              href={item.dropdown.featured.href}
                              onClick={() => setActiveDropdown(null)}
                              className="group mt-4 inline-flex items-center gap-1.5 text-[length:var(--text-body-sm)] font-semibold text-[var(--accent-text)] hover:underline"
                            >
                              <span>{item.dropdown.featured.cta}</span>
                              <ArrowRight
                                size={14}
                                className="transition-transform group-hover:translate-x-1"
                                aria-hidden
                              />
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            useTwoColumns
                              ? "grid grid-cols-2 gap-x-3 gap-y-1"
                              : "flex flex-col gap-1"
                          )}
                        >
                          {item.dropdown.links.map((link) => {
                            const Icon = link.icon;
                            const isLinkActive =
                              pathname === link.href ||
                              (link.href !== "/" && pathname.startsWith(`${link.href}/`));
                            return (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setActiveDropdown(null)}
                                className={cn(
                                  "group flex items-start gap-3 rounded-xl p-2.5 transition-all duration-200 cursor-pointer",
                                  isLinkActive
                                    ? "bg-[var(--surface-subtle)] shadow-xs"
                                    : "hover:bg-[var(--surface-subtle)] hover:shadow-xs"
                                )}
                              >
                                <div
                                  className={cn(
                                    "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                                    isLinkActive
                                      ? "bg-[var(--accent-text)] text-[var(--surface-page)]"
                                      : "bg-[var(--surface-subtle)] text-[var(--accent-text)] group-hover:bg-[var(--accent-text)] group-hover:text-[var(--surface-page)]"
                                  )}
                                >
                                  <Icon size={18} aria-hidden />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div
                                    className={cn(
                                      "text-sm font-semibold transition-colors duration-200",
                                      isLinkActive
                                        ? "text-[var(--accent-text)]"
                                        : "text-[var(--text-primary)] group-hover:text-[var(--accent-text)]"
                                    )}
                                  >
                                    {link.label}
                                  </div>
                                  <div className="mt-0.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                                    {link.description}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Right Action Cluster: Search, Language, Theme, Auth, Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/search"
            aria-label={t("nav.search", "Search")}
            className="grid size-9 sm:size-10 place-items-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <MagnifyingGlass size={18} aria-hidden />
          </Link>

          <CurrencySelector className="hidden sm:inline-flex" />

          <LanguageSelector className="hidden sm:inline-block" />

          <ThemeToggle className="hidden sm:inline-flex" />

          {authEnabled ? (
            <AccountControls />
          ) : (
            <Link
              href="/account"
              className="hidden px-3 text-[length:var(--text-body-sm)] font-medium sm:inline text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {t("nav.account", "Account")}
            </Link>
          )}

          <CartButton />

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            className="grid size-9 sm:size-10 place-items-center rounded-full text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-subtle)] lg:hidden cursor-pointer"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} aria-hidden /> : <List size={20} aria-hidden />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Sheet */}
      <MobileSheet
        open={open}
        onClose={() => setOpen(false)}
        authEnabled={authEnabled}
      />
    </div>
  );
}

function AccountControls() {
  const { t } = useLanguage();
  return (
    <>
      <SignedOut>
        <Link
          href="/sign-in"
          className="hidden px-3 text-[length:var(--text-body-sm)] font-medium sm:inline text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          Sign in
        </Link>
      </SignedOut>
      <SignedIn>
        <Link
          href="/account"
          className="hidden px-3 text-[length:var(--text-body-sm)] font-medium sm:inline text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          {t("nav.account", "Account")}
        </Link>
        <UserButton />
      </SignedIn>
    </>
  );
}

function CartButton() {
  const { cart, open } = useCart();
  const reduce = useReducedMotion();
  const count = cart?.itemCount ?? 0;

  return (
    <button
      type="button"
      onClick={open}
      aria-label={count === 1 ? "Cart, 1 item" : `Cart, ${count} items`}
      className="relative grid size-9 sm:size-10 place-items-center rounded-full text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-subtle)] cursor-pointer"
    >
      <ShoppingBag size={19} aria-hidden />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={reduce ? false : { scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            aria-hidden
            className="absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-[var(--action-primary-bg)] px-1 font-[family-name:var(--font-mono)] text-[10px] font-semibold leading-4 tabular-nums text-[var(--action-primary-text)] shadow-sm"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function MobileSheet({
  open,
  onClose,
  authEnabled,
}: {
  open: boolean;
  onClose: () => void;
  authEnabled: boolean;
}) {
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { t } = useLanguage();

  React.useEffect(() => {
    if (!open) {
      setExpandedItem(null);
      return;
    }

    const opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const selector =
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';
    panelRef.current?.querySelector<HTMLElement>(selector)?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(selector)
      );
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      opener?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="pointer-events-auto mt-2 w-full max-h-[85vh] overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5 shadow-2xl backdrop-blur-2xl lg:hidden text-[var(--text-primary)]"
        >
          <div className="flex flex-col gap-1 divide-y divide-[var(--border-subtle)]">
            <div className="flex flex-col gap-1 pb-3">
              {NAVIGATION.map((item) => {
                const hasDropdown = Boolean(item.dropdown);
                const isExpanded = expandedItem === item.key;
                const label = t(item.key, item.defaultLabel);

                if (!hasDropdown && item.href) {
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "rounded-[var(--radius-md)] px-3 py-2.5 text-[length:var(--text-body)] font-medium transition-colors",
                        pathname === item.href
                          ? "bg-[var(--surface-subtle)] text-[var(--text-primary)] font-semibold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      )}
                    >
                      {label}
                    </Link>
                  );
                }

                return (
                  <div key={item.key} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedItem(isExpanded ? null : item.key)
                      }
                      className="flex items-center justify-between rounded-[var(--radius-md)] px-3 py-2.5 text-[length:var(--text-body)] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      <span>{label}</span>
                      <CaretDown
                        size={14}
                        weight="bold"
                        className={cn(
                          "transition-transform",
                          isExpanded && "rotate-180 text-[var(--accent-text)]"
                        )}
                        aria-hidden
                      />
                    </button>

                    {isExpanded && item.dropdown && (
                      <div className="ml-2 mt-1 flex flex-col gap-1 border-l border-[var(--border-subtle)] pl-3">
                        {item.dropdown.links.map((link) => {
                          const Icon = link.icon;
                          const isLinkActive = pathname === link.href;
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={onClose}
                              className={cn(
                                "flex items-center gap-2.5 rounded-[var(--radius-sm)] py-2 text-[length:var(--text-body-sm)] transition-colors",
                                isLinkActive
                                  ? "text-[var(--accent-text)] font-semibold"
                                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                              )}
                            >
                              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-subtle)] text-[var(--accent-text)]">
                                <Icon size={14} aria-hidden />
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="block font-medium">{link.label}</span>
                                <span className="block text-[length:var(--text-caption)] text-[var(--text-secondary)] truncate">
                                  {link.description}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Controls & Actions */}
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <ThemeToggle />
                  <CurrencySelector />
                  <LanguageSelector condensed />
                </div>
                {authEnabled && (
                  <Link
                    href="/account"
                    onClick={onClose}
                    className="text-[length:var(--text-body-sm)] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    {t("nav.account", "Account")}
                  </Link>
                )}
              </div>

              <Link
                href="/products"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--action-primary-bg)] px-5 py-3 text-[length:var(--text-body)] font-semibold text-[var(--action-primary-text)] shadow-md"
              >
                <span>Shop Bakana Farms</span>
                <ArrowRight size={16} weight="bold" aria-hidden />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
