import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "#1 Rated House Cleaning & Professional Maid Services in Bradenton, FL",
  description: "Looking for the best cleaning service in Bradenton, FL? Sweet Maid offers top-rated house cleaning, deep cleaning, and move-out services. Licensed, insured, and 100% satisfaction guaranteed. Book your sparkle today!",
  keywords: "cleaning service Bradenton, house cleaning Lakewood Ranch, maid service Palmetto, deep cleaning Parrish, move out cleaning Bradenton, residential cleaning Manatee County, eco-friendly cleaning",
};

import ClientInteractions from "@/components/ClientInteractions";
import FloatingBookingButton from "@/components/FloatingBookingButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://cdn-4.convertexperiments.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body className="antialiased">
        {children}
        <FloatingBookingButton />
        <ClientInteractions />
        <Script src="https://unpkg.com/aos@2.3.4/dist/aos.js" strategy="beforeInteractive" />
        <Script src="/js/navigation-dynamic.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
