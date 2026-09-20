"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { is305Area } from "@/lib/miami_broward_slugs";

export default function FloatingBookingButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const pathname = usePathname();
  const pathSegments = pathname ? pathname.split('/').filter(Boolean) : [];
  const slug = pathSegments[0] || '';
  const is305 = pathSegments.some((seg) => is305Area(seg));
  const phoneNumber = is305 ? "3058516959" : "9412222080";
  const phoneDisplay = is305 ? "(305) 851-6959" : "(941) 222-2080";

  const hasLocalQuote = !["locations", "privacy-policy", "terms-and-conditions", "privacy", "terms"].includes(slug);
  const quoteHref = hasLocalQuote ? "#quote" : "/#quote";

  // Hide floating action button completely on booking and checkout pages so it never blocks the pricing summary or payment inputs
  if (
    pathname?.startsWith("/book-online") ||
    pathname?.startsWith("/booknow") ||
    pathname?.startsWith("/login") ||
    slug === "book-online" ||
    slug === "booknow"
  ) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      // The hero section is roughly 500-700px.
      if (window.scrollY > 600 && !hasClicked) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check immediately on mount in case it was a reload

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasClicked]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Floating Action Cluster - Bottom Center */}
      <div 
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-auto transition-all duration-700 ${(!isVisible || hasClicked) ? 'translate-y-32 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
      >
        {/* Instant Call Button */}
        <a
          href={`tel:${phoneNumber}`}
          aria-label={`Call Sweet Maid at ${phoneDisplay}`}
          className="group relative flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-pink-500 px-6 py-2.5 rounded-[2rem] shadow-[0_5px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_25px_rgba(236,72,153,0.3)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] border-2 border-pink-100"
        >
          <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-pink-50">
            <i className="fa-solid fa-phone text-pink-400 text-xs"></i>
          </div>
          <span className="font-bold text-[0.95rem] tracking-tight whitespace-nowrap">{phoneDisplay}</span>
        </a>

        {/* Action Button: Get Your Free Quote on desktop and mobile */}
        <a
          href={quoteHref}
          onClick={() => {
            setHasClicked(true);
            setTimeout(() => setHasClicked(false), 3000);
          }}
          aria-label="Get your free cleaning quote"
          className="group relative flex items-center gap-2.5 sm:gap-3 bg-gradient-to-br from-pink-500 via-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-[2rem] shadow-[0_10px_35px_rgba(236,72,153,0.5)] hover:shadow-[0_15px_45px_rgba(236,72,153,0.7)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] border-2 border-pink-200/50"
        >
          <span className="absolute -inset-0.5 bg-gradient-to-r from-pink-200 to-white opacity-30 blur-sm rounded-full group-hover:opacity-50 transition-opacity"></span>
          <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 shadow-inner">
            <i className="fa-solid fa-file-invoice-dollar text-white text-xs sm:text-sm drop-shadow-md"></i>
          </div>
          <span className="relative font-bold text-[1rem] sm:text-[1.1rem] tracking-tight whitespace-nowrap">Get Your Free Quote</span>
        </a>
      </div>

      {/* Back to Top Button - Bottom Right (above chat widget) */}
      <div 
        className={`absolute bottom-28 right-6 pointer-events-auto transition-all duration-700 ${!isVisible ? 'translate-y-12 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
      >
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center justify-center w-12 h-12 bg-white text-pink-400 hover:text-white hover:bg-pink-400 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_25px_rgba(236,72,153,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 border border-pink-100"
          aria-label="Back to Top"
        >
          <i className="fa-solid fa-arrow-up text-lg"></i>
        </button>
      </div>
    </div>
  );
}
