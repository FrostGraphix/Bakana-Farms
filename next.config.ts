import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // Sanity CDN serves pre-transformed responsive variants so that image work
    // does not consume the Vercel image-optimization quota. See roadmap 14.6 M4.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 90],
  },

  experimental: {
    optimizePackageImports: ["@phosphor-icons/react", "motion"],
  },

  async redirects() {
    return [
      {
        source: "/shop",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/shop/blend",
        destination: "/products/moringa-ginger-tea",
        permanent: true,
      },
      {
        source: "/export",
        destination: "/wholesale",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // PCI DSS v4.0.1 SAQ A eligibility requires that the page framing the
        // payment fields is not susceptible to script injection. No third-party
        // scripts are permitted on checkout. See roadmap 5.3.
        source: "/checkout/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' https://js.paystack.co",
              "frame-src https://checkout.paystack.com",
              "connect-src 'self' https://api.paystack.co",
              "img-src 'self' https://cdn.sanity.io data:",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
