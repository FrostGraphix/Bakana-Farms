import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeScript } from "@/components/theme/theme-script";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ShoppingGuide } from "@/components/ai/shopping-guide";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ToastProvider } from "@/components/ui/toast-provider";
import { PageEffects } from "@/components/effects/page-effects";
import { LanguageProvider } from "@/components/i18n/language-provider";
import { CurrencyProvider } from "@/components/currency/currency-provider";
import { GlobalAnnouncementBar } from "@/components/layout/global-announcement-bar";
import { isClerkConfigured } from "@/server/auth/clerk";
import "./globals.css";

/**
 * Fonts are self-hosted, not fetched from Google at build time.
 *
 * Three reasons, in order of weight:
 *   1. `next/font/google` performs a network fetch during the
 *      build. Any CI runner behind a proxy that interferes with
 *      TLS fails the build for a reason unrelated to the code,
 *      which is exactly what happened here.
 *   2. No third-party request at runtime, so no visitor IP reaches
 *      a font CDN. That is one fewer disclosure to account for
 *      under the NDPA and one fewer entry in the cookie notice.
 *   3. Builds are faster and reproducible offline.
 *
 * These are variable fonts, so one file covers the whole weight
 * range. Fallback metrics are declared explicitly: fluid type
 * across seven breakpoints makes a badly matched swap very
 * visible, and CLS <= 0.1 is a launch requirement.
 */
const instrumentSerif = localFont({
  src: [
    { path: "./fonts/instrument-serif-latin.woff2", style: "normal", weight: "400" },
    { path: "./fonts/instrument-serif-italic-latin.woff2", style: "italic", weight: "400" },
  ],
  variable: "--font-instrument",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

const manrope = localFont({
  src: "./fonts/manrope-latin.woff2",
  variable: "--font-manrope",
  display: "swap",
  weight: "400 700",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
  adjustFontFallback: "Arial",
});

const jetbrains = localFont({
  src: "./fonts/jetbrains-mono-latin.woff2",
  variable: "--font-mono-jb",
  display: "swap",
  weight: "400 700",
  fallback: ["Consolas", "monospace"],
});

export const metadata: Metadata = {
  // Domain is not finalised, so nothing hard-codes it. Set
  // NEXT_PUBLIC_SITE_URL once the client confirms.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Bakana Farms | Moringa, Honey and Ginger Tea",
    template: "%s | Bakana Farms",
  },
  description:
    "Bakana Farms moringa, honey and ginger tea. Twenty individually packed tea bags for a warmer daily ritual.",
  openGraph: {
    type: "website",
    siteName: "Bakana Farms",
    locale: "en_NG",
    images: [
      {
        url: "/images/bakana-moringa-honey-ginger-hero-8k.webp",
        width: 1200,
        height: 1200,
        alt: "Bakana Farms Moringa, Honey and Ginger Tea",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Zoom is never disabled. WCAG 1.4.4.
  maximumScale: 5,
  themeColor: "#F6F1E7",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const authEnabled = isClerkConfigured();

  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${manrope.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <PageEffects />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-md)] focus:bg-[var(--surface-inverse)] focus:px-4 focus:py-3 focus:text-[var(--text-inverse)]"
        >
          Skip to content
        </a>
        <LanguageProvider>
          <CurrencyProvider>
            <AuthProvider>
              <CartProvider>
                <ToastProvider>
                  <GlobalAnnouncementBar />
                  <SiteHeader authEnabled={authEnabled} />
                  <div id="main">{children}</div>
                  <SiteFooter />
                  <CartDrawer />
                  <ShoppingGuide />
                </ToastProvider>
              </CartProvider>
            </AuthProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
