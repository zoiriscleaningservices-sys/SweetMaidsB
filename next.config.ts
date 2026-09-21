import type { NextConfig } from "next";

const cspDirectives = [
  "default-src 'self' https:",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.leadconnectorhq.com https://link.msgsndr.com https://challenges.cloudflare.com https://elfsightcdn.com https://www.googletagmanager.com https://cdnjs.cloudflare.com https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://unpkg.com",
  "img-src 'self' data: blob: https://*.leadconnectorhq.com https://ui-avatars.com https://upload.wikimedia.org https://elfsightcdn.com",
  "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com",
  "frame-src 'self' https://api.leadconnectorhq.com https://link.msgsndr.com https://challenges.cloudflare.com https://www.google.com https://www.google.com/maps/",
  "connect-src 'self' https://*.leadconnectorhq.com https://*.msgsndr.com https://services.leadconnectorhq.com https://challenges.cloudflare.com https://elfsightcdn.com https://www.google-analytics.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://*.leadconnectorhq.com https://services.leadconnectorhq.com",
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
            value: "same-origin",
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
