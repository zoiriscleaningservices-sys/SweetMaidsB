import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { CANONICAL_HOST } from "@/config/site-structure";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_HOST),
  title: "House Cleaning & Maid Services in Bradenton, FL | Sweet Maid",
  description: "Looking for trusted house cleaning in Bradenton, FL? Sweet Maid offers maid services, deep cleaning, and move-out cleans. Request your free estimate today.",
  alternates: {
    canonical: "/",
  },
};

import ClientInteractions from "@/components/ClientInteractions";
import FloatingBookingButton from "@/components/FloatingBookingButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.leadconnectorhq.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://link.msgsndr.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://widgets.leadconnectorhq.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://services.leadconnectorhq.com" crossOrigin="anonymous" />
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLMs.txt" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
      </head>
      <body className="antialiased font-sans">
        {children}
        <FloatingBookingButton />
        <ClientInteractions />
        <Script id="elfsight-loader" strategy="lazyOnload">
          {`
            if (document.querySelector('[class*="elfsight-app"]')) {
              var s = document.createElement('script');
              s.src = "https://elfsightcdn.com/platform.js";
              s.async = true;
              document.body.appendChild(s);
            }
          `}
        </Script>
      </body>
    </html>
  );
}
