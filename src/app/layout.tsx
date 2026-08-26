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
  title: "#1 Rated House Cleaning & Professional Maid Services in Bradenton, FL",
  description: "Looking for the best cleaning service in Bradenton, FL? Sweet Maid offers top-rated house cleaning, deep cleaning, and move-out services. Licensed, insured, and 100% satisfaction guaranteed. Book your sparkle today!",
  keywords: "cleaning service Bradenton, house cleaning Lakewood Ranch, maid service Palmetto, deep cleaning Parrish, move out cleaning Bradenton, residential cleaning Manatee County, eco-friendly cleaning",
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
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://unpkg.com" />
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLMs.txt" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans">
        {children}
        <FloatingBookingButton />
        <ClientInteractions />
        <Script src="https://unpkg.com/aos@2.3.4/dist/aos.js" strategy="lazyOnload" />
        <Script src="/js/navigation-dynamic.js" strategy="lazyOnload" />
        <Script id="elfsight-loader" strategy="lazyOnload">
          {`
            if (document.querySelector('.elfsight-app')) {
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
