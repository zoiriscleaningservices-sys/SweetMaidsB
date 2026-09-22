import type { NextConfig } from "next";

const cspDirectives = [
  "default-src 'self' https:",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.leadconnectorhq.com https://link.msgsndr.com https://challenges.cloudflare.com https://elfsightcdn.com https://www.googletagmanager.com https://cdnjs.cloudflare.com https://unpkg.com https://*.bookingkoala.com https://sweetmaidcleaningservice.bookingkoala.com https://sweetmaidcleaning.bookingkoala.com https://cdn.bookingkoala.com https://js.stripe.com https://m.stripe.network",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://unpkg.com https://*.bookingkoala.com https://cdn.bookingkoala.com",
  "img-src 'self' data: blob: https://*.leadconnectorhq.com https://ui-avatars.com https://upload.wikimedia.org https://elfsightcdn.com https://*.bookingkoala.com https://cdn.bookingkoala.com https://*.stripe.com https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev https://i.ibb.co",
  "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com https://*.bookingkoala.com https://cdn.bookingkoala.com",
  "frame-src 'self' https://api.leadconnectorhq.com https://link.msgsndr.com https://challenges.cloudflare.com https://www.google.com https://www.google.com/maps/ https://*.openstreetmap.org https://www.openstreetmap.org https://*.bookingkoala.com https://sweetmaidcleaningservice.bookingkoala.com https://sweetmaidcleaning.bookingkoala.com https://bookingkoala.com https://*.stripe.com https://js.stripe.com https://hooks.stripe.com",
  "connect-src 'self' https://*.leadconnectorhq.com https://*.msgsndr.com https://services.leadconnectorhq.com https://challenges.cloudflare.com https://elfsightcdn.com https://www.google-analytics.com https://*.bookingkoala.com https://sweetmaidcleaningservice.bookingkoala.com https://sweetmaidcleaning.bookingkoala.com https://cdn.bookingkoala.com https://api.stripe.com https://m.stripe.network",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://*.leadconnectorhq.com https://services.leadconnectorhq.com https://*.bookingkoala.com https://sweetmaidcleaningservice.bookingkoala.com",
  "upgrade-insecure-requests"
].join("; ");

const nextConfig: NextConfig = {
  trailingSlash: true,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspDirectives,
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(css|js|fonts)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/templates/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/privacy",
        destination: "/privacy-policy/",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/terms-and-conditions/",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        destination: "/terms-and-conditions/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
