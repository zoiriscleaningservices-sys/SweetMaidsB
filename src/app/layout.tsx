import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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
  metadataBase: new URL("https://sweetmaidcleaning.com"),
  title: "House Cleaning & Maid Services in Bradenton, FL | Sweet Maid",
  description: "Looking for trusted house cleaning in Bradenton, FL? Sweet Maid offers top-rated maid services, deep cleaning & move-out cleans. Get your free estimate today!",
  keywords: "house cleaning Bradenton FL, maid service Bradenton, deep cleaning services Bradenton, move out cleaning Bradenton, cleaning service Lakewood Ranch, residential cleaning Manatee County, home cleaners Sarasota FL, Sweet Maid cleaning",
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
        <Script
          src="https://link.msgsndr.com/js/form_embed.js"
          strategy="afterInteractive"
        />
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
